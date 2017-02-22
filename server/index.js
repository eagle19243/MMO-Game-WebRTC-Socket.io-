import express              from 'express';
import path                 from 'path';
import Debug                from 'debug';
import session              from 'express-session';
import Redis                from 'connect-redis';
import favicon              from 'serve-favicon';
import logger               from 'morgan';
import bodyParser           from 'body-parser';
import passport             from 'passport';
import cons                 from 'consolidate';
import shortid              from 'shortid';
import webpack              from 'webpack';
import webpackMiddleware    from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config               from '../webpack.config.js';
import Player               from './player';
import routes               from './routes/index';
import models               from './models/index';
import sprites              from '../app/js/sprites.js';
import msgpack              from './lib/binary.js';

import {
  pointBonus,
  deleteBonus,
  addBonus,
  setBonus,
  setSpeed,
  checkExtra,
  checkBonuses,
  gotBonuses,
  randomBonus,
  infection
} from './lib/bonus';

import {
  checkPowers,
  moveInOut,
  invisible,
  slower,
  fire
} from './lib/power';

const isDeveloping = process.env.NODE_ENV !== 'production';
const app          = express();
const debug        = Debug('app');
const RedisStore   = Redis(session);
let timeDelta      = Date.now();

app.engine('tpl', cons.mustache);
app.set('view engine', 'tpl');
app.set('views', `${__dirname}/views`);
if (app.get('env') !== 'development') {
  app.enable('view cache');
} else {
  app.use(logger('dev'));
}
app.set('trust proxy', true);
app.use(bodyParser.json({
  limit: '20mb'
}));
app.use(bodyParser.urlencoded({
  limit: '20mb',
  extended: true
}));

const sessionConfig = {
  store: new RedisStore({
    host: process.env.REDIS,
    port: 6379,
    pass: ''
  }),
  secret: process.env.SECRET,
  proxy: true,
  cookie: {
    domain: `.${process.env.DOMAIN}`,
    httpOnly: false,
    secure: true,
    maxAge: null
  },
  resave: false,
  saveUninitialized: true
};

if (isDeveloping) {
  app.use(logger('dev'));
  sessionConfig.cookie.secure = false;
  sessionConfig.cookie.maxAge = 31536000000;
  app.use(session(sessionConfig));
  app.use(favicon(`${__dirname}/../app/favicon.ico`));
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(favicon(`${__dirname}/../dist/app/favicon.ico`));
  app.use(session(sessionConfig));
  app.use('/', express.static(path.join(__dirname, '../dist'), {
    maxage: '7d'
  }));
}

app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

import Http           from 'http';
import IO             from 'socket.io';
import SAT            from 'sat';
import Config         from '../config.json';
import * as Util      from './lib/util';
import SimpleQuadTree from 'simple-quadtree';

const http = (Http).Server(app);
const io = (IO)(http);
io.set('transports', ['websocket']);
io.engine.ws = new (require('uws').Server)({
  noServer: true,
  perMessageDeflate: false
});

// TODO: GET THIS WORKING
const sqt = SimpleQuadTree(0, 0, Config.gameWidth, Config.gameHeight);

const users    = [];
const massFood = [];
const food     = [];
const virus    = [];
const bots     = [];
const glue     = [];
const shield   = [];
const bomb     = [];
const drunk    = [];
const mega     = [];
const shoot    = [];
const x2       = [];
const x5       = [];
const extra1   = [];
const extra2   = [];
const extra3   = [];
const extra4   = [];
const extra5   = [];
const freeze   = [];
const speed    = [];
const bullet   = [];
const sockets  = {};

let leaderboard = [];
let leaderboardChanged = false;

const V = SAT.Vector;
const C = SAT.Circle;

const nameIndex = []
const nameGenerate = function(){
  var calcIndex = nameIndex.indexOf(false);
  if(calcIndex == -1)
    calcIndex = nameIndex.length
  nameIndex[calcIndex] = 1
  // return calcIndex;
  return `blobber${calcIndex}`
}
const releaseName = (name) => {
  name = (name || '') + ''
  if(/^(blobber([1-9][0-9]*))$/u.test(name)){
    var index = name.replace('blobber','') * 1
    nameIndex[index] = false
  }
}


function addFood(add) {
  const radius = Util.massToRadius(Config.foodMass);
  let toAdd = add;
  while (toAdd--) {
    const position = Config.foodUniformDisposition ? Util.uniformPosition(food, radius) : Util.randomPosition(radius);
    food.push({
      id: shortid.generate(),
      x: position.x,
      y: position.y,
      radius: radius,
      mass: Math.random() + 2,
      hue: Math.round(Math.random() * 360)
    });
  }
}

function addVirus(add) {
  let toAdd = add;
  while (toAdd--) {
    const mass = Util.randomInRange(Config.virus.defaultMass.from, Config.virus.defaultMass.to, true);
    const radius = Util.massToRadius(mass);
    const position = Config.virusUniformDisposition ? Util.uniformPosition(virus, radius) : Util.randomPosition(radius);
    virus.push({
      id: shortid.generate(),
      x: position.x,
      y: position.y,
      radius: radius,
      mass: mass,
      fill: Config.virus.fill,
      stroke: Config.virus.stroke,
      strokeWidth: Config.virus.strokeWidth
    });
  }
}

function killUser(io, player) {
  io.emit('playerDied', { name: player.name });
  releaseName(player.name);
  sockets[player.id].emit('RIP');
  player.type = 'spectate';
  player.followMode = 'died';
  player.bonus.got = {};
  if (player.power.next) {
    player.power.current = player.power.next;
    delete player.power.next;
  }
}

function addBot(add) {
  let toAdd = add;
  while (toAdd--) {
    const radius = Util.massToRadius(Config.defaultPlayerMass);
    const position = Util.randomPosition(radius);
    const bot = new Player(
      shortid.generate(),
      `Bot ${toAdd}`,
      position,
      Config.bots.type,
      Config.slowBase
    );
    bot.radius = radius;
    bot.target.directionX = 'left' || 'right';
    bot.target.directionY = 'up' || 'down';
    bot.bonus = {
      got: {}
    };
    bot.sprite = Config.url + sprites[Util.randomProperty(sprites)].sprites['1'];
    bots.push(bot);
  }
}

function removeFood(rem) {
  let toRem = rem;
  while (toRem--) {
    food.pop();
  }
}

function moveMass(mass) {
  const deg = Math.atan2(mass.target.y, mass.target.x);
  const deltaY = mass.speed * Math.sin(deg);
  const deltaX = mass.speed * Math.cos(deg);

  mass.speed -= 0.5;
  if (mass.speed < 0) {
    mass.speed = 0;
  }
  if (!isNaN(deltaY)) {
    mass.y += deltaY;
  }
  if (!isNaN(deltaX)) {
    mass.x += deltaX;
  }

  const borderCalc = mass.radius + 5;

  if (mass.x > Config.gameWidth - borderCalc) {
    mass.x = Config.gameWidth - borderCalc;
  }
  if (mass.y > Config.gameHeight - borderCalc) {
    mass.y = Config.gameHeight - borderCalc;
  }
  if (mass.x < borderCalc) {
    mass.x = borderCalc;
  }
  if (mass.y < borderCalc) {
    mass.y = borderCalc;
  }
}

function moveBullet(bull) {
  const deg = Math.atan2(bull.target.y, bull.target.x);
  const deltaY = bull.speed * Math.sin(deg);
  const deltaX = bull.speed * Math.cos(deg);

  bull.speed -= 0.5;
  if (bull.speed < 0) {
    bull.speed = 0;
  }
  if (!isNaN(deltaY)) {
    bull.y += deltaY;
  }
  if (!isNaN(deltaX)) {
    bull.x += deltaX;
  }

  const borderCalc = bull.radius + 5;

  if (bull.x > Config.gameWidth - borderCalc) {
    bull.x = Config.gameWidth - borderCalc;
  }
  if (bull.y > Config.gameHeight - borderCalc) {
    bull.y = Config.gameHeight - borderCalc;
  }
  if (bull.x < borderCalc) {
    bull.x = borderCalc;
  }
  if (bull.y < borderCalc) {
    bull.y = borderCalc;
  }
}

function balanceMass() {
  const totalMass = food.length * Config.foodMass + users
  .map((u) => { return u.massTotal; })
  .reduce((pu, cu) => { return pu + cu; }, 0);

  const massDiff = Config.gameMass - totalMass;
  const maxFoodDiff = Config.maxFood - food.length;
  const foodDiff = parseInt(massDiff / Config.foodMass, 10) - maxFoodDiff;
  const foodToAdd = Math.min(foodDiff, maxFoodDiff);
  const foodToRemove = -Math.max(foodDiff, maxFoodDiff);

  if (foodToAdd > 0) {
    debug('[DEBUG] Adding ' + foodToAdd + ' food to level!');
    addFood(foodToAdd);
    debug('[DEBUG] Mass rebalanced!');
  } else if (foodToRemove > 0) {
    debug('[DEBUG] Removing ' + foodToRemove + ' food from level!');
    removeFood(foodToRemove);
    debug('[DEBUG] Mass rebalanced!');
  }

  const virusToAdd = Config.virus.maxVirus - virus.length;
  if (virusToAdd > 0) {
    addVirus(virusToAdd);
  }

  if (Config.bonus.Glue.active) {
    const glueToAdd = Config.bonus.Glue.max - glue.length;
    if (glueToAdd > 0) {
      addBonus(glueToAdd, glue, 'glue');
    }
  }

  if (Config.bonus.Shield.active) {
    const shieldToAdd = Config.bonus.Shield.max - shield.length;
    if (shieldToAdd > 0) {
      addBonus(shieldToAdd, shield, 'shield');
    }
  }

  if (Config.bonus.Bomb.active) {
    const bombToAdd = Config.bonus.Bomb.max - bomb.length;
    if (bombToAdd > 0) {
      addBonus(bombToAdd, bomb, 'bomb');
    }
  }

  if (Config.bonus.Drunk.active) {
    const drunkToAdd = Config.bonus.Drunk.max - drunk.length;
    if (drunkToAdd > 0) {
      addBonus(drunkToAdd, drunk, 'drunk');
    }
  }

  if (Config.bonus.Mega.active) {
    const megaToAdd = Config.bonus.Mega.max - mega.length;
    if (megaToAdd > 0) {
      addBonus(megaToAdd, mega, 'mega');
    }
  }

  if (Config.bonus.Shoot.active) {
    const shootToAdd = Config.bonus.Shoot.max - shoot.length;
    if (shootToAdd > 0) {
      addBonus(shootToAdd, shoot, 'shoot');
    }
  }

  if (Config.bonus.X2.active) {
    const x2ToAdd = Config.bonus.X2.max - x2.length;
    if (x2ToAdd > 0) {
      addBonus(x2ToAdd, x2, 'x2');
    }
  }

  if (Config.bonus.X5.active) {
    const x5ToAdd = Config.bonus.X5.max - x5.length;
    if (x5ToAdd > 0) {
      addBonus(x5ToAdd, x5, 'x5');
    }
  }

  if (Config.bonus.Extra1.active) {
    const extra1ToAdd = Config.bonus.Extra1.max - extra1.length;
    if (extra1ToAdd > 0) {
      addBonus(extra1ToAdd, extra1, 'extra1');
    }
  }

  if (Config.bonus.Extra2.active) {
    const extra2ToAdd = Config.bonus.Extra2.max - extra2.length;
    if (extra2ToAdd > 0) {
      addBonus(extra2ToAdd, extra2, 'extra2');
    }
  }

  if (Config.bonus.Extra3.active) {
    const extra3ToAdd = Config.bonus.Extra3.max - extra3.length;
    if (extra3ToAdd > 0) {
      addBonus(extra3ToAdd, extra3, 'extra3');
    }
  }

  if (Config.bonus.Extra4.active) {
    const extra4ToAdd = Config.bonus.Extra4.max - extra4.length;
    if (extra4ToAdd > 0) {
      addBonus(extra4ToAdd, extra4, 'extra4');
    }
  }

  if (Config.bonus.Extra5.active) {
    const extra5ToAdd = Config.bonus.Extra5.max - extra5.length;
    if (extra5ToAdd > 0) {
      addBonus(extra5ToAdd, extra5, 'extra5');
    }
  }

  if (Config.bonus.Freeze.active) {
    const freezeToAdd = Config.bonus.Freeze.max - freeze.length;
    if (freezeToAdd > 0) {
      addBonus(freezeToAdd, freeze, 'freeze');
    }
  }

  if (Config.bonus.Speed.active) {
    const speedToAdd = Config.bonus.Speed.max - speed.length;
    if (speedToAdd > 0) {
      addBonus(speedToAdd, speed, 'speed');
    }
  }

  if (Config.bots.active) {
    const botToAdd = Config.bots.maxBot - bots.length;
    if (botToAdd > 0) {
      addBot(botToAdd);
    }
  }

  if (bullet.length > 0) {
    for (let i = 0; i < bullet.length; i++) {
      if (Date.now() - bullet[i].time > Config.bullets.removeTime * 1000) {
        bullet.splice(i, 1);
      }
    }
  }
}

io.on('connection', (socket) => {
  console.log('A user connected!', socket.handshake.query.type);

  const type = socket.handshake.query.type;
  let radius = Util.massToRadius(Config.defaultPlayerMass);
  let position = Config.newPlayerInitialPosition === 'farthest' ? Util.uniformPosition(users, radius) : Util.randomPosition(radius);
  let currentPlayer = new Player(socket.id, '', position, type);

  socket.on('forceupdate', player => {
    const index = users.indexOf(currentPlayer);
    const playerName = (player.name || '').trim() || (player.type === 'player' && nameGenerate()) || '';
    radius = Util.massToRadius(Config.defaultPlayerMass);
    position = Config.newPlayerInitialPosition === 'farthest' ? Util.uniformPosition(users, radius) : Util.randomPosition(radius);
    currentPlayer = new Player(player.id, player.type === 'player' ? playerName : '', position, player.type || type, Config.slowBase, player.power.current);
    if (index > -1) {
      users[index] = currentPlayer;
    }
    setBonus(currentPlayer.bonus, 'shield');
    socket.emit('playerJoin', { name: currentPlayer.name });

    sessionConfig.store.get(player.sessionID, (err, sess) => {
      if (err) {
        console.error(err);
      } else {
        if (sess !== undefined) {
          for (let i = 0; i < sess.powers.droplist.length; i++) {
            if (sess.powers.droplist[i].value === true) {
              player.power.current = sess.powers.droplist[i].key;
            }
          }
        }
        currentPlayer = new Player(player.id, playerName, position, player.type || type, Config.slowBase, player.power.current);
        if (index > -1) {
          users[index] = currentPlayer;
        }
        setBonus(currentPlayer.bonus, 'shield');
        console.log(currentPlayer);
        socket.emit('playerJoin', { name: currentPlayer.name });
      }
    });
  });

  socket.on('spectate', info => {
    if (currentPlayer.type === 'spectate') {
      currentPlayer.followMode = info;
    }
  });

  socket.on('gotit', (player) => {
    console.log(`[INFO] Player ${player.name} connecting!`);

    if (Util.findIndex(users, player.id) > -1) {
      console.log('[INFO] Player ID is already connected, kicking.');
      socket.disconnect();
    } else if (!Util.validNick(player.name)) {
      socket.emit('kick', 'Invalid username.');
      socket.disconnect();
    } else {
      console.log(`[INFO] Player ${player.name} connected!`);
      sockets[player.id] = socket;

      radius = Util.massToRadius(Config.defaultPlayerMass);
      position = Config.newPlayerInitialPosition === 'farthest' ? Util.uniformPosition(users, radius) : Util.randomPosition(radius);
      currentPlayer = new Player(player.id, player.name, position, type, Config.slowBase, player.power.current);
      users.push(currentPlayer);

      socket.emit('playerJoin', { name: currentPlayer.name });

      socket.emit('gameSetup', {
        gameWidth: Config.gameWidth,
        gameHeight: Config.gameHeight
      });
    }
  });

  socket.on('drip', () => {
    socket.emit('drop');
  });

  socket.on('windowResized', (data) => {
    currentPlayer.resize(data);
  });

  socket.on('respawn', () => {
    if (Util.findIndex(users, currentPlayer.id) > -1) {
      users.splice(Util.findIndex(users, currentPlayer.id), 1);
    }
    currentPlayer.totalUsers = users.length;
    socket.emit('welcome', currentPlayer);
    console.log(`[INFO] User ${currentPlayer.name} respawned!`);
  });

  socket.on('disconnect', () => {
    if (Util.findIndex(users, currentPlayer.id) > -1) {
      users.splice(Util.findIndex(users, currentPlayer.id), 1);
    }
    console.log(`[INFO] User ${currentPlayer.name} disconnected!`);
    socket.broadcast.emit('playerDisconnect', { name: currentPlayer.name });
    if (currentPlayer.type === 'player') {
      releaseName(currentPlayer.name);
    }
  });

  socket.on('playerChat', (data) => {
    const message = data.message.replace(/(<([^>]+)>)/ig, '');
    if (Config.logChat === 1) {
      console.log(`[CHAT] [${(new Date()).getHours()}:${(new Date()).getMinutes()}] ${currentPlayer.name}: ${message}`);
    }
    socket.broadcast.emit('serverSendPlayerChat', {
      sender: currentPlayer.name, message: message.substring(0, 35)
    });
    socket.emit('serverSendPlayerChat', {
      sender: currentPlayer.name,
      message: message.substring(0, 35),
      me: true
    });
  });

  socket.on('pass', (data) => {
    if (data[0] === Config.adminPass) {
      console.log(`[ADMIN] ${currentPlayer.name} just logged in as an admin!`);
      socket.emit('serverMSG', `Welcome back ${currentPlayer.name}`);
      socket.broadcast.emit('serverMSG', `${currentPlayer.name} just logged in as admin!`);
      currentPlayer.admin = true;
    } else {
      console.log(`[ADMIN] ${currentPlayer.name} attempted to log in with incorrect password.`);
      socket.emit('serverMSG', 'Password incorrect, attempt logged.');
      // TODO: Actually log incorrect passwords.
    }
  });

  socket.on('kick', (data) => {
    if (currentPlayer.admin) {
      const [name, ...reasons] = data;
      let reason = '';
      let worked = false;
      for (let e = 0; e < users.length; e++) {
        if (users[e].name === name && !users[e].admin && !worked) {
          reason = reasons.reduce((rs, r) => rs + ' ' + r, '');
          if (reason !== '') {
            console.log(`[ADMIN] User ${users[e].name} kicked successfully by ${currentPlayer.name} for reason ${reason}`);
          } else {
            console.log(`[ADMIN] User ${users[e].name} kicked successfully by ${currentPlayer.name}`);
          }
          socket.emit('serverMSG', `User ${users[e].name} was kicked by ${currentPlayer.name}`);
          sockets[users[e].id].emit('kick', reason);
          sockets[users[e].id].disconnect();
          users.splice(e, 1);
          worked = true;
        }
      }
      if (!worked) {
        socket.emit('serverMSG', 'Could not locate user or user is an admin.');
      }
    } else {
      console.log(`[ADMIN] ${currentPlayer.name} is trying to use -kick but isn't an admin.`);
      socket.emit('serverMSG', 'You are not permitted to use this command.');
    }
  });

  // Heartbeat function, update everytime.
  socket.on('0', (target) => {
    currentPlayer.heartbeat(target);
  });

  socket.on('1', () => {
    currentPlayer.fireFood(massFood);
  });

  socket.on('2', (virusCell) => {
    console.log(currentPlayer);
    if (currentPlayer.power.current === 'splitter') {
      if (currentPlayer.canSplit()) {
        // Split single cell from virus
        if (virusCell) {
          currentPlayer.splitCell(currentPlayer.cells[virusCell]);
        } else {
          // Split all cells
          currentPlayer.splitAllCells();
        }
        currentPlayer.lastSplit = new Date().getTime();
      }
    }
    if ((currentPlayer.power.last === undefined) ||
        (Date.now() - (Config.power.executeInterval * 1000) > currentPlayer.power.last)) {
      if (currentPlayer.power.current === 'speedo') {
        setSpeed(currentPlayer.cells, Config.power.Speedo.value);
      } else if (currentPlayer.power.current === 'teleport') {
        const pos = Util.uniformPosition(users, radius);
        currentPlayer.x = pos.x;
        currentPlayer.y = pos.y;
        for (let i = 0; i < currentPlayer.cells.length; i++) {
          currentPlayer.cells[i].x = pos.x;
          currentPlayer.cells[i].y = pos.y;
        }
        setBonus(currentPlayer.bonus, 'shield');
      }
      currentPlayer.power.active = true;
      currentPlayer.power.last = new Date().getTime();
    }
  });

  socket.on('playerPower', (power, sessionID) => {
    if (sessionID) {
      sessionConfig.store.get(sessionID, (err, sess) => {
        if (err) {
          console.error(err);
        } else {
          if (sess !== undefined) {
            for (let i = 0; i < sess.powers.droplist.length; i++) {
              if (sess.powers.droplist[i].key === power) {
                sess.powers.droplist[i].value = true;
              } else {
                sess.powers.droplist[i].value = false;
              }
            }
            sessionConfig.store.set(sessionID, sess, (e) => {
              if (e) {
                console.error(e);
              } else {
                socket.emit('serverMSG', `{POWER} - <b>${power}</b>`);
                currentPlayer.power.next = power;
              }
            });
          }
        }
      });
    } else {
      socket.emit('serverMSG', 'Without sessions don\'t work');
    }
  });
});

function moveBot() {
  bots.forEach(bot => {
    checkBonuses(bot, true);
    gotBonuses(bot);
    if (bot.x < 100 && bot.target.directionX === 'left') {
      bot.target.x = Config.bots.speed;
      bot.target.directionX = 'right';
    } else if (bot.x > (Config.gameWidth - 100) && bot.target.directionX === 'right') {
      bot.target.x = -Config.bots.speed;
      bot.target.directionX = 'left';
    } else {
      if (bot.target.directionX === 'left') {
        bot.target.x = -Config.bots.speed;
      } else {
        bot.target.x = Config.bots.speed;
      }
    }

    if (bot.y < 100 && bot.target.directionY === 'up') {
      bot.target.y = Config.bots.speed;
      bot.target.directionY = 'down';
    } else if (bot.y > (Config.gameHeight - 100) && bot.target.directionY === 'down') {
      bot.target.y = -Config.bots.speed;
      bot.target.directionY = 'up';
    } else {
      if (bot.target.directionY === 'up') {
        bot.target.y = -Config.bots.speed;
      } else {
        bot.target.y = Config.bots.speed;
      }
    }
    bot.move();
  });
}

function tickPlayer(currentPlayer) {
  let playerCircle = {};
  let currentCell = {};
  const playerCollisions = [];
  let z = 0;

  if (currentPlayer.lastHeartbeat < new Date().getTime() - Config.maxHeartbeatInterval) {
    sockets[currentPlayer.id].emit('kick', 'Last heartbeat received over ' + Config.maxHeartbeatInterval + ' ago.');
    sockets[currentPlayer.id].disconnect();
  }

  function funcFood(f) {
    return SAT.pointInCircle(new V(f.x, f.y), playerCircle);
  }

  function deleteFood(f) {
    food[f] = {};
    food.splice(f, 1);
  }

  function eatMass(m) {
    if (SAT.pointInCircle(new V(m.x, m.y), playerCircle)) {
      if ((m._id || m.id) === currentPlayer.id && m.speed > 0) {
      // if ((m._id || m.id) === currentPlayer.id && m.speed > 0 && z === m.num) {
        return false;
      }
      if (currentCell.mass > m.masa * 1.1) {
        return true;
      }
    }
    return false;
  }

  if (currentPlayer.lastHeartbeat < new Date().getTime() - Config.maxHeartbeatInterval) {
    sockets[currentPlayer.id].emit('kick', `Last heartbeat received over ${Config.maxHeartbeatInterval} ago.`);
    sockets[currentPlayer.id].disconnect();
  }

  currentPlayer.move();
  checkPowers(currentPlayer);
  checkBonuses(currentPlayer);
  checkBonuses(currentPlayer, true);
  gotBonuses(currentPlayer);

  function collisionCheck(collision) {
    const dx = collision.aUser.x - collision.bUser.x;
    const dy = collision.aUser.y - collision.bUser.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (collision.aUser.mass > collision.bUser.mass * 1.1
      && d < (collision.aUser.radius - collision.bUser.radius) * 1.1 ) {
      debug(`[DEBUG] Killing user: ${collision.bUser.id}`);
      debug('[DEBUG] Collision info:');

      const botCheck = Util.findIndex(bots, collision.bUser.id);
      const userCheck = Util.findIndex(users, collision.bUser.id);
      const numUser = userCheck > -1 ? userCheck : botCheck;
      if (numUser > -1) {
        if (collision.bUser.bonus && !collision.bUser.bonus.shield) {
          if (collision.bUser.type === 'bot') {
            console.log(collision.bUser);
            bots.splice(numUser, 1);
          } else {
            if (users[numUser].cells.length > 1) {
              users[numUser].massTotal -= collision.bUser.mass;
              users[numUser].cells.splice(collision.bUser.num, 1);
            } else {
              killUser(io, users[numUser]);
            }
          }

          currentPlayer.massTotal += collision.bUser.mass;
          collision.aUser.mass += collision.bUser.mass;
        }
      }
    }
  }

  function check(user) {
    user.cells.forEach((c, i) => {
      if (/* user.cells[i].mass > 10 && */ user.id !== currentPlayer.id) {
        const response = new SAT.Response();
        const collided = SAT.testCircleCircle(
          playerCircle,
          new C(new V(c.x, c.y), c.radius), response
        );
        if (collided) {
          response.aUser = currentCell;
          response.bUser = {
            id: user.id,
            name: user.name,
            x: c.x,
            y: c.y,
            num: i,
            type: user.type,
            mass: c.mass,
            bonus: user.bonus,
            radius: c.radius
          };
          playerCollisions.push(response);
        }
        if (currentPlayer.power.active) {
          if (currentPlayer.power.current === 'slower') {
            infection('glue', c, currentCell, user);
            // slower(c, currentCell, user);
          }
          if (currentPlayer.power.current === 'magneto') {
            moveInOut('magneto', c, currentCell, user);
          }
          if (currentPlayer.power.current === 'pusher') {
            moveInOut('pusher', c, currentCell, user, true);
          }
          if (currentPlayer.power.current === 'slash') {
            fire(c, currentCell, currentPlayer, bullet);
          }
          if (currentPlayer.power.current === 'wall') {

          }
        }
        if (currentPlayer.bonus.shoot) {
          fire(c, currentCell, currentPlayer, bullet);
        }
        if (currentPlayer.bonus.glue) {
          infection('glue', c, currentCell, user);
        }
        if (currentPlayer.bonus.freeze) {
          infection('freeze', c, currentCell, user);
        }
        if (currentPlayer.bonus.drunk) {
          infection('drunk', c, currentCell, user);
        }
      }
    });
    return true;
  }

  // TODO: FIX THIS Z VARIABLE AND EATMASS()
  for (z = 0; z < currentPlayer.cells.length; z++) {
    currentCell = currentPlayer.cells[z];
    playerCircle = new C(
      new V(currentCell.x, currentCell.y),
      currentCell.radius
    );

    const funcBonus = pointBonus(playerCircle);

    const foodEaten = food.map(funcFood)
      .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    foodEaten.forEach(deleteFood);

    const massEaten = massFood.map(eatMass)
      .reduce((a, b, c) => {return b ? a.concat(c) : a; }, []);

    const virusCollision = virus.map(funcFood)
      .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);

    if (virusCollision > 0 && currentCell.mass > virus[virusCollision].mass) {
      sockets[currentPlayer.id].emit('virusSplit', z);
    }

    const glueEaten = glue.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    glueEaten.forEach((a) => {
      currentPlayer.bonus.glue = setBonus(currentPlayer.bonus, 'glue');
      deleteBonus(a, glue);
    });

    const shieldEaten = shield.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    shieldEaten.forEach((a) => {
      currentPlayer.bonus.shield = setBonus(currentPlayer.bonus, 'shield');
      deleteBonus(a, shield);
    });

    const bombEaten = bomb.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    bombEaten.forEach((a) => {
      currentPlayer.bonus.bomb = setBonus(currentPlayer.bonus, 'bomb');
      deleteBonus(a, bomb);
    });

    const drunkEaten = drunk.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    drunkEaten.forEach((a) => {
      currentPlayer.bonus.drunk = setBonus(currentPlayer.bonus, 'drunk');
      deleteBonus(a, drunk);
    });

    const megaEaten = mega.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    megaEaten.forEach((a) => {
      const name = randomBonus();
      if ((name === 'speed') && !currentPlayer.bonus.speed) {
        setSpeed(currentPlayer.cells, Config.bonus.Speed.value);
      }
      currentPlayer.bonus[name] = setBonus(currentPlayer.bonus, name);
      deleteBonus(a, mega);
    });

    const shootEaten = shoot.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    shootEaten.forEach((a) => {
      currentPlayer.bonus.shoot = setBonus(currentPlayer.bonus, 'shoot');
      deleteBonus(a, shoot);
    });

    const x2Eaten = x2.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    x2Eaten.forEach((a) => {
      currentPlayer.massTotal += currentCell.mass;
      currentCell.mass += currentCell.mass;
      deleteBonus(a, x2);
    });

    const x5Eaten = x5.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    x5Eaten.forEach((a) => {
      currentPlayer.bonus.x5 = setBonus(currentPlayer.bonus, 'x5');
      deleteBonus(a, x5);
    });

    const extra1Eaten = extra1.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    extra1Eaten.forEach((a) => {
      currentPlayer.bonus.extra1 = setBonus(currentPlayer.bonus, 'extra1');
      checkExtra(currentPlayer, users);
      deleteBonus(a, extra1);
    });

    const extra2Eaten = extra2.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    extra2Eaten.forEach((a) => {
      currentPlayer.bonus.extra2 = setBonus(currentPlayer.bonus, 'extra2');
      checkExtra(currentPlayer, users);
      deleteBonus(a, extra2);
    });

    const extra3Eaten = extra3.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    extra3Eaten.forEach((a) => {
      currentPlayer.bonus.extra3 = setBonus(currentPlayer.bonus, 'extra3');
      checkExtra(currentPlayer, users);
      deleteBonus(a, extra3);
    });

    const extra4Eaten = extra4.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    extra4Eaten.forEach((a) => {
      currentPlayer.bonus.extra4 = setBonus(currentPlayer.bonus, 'extra4');
      checkExtra(currentPlayer, users);
      deleteBonus(a, extra4);
    });

    const extra5Eaten = extra5.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    extra5Eaten.forEach((a) => {
      currentPlayer.bonus.extra5 = setBonus(currentPlayer.bonus, 'extra5');
      checkExtra(currentPlayer, users);
      deleteBonus(a, extra5);
    });

    const freezeEaten = freeze.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    freezeEaten.forEach((a) => {
      currentPlayer.bonus.freeze = setBonus(currentPlayer.bonus, 'freeze');
      deleteBonus(a, freeze);
    });

    const speedEaten = speed.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    speedEaten.forEach((a) => {
      if (!currentPlayer.bonus.speed) {
        setSpeed(currentPlayer.cells, Config.bonus.Speed.value);
      }
      currentPlayer.bonus.speed = setBonus(currentPlayer.bonus, 'speed');
      deleteBonus(a, speed);
    });

    const bulletEaten = bullet.map(funcBonus)
            .reduce((a, b, c) => { return b ? a.concat(c) : a; }, []);
    bulletEaten.forEach((a) => {
      if (currentPlayer.id !== bullet[a].playerID) {
        if (currentPlayer.massTotal > Config.defaultPlayerMass) {
          currentCell.mass -= Config.bullets.damage;
          currentPlayer.massTotal -= Config.bullets.damage;
        } else {
          killUser(io, currentPlayer);
        }
        bullet.splice(a, 1);
      }
    });

    let masaGanada = 0;
    for (let m = 0; m < massEaten.length; m++) {
      masaGanada += massFood[massEaten[m]].masa;
      massFood[massEaten[m]] = {};
      massFood.splice(massEaten[m], 1);
      for (let n = 0; n < massEaten.length; n++) {
        if (massEaten[m] < massEaten[n]) {
          massEaten[n]--;
        }
      }
    }

    if (typeof(currentCell.speed) === 'undefined') {
      currentCell.speed = Config.slowBase;
    }

    masaGanada += (foodEaten.length * Config.foodMass);

    if (masaGanada > 0) {
      currentPlayer.score += masaGanada;
      currentCell.mass += masaGanada;
      currentPlayer.massTotal += masaGanada;
    }

    currentCell.radius = Util.massToRadius(currentCell.mass);
    playerCircle.r = currentCell.radius;
    sqt.clear();

    users.filter(e => e.type === 'player').forEach(sqt.put);
    bots.forEach(sqt.put);


    // TODO: TEST TO MAKE SURE PLAYER COLLISSIONS WORK
    sqt.get(currentPlayer, check);

    playerCollisions.forEach(collisionCheck);
  }

  const coord = {
    x: currentPlayer.x,
    y: currentPlayer.y,
    others: []
  };
  bots.forEach((b) => {
    coord.others.push({
      x: b.x,
      y: b.y
    });
  });
  users.filter(e => e.type === 'player').forEach((b) => {
    if ((currentPlayer.x !== b.x) && (currentPlayer.y !== b.y)) {
      coord.others.push({
        x: b.x,
        y: b.y
      });
    }
  });

  if ((Date.now() - timeDelta) > Config.sendInterval) {
    sockets[currentPlayer.id].emit('playerScore', msgpack.encode(currentPlayer.score));
    sockets[currentPlayer.id].emit('playerCoordinates', msgpack.encode(coord));
    sockets[currentPlayer.id].emit('playerMass', msgpack.encode(currentPlayer.massTotal));
    sockets[currentPlayer.id].emit('playerBonus', msgpack.encode(currentPlayer.bonus));
  }
}

function tickSpectate(currentPlayer) {
  const playerCircle = {};
  let currentCell = {};
  let z = 0;

  if (currentPlayer.lastHeartbeat < new Date().getTime() - Config.maxHeartbeatInterval) {
    sockets[currentPlayer.id].emit('kick', 'Last heartbeat received over ' + Config.maxHeartbeatInterval + ' ago.');
    sockets[currentPlayer.id].disconnect();
  }

  if (currentPlayer.lastHeartbeat < new Date().getTime() - Config.maxHeartbeatInterval) {
    sockets[currentPlayer.id].emit('kick', `Last heartbeat received over ${Config.maxHeartbeatInterval} ago.`);
    sockets[currentPlayer.id].disconnect();
  }

  // currentPlayer.move();

  for (z = 0; z < currentPlayer.cells.length; z++) {
    currentCell = currentPlayer.cells[z];

    if (typeof(currentCell.speed) === 'undefined') {
      currentCell.speed = 4.5;
    }

    currentCell.radius = Util.massToRadius(currentCell.mass);
    playerCircle.r = currentCell.radius;
  }

  const coord = {
    x: currentPlayer.x,
    y: currentPlayer.y,
    others: []
  };
  bots.forEach((b) => {
    coord.others.push({
      x: b.x,
      y: b.y
    });
  });
  users.filter(e => e.type === 'player').forEach((b) => {
    if ((currentPlayer.x !== b.x) && (currentPlayer.y !== b.y)) {
      coord.others.push({
        x: b.x,
        y: b.y
      });
    }
  });
  if ((Date.now() - timeDelta) > Config.sendInterval) {
    // sockets[currentPlayer.id].emit('playerScore', msgpack.encode(currentPlayer.score));
    sockets[currentPlayer.id].emit('playerCoordinates', msgpack.encode(coord));
    // sockets[currentPlayer.id].emit('playerMass', msgpack.encode(currentPlayer.massTotal));
    // sockets[currentPlayer.id].emit('playerBonus', msgpack.encode(currentPlayer.bonus));
  }
}

function moveloop() {
  moveBot();
  users.forEach(u => u.type === 'player' ? tickPlayer(u) : tickSpectate(u));
  massFood.filter(m => m.speed > 0)
    .forEach(m => moveMass(m));
  bullet.filter(b => b.speed > 0)
    .forEach(b => moveBullet(b));
  if ((Date.now() - timeDelta) > Config.sendInterval) {
    timeDelta = Date.now();
  }
}

function gameloop() {
  if (users.length > 0) {
    users.sort((a, b) => { return b.massTotal - a.massTotal; });

    const topUsers = [];

    for (let i = 0; i < Math.min(10, users.length); i++) {
      if (users[i].type === 'player') {
        if (users[i].bonus.extra) {
          const delta = Date.now() - (users[i].bonus.extra.time);
          const time = Config.bonus.Extra.time * 1000;
          if (users[i].bonus.extra.active === true) {
            if (delta < time) {
              topUsers.unshift({
                id: users[i].id,
                name: `******${users[i].name}******`
              });
            } else {
              delete users[i].bonus.extra;
              leaderboardChanged = true;
              topUsers.push({
                id: users[i].id,
                name: users[i].name
              });
            }
          } else {
            delete users[i].bonus.extra;
            leaderboardChanged = true;
            topUsers.push({
              id: users[i].id,
              name: users[i].name
            });
          }
        } else {
          topUsers.push({
            id: users[i].id,
            name: users[i].name
          });
        }
      }
    }
    if (isNaN(leaderboard) || leaderboard.length !== topUsers.length) {
      leaderboard = topUsers;
      leaderboardChanged = true;
    } else {
      for (let i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i].id !== topUsers[i].id) {
          leaderboard = topUsers;
          leaderboardChanged = true;
          break;
        }
      }
    }
    users.filter(e => e.type === 'player').forEach(u => {
      u.cells.forEach(c => {
        if (c.mass * (1 - (Config.massLossRate / 1000)) > Config.defaultPlayerMass && u.massTotal > Config.minMassLoss) {
          const massLoss = c.mass * (1 - (Config.massLossRate / 1000));
          u.massTotal -= c.mass - massLoss;
          c.mass = massLoss;
        }
      });
    });
  }
  balanceMass();
}

function sendUpdates() {
  const leaderUserId = leaderboard[0] && leaderboard[0].id;
  const leaderUser = users.find(e => e.id === leaderUserId) || {};

  users.forEach((u) => {
    if (u.type === 'spectate') {
      if (u.followMode === 'gameleader') {
        u.x = leaderUser.x || Config.gameWidth / 2;
        u.y = leaderUser.y || Config.gameHeight / 2;
      } else if (u.followMode === 'died') {

      } else {
        u.x = Config.gameWidth / 2;
        u.y = Config.gameHeight / 2;
      }
    } else {
      u.x = u.x || Config.gameWidth / 2;
      u.y = u.y || Config.gameHeight / 2;
    }

    const visibleBots = bots
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleFood = food
            .filter(f => f.x > u.x - u.w / 2 - 20 &&
                    f.x < u.x + u.w / 2 + 20 &&
                    f.y > u.y - u.h / 2 - 20 &&
                    f.y < u.y + u.h / 2 + 20 );

    const visibleVirus = virus
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleGlue = glue
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleShield = shield
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleBomb = bomb
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleDrunk = drunk
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleMega = mega
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleShoot = shoot
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleX2 = x2
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleX5 = x5
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleExtra1 = extra1
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleExtra2 = extra2
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleExtra3 = extra3
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleExtra4 = extra4
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleExtra5 = extra5
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleFreeze = freeze
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleSpeed = speed
            .filter(f => f.x > u.x - u.w / 2 - f.radius &&
                    f.x < u.x + u.w / 2 + f.radius &&
                    f.y > u.y - u.h / 2 - f.radius &&
                    f.y < u.y + u.h / 2 + f.radius );

    const visibleMass = massFood
            .filter(f => f.x + f.radius > u.x - u.w / 2 - 20 &&
                    f.x - f.radius < u.x + u.w / 2 + 20 &&
                    f.y + f.radius > u.y - u.h / 2 - 20 &&
                    f.y - f.radius < u.y + u.h / 2 + 20 );

    const visibleBullet = bullet
            .filter(f => f.x + f.radius > u.x - u.w / 2 - 20 &&
                    f.x - f.radius < u.x + u.w / 2 + 20 &&
                    f.y + f.radius > u.y - u.h / 2 - 20 &&
                    f.y - f.radius < u.y + u.h / 2 + 20 );

    const visibleCells = users
            .filter(e => invisible(e, u))
            .filter(e => e.id === u.id || e.type === 'player')
            .map(f => {
              return {
                id: f.id !== u.id ? f.id : undefined,
                userid: f.id,
                x: Math.round(f.id !== u.id ? f.x : u.x),
                y: Math.round(f.id !== u.id ? f.y : u.y),
                cells: f.cells.filter(c => {
                  return c.x + c.radius > u.x - u.w / 2 - 20 &&
                    c.x - c.radius < u.x + u.w / 2 + 20 &&
                    c.y + c.radius > u.y - u.h / 2 - 20 &&
                    c.y - c.radius < u.y + u.h / 2 + 20;
                }).map(c => {
                  return Object.assign(c, {
                    x: Math.round(c.x),
                    y: Math.round(c.y),
                    mass: c.mass,
                    radius: Math.round(c.radius),
                    id: c.id,
                  });
                }),
                massTotal: f.massTotal,
                hue: f.hue,
                name: f.name,
                sprite: f.sprite,
                bonus: f.bonus,
                power: f.power,
                type: f.type,
                color: f.color
              };
            });

    sockets[u.id].emit('serverTellPlayerMove',
                       visibleCells,
                       visibleFood,
                       visibleGlue,
                       visibleShield,
                       visibleBomb,
                       visibleDrunk,
                       visibleMega,
                       visibleShoot,
                       visibleX2,
                       visibleX5,
                       visibleExtra1,
                       visibleExtra2,
                       visibleExtra3,
                       visibleExtra4,
                       visibleExtra5,
                       visibleFreeze,
                       visibleSpeed,
                       visibleMass,
                       visibleVirus,
                       visibleBots,
                       visibleBullet
                       // msgpack.encode(visibleCells),
                       // msgpack.encode(visibleFood),
                       // msgpack.encode(visibleGlue),
                       // msgpack.encode(visibleShield),
                       // msgpack.encode(visibleBomb),
                       // msgpack.encode(visibleDrunk),
                       // msgpack.encode(visibleMega),
                       // msgpack.encode(visibleShoot),
                       // msgpack.encode(visibleX2),
                       // msgpack.encode(visibleX5),
                       // msgpack.encode(visibleExtra1),
                       // msgpack.encode(visibleExtra2),
                       // msgpack.encode(visibleExtra3),
                       // msgpack.encode(visibleExtra4),
                       // msgpack.encode(visibleExtra5),
                       // msgpack.encode(visibleFreeze),
                       // msgpack.encode(visibleSpeed),
                       // msgpack.encode(visibleMass),
                       // msgpack.encode(visibleVirus),
                       // msgpack.encode(visibleBots)
                       // msgpack.encode(visibleBullet)
                        );

      if (leaderboardChanged) {
        sockets[u.id].emit('leaderboard', {
          leaderboard: msgpack.encode(leaderboard)
        });
      }
    // }
  });
  leaderboardChanged = false;
}

setInterval(moveloop, 1000 / 60);
setInterval(gameloop, 1000);
setInterval(sendUpdates, 1000 / Config.networkUpdateFactor);

const ipaddress = process.env.IP || '127.0.0.1';
const serverport = process.env.PORT || '3000';
models.sequelize.sync().then(() => {
  http.listen(serverport, ipaddress, () => {
    debug(`[DEBUG] Listening on ${ipaddress}:${serverport}`);
  });
});
