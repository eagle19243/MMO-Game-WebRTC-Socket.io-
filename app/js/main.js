// IMPORT ASSETS
import '../css/app.scss';
import 'uikit/dist/css/uikit.css';
import 'uikit/dist/css/uikit.almost-flat.css';
import 'uikit/dist/css/components/progress.css';
import 'uikit/dist/css/components/progress.almost-flat.css';
import 'uikit/dist/js/uikit.js';
import Config         from './config';
import miniMap        from '../js/minimap.js';
import toggleDarkMode from '../js/toggleDarkMode.js';
import toggleMass     from '../js/toggleMass.js';
import toggleButtons  from '../js/button.js';
import chatClient     from '../js/chat.js';
import msgpack        from '../../server/lib/binary.js';
import '../js/button.js';
import './assets.js';

import {
  virusImage,
  glueImage,
  shieldImage,
  bombImage,
  drunkImage,
  megaImage,
  shootImage,
  x2Image,
  x5Image,
  extra1Image,
  extra2Image,
  extra3Image,
  extra4Image,
  extra5Image,
  freezeImage,
  speedImage,
  foodImage
}                     from '../js/objectImages.js';

import {
  drawBonus,
  drawBonusCircle,
  getDashoffset
} from '../../server/lib/bonus';
import sprites        from '../js/sprites.js';
import SmoothAnimation from './smoothAnimation';
import CacheDatas     from './cacheDatas';
import ping           from 'web-pingjs';
import {
  SpriteProxy
}                     from './renderer';
import io             from 'socket.io-client';
import {
  hslToRgb
}                     from './utilities.js';
import * as Util      from '../../server/lib/util.js';
import {
  KEY_ESC,
  KEY_ENTER,
  KEY_CHAT,
  KEY_FIREFOOD,
  KEY_POWER,
  KEY_LEFT,
  KEY_UP,
  KEY_RIGHT,
  KEY_DOWN
} from './keys.js';

import {
  playerNameInput,
  c,
  renderer,
  graph,
  input,
  statusId,
  scoreId,
  coordinatesId,
  massId,
  btnS,
  settingsMenu,
  settings,
  cellId,
  feedId,
  splitId,
  btnExit,
  btn,
  rightBonuses,
  bottomBonuses,
  dropPowers,
  bChat,
  bChatbox,
  bChaticon,
  bTheme,
  bThemeicon,
  bMass,
  bMassicon,
  bLeaderboard,
  bLeaderbuttons,
  bLeadericon,
  mobile
} from './dom.js';

import stats from '../js/stats.js';

let playerName;
let playerType;
let socket;
let chat;
let reason;
let borderDraw = false;
let animLoopHandle;
const foodSides = 10;

// Canvas.
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let gameWidth = 0;
let gameHeight = 0;
const xoffset = -gameWidth;
const yoffset = -gameHeight;

let gameStart = false;
let disconnected = false;
let died = false;
let kicked = false;

// TODO: Break out into GameControls.
let continuity = false;
let startPingTime = 0;

const playerConfig = {
  border: 6,
  textColor: '#FFFFFF',
  textBorder: '#000000',
  textBorderSize: 3,
  defaultSize: 30
};

const player = new SmoothAnimation({
  id: -1,
  x: screenWidth / 2,
  y: screenHeight / 2,
  w: screenWidth,
  h: screenHeight,
  target: {
    x: screenWidth / 2,
    y: screenHeight / 2
  }
});

let foods = []; const foodsIndex = {};
let glue = []; const glueIndex = {};
let bomb = []; const bombIndex = {};
let drunk = []; const drunkIndex = {};
let mega = []; const megaIndex = {};
let bullet = []; const bulletIndex = {};
let shield = []; const shieldIndex = {};
let shoot = []; const shootIndex = {};
let x2 = []; const x2Index = {};
let x5 = []; const x5Index = {};
let extra1 = []; const extra1Index = {};
let extra2 = []; const extra2Index = {};
let extra3 = []; const extra3Index = {};
let extra4 = []; const extra4Index = {};
let extra5 = []; const extra5Index = {};
let freeze = []; const freezeIndex = {};
let speed = []; const speedIndex = {};
let viruses = []; const virusesIndex = {};
let fireFood = []; const fireFoodIndex = {};
let bots = []; const botsIndex = {};
let users = []; const usersIndex = {}; const usersCellIndex = {};
let leaderboard = [];
let target = {x: player.x, y: player.y};
let reenviar = true;
let directionLock = false;
let spectateMode = false;
const directions = [];

const debug = (args) => {
  if (console && console.log) {
    console.log(args);
  }
};

const spritesProxy = SpriteProxy(renderer.stage);
const foodsSprites = new SpriteProxy(renderer.stage, foodImage);
const virusesSprites = new SpriteProxy(renderer.stage, virusImage);
const glueSprites = new SpriteProxy(renderer.stage, glueImage);
const bombSprites = new SpriteProxy(renderer.stage, bombImage);
const drunkSprites = new SpriteProxy(renderer.stage, drunkImage);
const shootSprites = new SpriteProxy(renderer.stage, shootImage);
const x5Sprites = new SpriteProxy(renderer.stage, x5Image);
const extra1Sprites = new SpriteProxy(renderer.stage, extra1Image);
const extra2Sprites = new SpriteProxy(renderer.stage, extra2Image);
const extra3Sprites = new SpriteProxy(renderer.stage, extra3Image);
const extra4Sprites = new SpriteProxy(renderer.stage, extra4Image);
const extra5Sprites = new SpriteProxy(renderer.stage, extra5Image);
const freezeSprites = new SpriteProxy(renderer.stage, freezeImage);
const speedSprites = new SpriteProxy(renderer.stage, speedImage);
const userCellSprites = new SpriteProxy(renderer.stage);
const shieldSprite = new SpriteProxy(renderer.stage, shieldImage);
const x2Sprites = new SpriteProxy(renderer.stage, x2Image);
const megaSprites = new SpriteProxy(renderer.stage, megaImage);
const bulletSprites = new SpriteProxy(renderer.stage, bombImage);

function getCookie() {
  return document.cookie.split(';').reduce((prev, coo) => {
    const arr = coo.split('=');
    const cur = arr[1].split('.')[0];
    const str = cur.slice(4, cur.length);
    return (arr[0].trim() === 'connect.sid') ? str : prev;
  }, undefined);
}

// socket stuff.
function setupSocket(sock, type) {
  // Handle ping.
  sock.on('drop', () => {
    const latency = Date.now() - startPingTime;
    debug(`Latency: ${latency}ms`);
    chat.addSystemLine(`Ping: ${latency}ms`);
  });

  // Handle error.
  sock.on('connect_failed', () => {
    sock.close();
    disconnected = true;
  });

  sock.on('disconnect', () => {
    sock.close();
    disconnected = true;
  });

  // Handle connection.
  sock.on('welcome', (playerSettings) => {
    player.update(playerSettings);
    player.name = playerName;
    player.w = screenWidth;
    player.h = screenHeight;
    player.target = target;
    player.score = 0;
    player.type = type;
    player.sessionID = getCookie();
    sock.emit('gotit', player);
    gameStart = true;
    document.body.id = 'gameStarted';
    debug(`Game started at: ${gameStart}`);
    chat.addSystemLine('Welcome to blobber.io! </br>Controls</br>MOUSE to move</br>E to eject mass</br>SPACEBAR to use power</br>Only one power per game can be used.</br></br>blobber.io is a new game in beta-release so please send us your ideas and bugs!</br>Please share this game :)');
    /* chat.addSystemLine('Connected to the game!'); */
    /* chat.addSystemLine('Type <b>-help</b> for a list of commands.'); */
    if (mobile) {
      document.getElementById('gameAreaWrapper').removeChild(document.getElementById('chatbox'));
    }
    c.focus();
  });

  const baseWidth = 1920;
  const baseHeight = 1080;

  let zoom = 1;

  function onZoom(e) {
    zoom *= Math.pow(1.1, e.deltaY / 100);
    zoom = Util.valueInRange(0.2, 4, zoom);

    renderer.zoom = zoom;
  }

  function resize() {
    if (window.innerWidth / window.innerHeight > (baseWidth / baseHeight)) {
      player.w = screenWidth = baseWidth;
      player.h = screenHeight = baseWidth * window.innerHeight / window.innerWidth;
    } else {
      player.w = screenWidth = baseHeight * window.innerWidth / window.innerHeight;
      player.h = screenHeight = baseHeight;
    }
    renderer.renderer.resize(window.innerWidth, window.innerHeight);
    renderer.scale = window.innerWidth / screenWidth;

    sock.emit('windowResized', {
      w: screenWidth,
      h: screenHeight
    });
  }

  window.addEventListener('resize', resize);
  window.addEventListener('wheel', onZoom);

  sock.on('gameSetup', (data) => {
    gameWidth = data.gameWidth;
    gameHeight = data.gameHeight;
    console.log(gameWidth, gameHeight);
    resize();
  });

  sock.on('playerDied', (data) => {
    chat.addSystemLine(`{GAME} - <b>${(data.name.length < 1 ? 'An unnamed cell' : data.name)}</b> was eaten.`);
  });

  sock.on('playerDisconnect', (data) => {
    chat.addSystemLine(`{GAME} - <b>${(data.name.length < 1 ? 'An unnamed cell' : data.name)}</b> disconnected.`);
  });

  sock.on('playerJoin', (data) => {
    chat.addSystemLine(`{GAME} - <b>${(data.name.length < 1 ? 'An unnamed cell' : data.name)}</b> joined.`);
  });

  sock.on('leaderboard', (data) => {
    leaderboard = msgpack.decode(new Uint8Array(data.leaderboard));
    let status = '<span class="title">Leaderboard</span>';
    for (let i = 0; i < leaderboard.length; i++) {
      status += '<br />';
      if (leaderboard[i].id === player.id) {
        status += leaderboard[i].name.length !== 0 ? `<span class="me">${(i + 1)}. ${leaderboard[i].name}</span>` : `<span class="me">${(i + 1)}. An unnamed cell</span>`;
      } else {
        status += leaderboard[i].name.length !== 0 ? `${(i + 1)}. ${leaderboard[i].name}` : `${(i + 1)}. An unnamed cell`;
      }
    }
    statusId.innerHTML = status;
  });

  sock.on('serverMSG', (data) => {
    chat.addSystemLine(data);
  });

  // Chat.
  sock.on('serverSendPlayerChat', (data) => {
    chat.addChatLine(data.sender, data.message, data.me || false);
  });

  // Handle movement.
  // sock.on('serverTellPlayerMove', (...args) => {
    // const userData = msgpack.decode(new Uint8Array(args[0]));
    // const foodsList = msgpack.decode(new Uint8Array(args[1]));
    // const glueList = msgpack.decode(new Uint8Array(args[2]));
    // const shieldList = msgpack.decode(new Uint8Array(args[3]));
    // const bombList = msgpack.decode(new Uint8Array(args[4]));
    // const drunkList = msgpack.decode(new Uint8Array(args[5]));
    // const megaList = msgpack.decode(new Uint8Array(args[6]));
    // const shootList = msgpack.decode(new Uint8Array(args[7]));
    // const x2List = msgpack.decode(new Uint8Array(args[8]));
    // const x5List = msgpack.decode(new Uint8Array(args[9]));
    // const extra1List = msgpack.decode(new Uint8Array(args[10]));
    // const extra2List = msgpack.decode(new Uint8Array(args[11]));
    // const extra3List = msgpack.decode(new Uint8Array(args[12]));
    // const extra4List = msgpack.decode(new Uint8Array(args[13]));
    // const extra5List = msgpack.decode(new Uint8Array(args[14]));
    // const freezeList = msgpack.decode(new Uint8Array(args[15]));
    // const speedList = msgpack.decode(new Uint8Array(args[16]));
    // const massList = msgpack.decode(new Uint8Array(args[17]));
    // const virusList = msgpack.decode(new Uint8Array(args[18]));
    // const botsList = msgpack.decode(new Uint8Array(args[19]));
  sock.on('serverTellPlayerMove', (
    userData,
    foodsList,
    glueList,
    shieldList,
    bombList,
    drunkList,
    megaList,
    shootList,
    x2List,
    x5List,
    extra1List,
    extra2List,
    extra3List,
    extra4List,
    extra5List,
    freezeList,
    speedList,
    massList,
    virusList,
    botsList,
    bulletList
  ) => {
    let playerData = {};
    for (let i = 0; i < userData.length; i++) {
      if (typeof(userData[i].id) === 'undefined') {
        playerData = userData[i];
        i = userData.length;
      }
    }
    const xOffset = player.x - playerData.x;
    const yOffset = player.y - playerData.y;

    if (playerType === 'player') {
      player.hue = playerData.hue;
      player.massTotal = playerData.massTotal;
      player.bonus = playerData.bonus;
      player.cells = playerData.cells;
    }

    player.x = playerData.x;
    player.y = playerData.y;
    player.xoffset = isNaN(xOffset) ? 0 : xOffset;
    player.yoffset = isNaN(yOffset) ? 0 : yOffset;
    player.type = playerData.type;

    users = CacheDatas(userData
      .filter(e => e.type === 'player')
      .map(e => Object.assign(e, {
        id: e.userid,
        ceilDatas: usersCellIndex[e.userid] || (usersCellIndex[e.userid] = {}),
        cells: CacheDatas(
          e.cells,
          usersCellIndex[e.userid] || (usersCellIndex[e.userid] = {}),
          userCellSprites
        )
      })), usersIndex, {
        onDel: (e) => {
          CacheDatas([], usersCellIndex[e.userid] || (usersCellIndex[e.userid] = {}), userCellSprites);
        }
      });

    viruses  = CacheDatas(virusList, virusesIndex, virusesSprites);
    glue     = CacheDatas(glueList, glueIndex, glueSprites);
    bomb     = CacheDatas(bombList, bombIndex, bombSprites);
    drunk    = CacheDatas(drunkList, drunkIndex, drunkSprites);
    shoot    = CacheDatas(shootList, shootIndex, shootSprites);
    x2       = CacheDatas(x2List, x2Index, x2Sprites);
    x5       = CacheDatas(x5List, x5Index, x5Sprites);
    extra1   = CacheDatas(extra1List, extra1Index, extra1Sprites);
    extra2   = CacheDatas(extra2List, extra2Index, extra2Sprites);
    extra3   = CacheDatas(extra3List, extra3Index, extra3Sprites);
    extra4   = CacheDatas(extra4List, extra4Index, extra4Sprites);
    extra5   = CacheDatas(extra5List, extra5Index, extra5Sprites);
    freeze   = CacheDatas(freezeList, freezeIndex, freezeSprites);
    speed    = CacheDatas(speedList, speedIndex, speedSprites);
    bots     = CacheDatas(botsList, botsIndex, spritesProxy);
    fireFood = CacheDatas(massList, fireFoodIndex, foodsSprites);
    foods    = CacheDatas(foodsList, foodsIndex, foodsSprites);
    shield   = CacheDatas(shieldList, shieldIndex, shieldSprite);
    mega     = CacheDatas(megaList, megaIndex, megaSprites);
    bullet   = CacheDatas(bulletList, bulletIndex, foodsSprites);
  });

  // Death.
  sock.on('RIP', () => {
    // gameStart = false;
    died = true;
    window.setTimeout(() => {
      document.getElementById('startMenuWrapper').className = 'uk-height-1-1 uk-flex uk-flex-center uk-flex-middle';
      died = false;
    }, 3000);


    // window.setTimeout(() => {
    //   document.getElementById('gameAreaWrapper').style.opacity = 0;
    //   document.getElementById('startMenuWrapper').style.maxHeight = '1000px';
    //   died = false;
    //   if (animLoopHandle) {
    //     window.cancelAnimationFrame(animLoopHandle);
    //     animLoopHandle = undefined;
    //   }
    // }, 2500);
  });

  sock.on('kick', (data) => {
    gameStart = false;
    reason = data;
    kicked = true;
    sock.close();
  });

  sock.on('virusSplit', (virusCell) => {
    sock.emit('2', virusCell);
    reenviar = false;
  });

  sock.on('playerScore', (data) => {
    scoreId.innerHTML = `Score: ${msgpack.decode(new Uint8Array(data))}`;
  });

  sock.on('playerCoordinates', (data) => {
    data = msgpack.decode(new Uint8Array(data));
    coordinatesId.innerHTML = `x: ${Math.round(data.x)} y: ${Math.round(data.y)}`;
    miniMap(data.x, data.y, data.others);
  });

  sock.on('playerMass', (data) => {
    massId.innerHTML = `BlobMass: ${Math.round(msgpack.decode(new Uint8Array(data)))}`;
  });

  sock.on('playerBonus', (data) => {
    data = msgpack.decode(new Uint8Array(data));
    const keys = Object.keys(data).sort();
    if (keys.length !== 0) {
      let strRight = '<ul>';
      let strBottom = '<ul>';
      for (let i = 0; i < keys.length; i++) {
        if ((keys[i] !== 'got') && (keys[i] !== 'extra') && (keys[i] !== 'extra1') && (keys[i] !== 'extra2') && (keys[i] !== 'extra3') && (keys[i] !== 'extra4') && (keys[i] !== 'extra5')) {
          const offset = getDashoffset(Config.bonus[Util.upLetter(keys[i])].time, data[keys[i]].time, 31);
          let image = '';
          switch (keys[i]) {
            case 'glue':
              image = glueImage;
              break;
            case 'shield':
              image = shieldImage;
              break;
            case 'bomb':
              image = bombImage;
              break;
            case 'drunk':
              image = drunkImage;
              break;
            case 'mega':
              image = megaImage;
              break;
            case 'shoot':
              image = shootImage;
              break;
            case 'x2':
              image = x2Image;
              break;
            case 'x5':
              image = x5Image;
              break;
            case 'freeze':
              image = freezeImage;
              break;
            case 'speed':
              image = speedImage;
              break;
          }
          strRight += `<li class="containerSVG" style="background-image: url(${image})">
            <svg class="svgCircle" width="70" height="70" viewPort="0 0 70 70" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <circle r="31" cx="35" cy="35" fill="transparent" stroke-dasharray="200" stroke-dashoffset="0"></circle>
              <circle class="svgCircleBar" r="31" cx="35" cy="35" fill="transparent" stroke-dasharray="200" stroke-dashoffset="0" style="stroke-dashoffset: ${offset}px;"></circle>
            </svg>
          </li>`;
        }
        if ((keys[i] === 'extra1') || (keys[i] === 'extra2') || (keys[i] === 'extra3') || (keys[i] === 'extra4') || (keys[i] === 'extra5')) {
          let image = '';
          switch (keys[i]) {
            case 'extra1':
              image = extra1Image;
              break;
            case 'extra2':
              image = extra2Image;
              break;
            case 'extra3':
              image = extra3Image;
              break;
            case 'extra4':
              image = extra4Image;
              break;
            case 'extra5':
              image = extra5Image;
              break;
          }
          strBottom += `<li><img src="${image}"></li>`;
        }
      }
      strRight += '</ul>';
      strBottom += '</ul>';
      if (rightBonuses.html().split(' ').join('') !== strRight.split(' ').join('')) {
        rightBonuses.empty().append(strRight);
      }
      if (bottomBonuses.html().split(' ').join('') !== strBottom.split(' ').join('')) {
        bottomBonuses.empty().append(strBottom);
      }
    } else {
      if (rightBonuses.html() !== '') {
        rightBonuses.empty();
      }
      if (bottomBonuses.html() !== '') {
        bottomBonuses.empty();
      }
    }
  });
}

function drawName(name, cell) {
  const fontSize = Math.max(cell.radius / 3 | 0, 20) | 0;
  const textStyle = {
    font: `bold ${fontSize}px Arial`,
    fill: playerConfig.textColor,
    stroke: playerConfig.textBorder
  };
  cell.setText(name, 'name', textStyle);


  var massString = Config.toggleMassState !== 0  ? Math.round(cell.mass | 0) + '' : ''
  cell.setText( massString , 'mass', {
    ...textStyle,
    y: fontSize
  });
}

function drawFood(food) {
  const [r, g, b] = hslToRgb(food.hue / 360, 1, 0.5);
  food.loop();
  food._spriteImage.tint = (r << 16) | (g << 8) | (b);
  food.render(food.x - player.x + screenWidth / 2, food.y - player.y + screenHeight / 2, food.radius, foodSides);
}

function drawVirus(virus) {
  virus.loop();
  virus.render( virus.x - player.x + screenWidth / 2, virus.y - player.y + screenHeight / 2, virus.radius * 2, virus.radius * 2);
}

function drawBots(bot) {
  bot.loop();
  drawName('BOT', bot);
  bot.render(bot.x - player.x + screenWidth / 2, bot.y - player.y + screenHeight / 2, bot.radius * 2, bot.radius * 2);
}

function drawFireFood(mass) {
  const [r, g, b] = hslToRgb(mass.hue / 360, 1, 0.5);
  mass.loop();
  mass._spriteImage.tint = (r << 16) | (g << 8) | (b);
  mass.render(mass.x - player.x + screenWidth / 2, mass.y - player.y + screenHeight / 2, mass.radius - 5, 18 + (~~(mass.masa / 5)));
}

function drawFire(bull) {
  const [r, g, b] = hslToRgb(bull.hue / 360, 1, 0.5);
  bull.loop();
  bull._spriteImage.tint = (r << 16) | (g << 8) | (b);
  bull.render(bull.x - player.x + screenWidth / 2, bull.y - player.y + screenHeight / 2, bull.radius - 5, 18 + (~~(bull.masa / 5)));
}

function drawPlayers(order) {
  player.loop();
  const start = {
    x: player.x - (screenWidth / 2),
    y: player.y - (screenHeight / 2)
  };

  for (let z = 0; z < order.length; z++) {
    const userCurrent = users[order[z].nCell];
    const cellCurrent = users[order[z].nCell].cells[order[z].nDiv];
    userCurrent.loop();
    cellCurrent.loop();

    const circle = {
      x: cellCurrent.x - start.x,
      y: cellCurrent.y - start.y
    };

    let level = 1;
    if ((userCurrent.massTotal > Config.defaultPlayerMass * 4) && (userCurrent.massTotal < Config.defaultPlayerMass * 6)) {
      level = 2;
    } else if ((userCurrent.massTotal > Config.defaultPlayerMass * 6) && (userCurrent.massTotal < Config.defaultPlayerMass * 10)) {
      level = 3;
    } else if (userCurrent.massTotal > Config.defaultPlayerMass * 10) {
      level = 4;
    }
    cellCurrent._spriteImage.tint = userCurrent.color || 0xffffff;
    cellCurrent.setSrc(Config.url + sprites[userCurrent.sprite].sprites[level]);
    cellCurrent.render(circle.x, circle.y, cellCurrent.radius * 2, cellCurrent.radius * 2);

    let nameCell = '';
    if (typeof(userCurrent.id) === 'undefined') {
      nameCell = player.name;
    } else {
      nameCell = userCurrent.name;
    }

    drawName(nameCell, cellCurrent);

    if (userCurrent.bonus &&
        userCurrent.bonus.freeze &&
        cellCurrent.biggest &&
        userCurrent.bonus.freeze.active === true) {
      drawBonusCircle(cellCurrent, userCurrent, player, circle, screenWidth, screenHeight, gameHeight, gameWidth, graph, Config.bonus.Freeze.radius);
    }
    if (userCurrent.bonus &&
        userCurrent.bonus.drunk &&
        cellCurrent.biggest &&
        userCurrent.bonus.drunk.active === true) {
      drawBonusCircle(cellCurrent, userCurrent, player, circle, screenWidth, screenHeight, gameHeight, gameWidth, graph, Config.bonus.Drunk.radius);
    }
    if (userCurrent.bonus &&
        userCurrent.bonus.glue &&
        cellCurrent.biggest &&
        userCurrent.bonus.glue.active === true) {
      drawBonusCircle(cellCurrent, userCurrent, player, circle, screenWidth, screenHeight, gameHeight, gameWidth, graph, Config.bonus.Glue.radius);
    }
    if (userCurrent.bonus &&
        userCurrent.bonus.shoot &&
        cellCurrent.biggest &&
        userCurrent.bonus.shoot.active === true) {
      drawBonusCircle(cellCurrent, userCurrent, player, circle, screenWidth, screenHeight, gameHeight, gameWidth, graph, Config.bonus.Shoot.radius);
    }
    if (userCurrent.power && userCurrent.power.active && cellCurrent.biggest) {
      if (userCurrent.power.current === 'slower') {
        drawBonusCircle(cellCurrent, userCurrent, player, circle, screenWidth, screenHeight, gameHeight, gameWidth, graph, Config.power.Slower.radius);
      }
      if (userCurrent.power.current === 'magneto') {
        drawBonusCircle(cellCurrent, userCurrent, player, circle, screenWidth, screenHeight, gameHeight, gameWidth, graph, Config.power.Magneto.radius);
      }
      if (userCurrent.power.current === 'pusher') {
        drawBonusCircle(cellCurrent, userCurrent, player, circle, screenWidth, screenHeight, gameHeight, gameWidth, graph, Config.power.Pusher.radius);
      }
      if (userCurrent.power.current === 'slash') {
        drawBonusCircle(cellCurrent, userCurrent, player, circle, screenWidth, screenHeight, gameHeight, gameWidth, graph, Config.power.Slash.radius);
      }
    }
  }
}


function drawgrid() {
  graph.lineStyle(1, 0x888888);
  graph.alpha = 0.3;
  const zoom = 1 / renderer.zoom;
  const scale = window.innerHeight /  screenHeight;
  const ceilSize = 60 * scale;

  for (let x = (xoffset - player.x) * scale; x < window.innerWidth * zoom; x += ceilSize) {
    graph.moveTo(x, -window.innerHeight * (zoom - 1) * 0.5 );
    graph.lineTo(x, window.innerHeight + window.innerHeight * (zoom - 1) * 0.5);
  }

  for (let y = (yoffset - player.y) * scale; y < window.innerHeight * zoom; y += ceilSize) {
    graph.moveTo(-window.innerWidth * (zoom - 1) * 0.5, y);
    graph.lineTo(window.innerWidth + window.innerWidth * (zoom - 1) * 0.5, y);
  }
}

function drawborder() {
  const scale = window.innerHeight / screenHeight;

  const top = screenHeight / 2 - player.y;
  const bottom = gameHeight + top;
  const left = screenWidth / 2 - player.x;
  const right = gameWidth + left;

  const zoom = 2 / renderer.zoom;

  const screenTop = window.innerHeight * 0.5 - window.innerHeight * 0.5 * zoom;
  const screenBottom = window.innerHeight * 0.5 + window.innerHeight * 0.5 * zoom;
  const screenLeft = window.innerWidth * 0.5 - window.innerWidth * 0.5 * zoom;
  const screenRight = window.innerWidth * 0.5 + window.innerWidth * 0.5 * zoom;

  graph.lineStyle(Math.ceil(zoom), playerConfig.borderColor);

  // Left-horizontal.
  if (left > screenTop) {
    graph.moveTo(left * scale, Math.max(screenTop, top) * scale);
    graph.lineTo(left * scale, Math.min(bottom, screenBottom) * scale);
  }

  // Top-horizontal.
  if (top > screenTop) {
    graph.moveTo( Math.max(screenLeft, left) * scale, top * scale,);
    graph.lineTo( Math.min(right, screenRight) * scale, top * scale,);
  }

  // Right-vertical.
  if (right < screenRight) {
    graph.moveTo(right * scale, Math.max(screenTop, top) * scale);
    graph.lineTo(right * scale, Math.min(bottom, screenBottom) * scale);
  }

  // Bottom-horizontal.
  if (bottom < screenBottom) {
    graph.moveTo( Math.max(screenLeft, left) * scale, bottom * scale,);
    graph.lineTo( Math.min(right, screenRight) * scale, bottom * scale,);
  }
}

function gameLoop() {
  const scale = window.innerHeight /  screenHeight;

  graph.clear();
  const textStyle = {
    font: '30px bold sans-serif',
    fill: playerConfig.textColor,
    stroke: playerConfig.textBorder,
    x: screenWidth / 2,
    y: screenHeight / 2,
  };
  if (!disconnected) {
    // graph.beginFill(0xffffff);
    // graph.lineStyle(5,0xffffff);
    // graph.drawRect(0, 0, screenWidth, screenHeight);
    // graph.endFill();
    // drawgrid();

    if (gameStart) {
      renderer.setText(died ? 'You died!' : '', 'state', textStyle);
      renderer.ground.tilePosition.set(
        -player.x * scale,
        -player.y * scale
      )
      // document.body.style.backgroundPosition = `${xoffset - player.x}px ${yoffset - player.y}px`;

      for (let i = 0; i < foods.length; i++) {
        drawFood(foods[i]);
      }
      for (let i = 0; i < glue.length; i++) {
        drawBonus(glue[i], 'glue', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < shield.length; i++) {
        drawBonus(shield[i], 'shield', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < bomb.length; i++) {
        drawBonus(bomb[i], 'bomb', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < drunk.length; i++) {
        drawBonus(drunk[i], 'drunk', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < mega.length; i++) {
        drawBonus(mega[i], 'mega', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < shoot.length; i++) {
        drawBonus(shoot[i], 'shoot', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < x2.length; i++) {
        drawBonus(x2[i], 'x2', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < x5.length; i++) {
        drawBonus(x5[i], 'x5', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < extra1.length; i++) {
        drawBonus(extra1[i], 'extra1', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < extra2.length; i++) {
        drawBonus(extra2[i], 'extra2', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < extra3.length; i++) {
        drawBonus(extra3[i], 'extra3', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < extra4.length; i++) {
        drawBonus(extra4[i], 'extra4', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < extra5.length; i++) {
        drawBonus(extra5[i], 'extra5', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < freeze.length; i++) {
        drawBonus(freeze[i], 'freeze', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < speed.length; i++) {
        drawBonus(speed[i], 'speed', player, screenWidth, screenHeight);
      }
      for (let i = 0; i < fireFood.length; i++) {
        drawFireFood(fireFood[i]);
      }
      for (let i = 0; i < bullet.length; i++) {
        drawFire(bullet[i]);
      }
      for (let i = 0; i < viruses.length; i++) {
        drawVirus(viruses[i]);
      }
      for (let i = 0; i < bots.length; i++) {
        drawBots(bots[i]);
      }

      if (borderDraw) {
        drawborder();
      }
      const orderMass = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].type === 'player') {
          for (let j = 0; j < users[i].cells.length; j++) {
            orderMass.push({
              nCell: i,
              nDiv: j,
              mass: users[i].cells[j].mass
            });
          }
        }
      }
      // orderMass.sort((obj1, obj2) => {
      //   return obj1.mass - obj2.mass;
      // });


      drawPlayers(orderMass);
      socket.emit('0', target); // playerSendTarget "Heartbeat".
    } else {
      renderer.setText('Game Over!', 'state', textStyle);
    }
  } else {
    graph.beginFill(0xffffff);
    graph.lineStyle(0);
    graph.drawRect(0, 0, screenWidth, screenHeight);
    graph.endFill();

    if (kicked) {
      if (reason !== '') {
        renderer.setText(`You were kicked for:\r\n${reason}`, 'state', textStyle);
      } else {
        renderer.setText('You were kicked!', 'state', textStyle);
      }
    } else {
      renderer.setText('Disconnected!', 'state', textStyle);
    }
  }
  renderer && renderer.render();
}

function animloop() {
  stats.begin();
  gameLoop();
  stats.end();
  animLoopHandle = window.requestAnimFrame(animloop);
}

function toggleGameMenu(value) {
  if (value) {
    document.getElementById('startMenuWrapper').className = 'uk-height-1-1 uk-flex uk-flex-center uk-flex-middle';
    document.getElementById('miniMap').className = 'uk-hidden';
    document.getElementById('miniMap').className = 'uk-hidden';
    document.getElementById('bottomBanner').className = 'uk-panel uk-panel-box';
    document.getElementById('optionButtons').className = 'uk-hidden';

    document.getElementById('startMenuLeft').className = 'uk-animation-slide-top';
    document.getElementById('startMenuLoading').className = 'uk-hidden';
    document.getElementById('startMenu').className = 'uk-panel uk-panel-box uk-margin-bottom uk-animation-slide-left';
    document.getElementById('startMenuAdvert').className = 'uk-panel uk-panel-box uk-animation-slide-left';
  } else {
    document.getElementById('startMenuWrapper').className = 'uk-hidden';
    document.getElementById('gameAreaWrapper').className = '';
    document.getElementById('miniMap').className = '';
    document.getElementById('rightBonuses').className = '';
    document.getElementById('bottomBonuses').className = '';
    document.getElementById('bottomBanner').className = 'uk-hidden';
    document.getElementById('optionButtons').className = '';
    document.body.appendChild(stats.dom);
    c.focus();
  }
}
function startGameFirst() {
  playerName = 'spectate';
  playerType = 'spectate';
  player.__smoothRate = 0.2;
  socket = io({
    query: 'type=spectate',
    transports: ['websocket']
  });
  chat = chatClient(socket);
  setupSocket(socket, playerType);
  socket.emit('respawn');
  document.getElementById('gameAreaWrapper').className = '';
  animloop();
}

function startGame(type) {
  playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '').substring(0, 25);
  playerType = type;
  player.__smoothRate = type === 'spectate' ? 0.2 : 0.5;

  // screenWidth = window.innerWidth;
  // screenHeight = window.innerHeight;

  if (type === 'player') {
    let timer = setTimeout(function tick() {
      if (gameStart) {
        toggleGameMenu(false);
        clearTimeout(timer);
      } else {
        timer = setTimeout(tick, 100);
      }
    }, 100);
  } else if (type === 'spectate') {
    socket.emit('spectate', 'gameleader');
    toggleGameMenu(false);
  }

  if (!socket) {
    socket = io({
      query: 'type=' + type,
      transports: ['websocket']
    });
    setupSocket(socket, type);
  } else if (type !== player.type) {
    player.name = playerName;
    player.w = screenWidth;
    player.h = screenHeight;
    player.target = target;
    player.score = 0;
    player.type = type;
    socket.emit('forceupdate', player);
  }
  if (!animLoopHandle) {
    animloop();
    socket.emit('respawn');
  }
}

// Checks if the nick chosen contains valid alphanumeric characters (and underscores).
function validNick() {
  const regex = /^\w*$/;
  debug('Regex Test', regex.exec(playerNameInput.value));
  // return regex.exec(playerNameInput.value) !== null;
  return true;
}

window.onload = () => {
  // startGame('player');
  ping('https://blobber.io/').then(delta => {
    console.log(`Ping time was ${String(delta)} ms`);
    window.setTimeout(() => {
      document.getElementById('startMenuLeft').className = 'uk-animation-slide-top';
      document.getElementById('startMenuLoading').className = 'uk-hidden';
      document.getElementById('startMenu').className = 'uk-panel uk-panel-box uk-margin-bottom uk-animation-slide-left';
      document.getElementById('startMenuAdvert').className = 'uk-panel uk-panel-box uk-animation-slide-left';
    }, 3000);
  }).catch(err => {
    console.error(`Could not ping remote URL ${err}`);
  });
  // startGame('menu');
  if (document.getElementById('startButton') !== null) {
    btn.onclick = () => {
      // Checks if the nick is valid.
      if (validNick()) {
        spectateMode = false;
        // nickErrorText.style.opacity = 0;
        startGame('player');
      } else {
        // nickErrorText.style.opacity = 1;
      }
    };
  }

  if (document.getElementById('exitButton') !== null) {
    btnExit.onclick = () => {
      $.post('/logout', data => {
        if (data === 'OK') {
          window.location.reload(true);
        }
      });
    };
  }
  // const nickErrorText = document.querySelector('#startMenu .input-error');

  btnS.onclick = () => {
    startGame('spectate');
    spectateMode = true;
  };

  settingsMenu.onclick = () => {
    if (settings.classList[0] === 'uk-hidden') {
      settings.className = 'uk-animation-fade uk-margin-top';
    } else {
      settings.className = 'uk-hidden';
    }
  };

  dropPowers.click(function() {
    dropPowers.each((i, link) => {
      if (link.classList[1] !== 'power-current') {
        link.className = 'link-power';
      }
    });
    if (this.classList[1] !== 'power-current') {
      this.className = 'link-power power-next';
    }
    socket.emit('playerPower', this.name, getCookie());
    c.focus();
  });

  $('#showBorder, #showMass, #showChat, #darkTheme, #showLeaderboard, #continuity').change(function() {
    $.post('/settings', {
      option: this.name
    });
    if (this.name === 'border') {
      toggleBorder();
    }
    if (this.name === 'mass') {
      toggleMass();
      toggleButtons(bMass[0], 'uk-active', bMass, bMassicon);
    }
    if (this.name === 'move') {
      toggleContinuity();
    }
    if (this.name === 'dark') {
      toggleDarkMode();
      toggleButtons(bTheme[0], 'uk-active', bTheme, bThemeicon);
    }
    if (this.name === 'leaderboard') {
      toggleButtons(bLeaderboard, 'uk-hidden', bLeaderbuttons, bLeadericon);
    }
    if (this.name === 'chat') {
      toggleButtons(bChat, 'uk-hidden', bChatbox, bChaticon);
    }
  });

  $('#playerNameInput').change(function() {
    if (validNick()) {
      $.post('/settings/name', {
        nick: this.value
      });
    }
  });

  $('#playerAvatarInput').change(function() {
    var value = this.value
    clearTimeout(window._changeAvatarTimeout)
    window._changeAvatarTimeout = setTimeout(function(){
      $('#playerAvatar')[0].src = value
      $('#playerAvatar')[0].onload = () => $.post('/settings/avatar', {avatar: this.src});
    },100)
  });

  playerNameInput.addEventListener('keypress', (e) => {
    const key = e.which || e.keyCode;

    if (key === KEY_ENTER) {
      if (validNick()) {
        // nickErrorText.style.opacity = 0;
        startGame('player');
        e.preventDefault();
      } else {
        // nickErrorText.style.opacity = 1;
      }
    }
  });

  if ($('#darkTheme').prop('checked')) {
    toggleDarkMode();
  }

  if ($('#showMass').prop('checked')) {
    toggleMass();
  }

  if ($('#continuity').prop('checked')) {
    toggleContinuity();
  }

  if ($('#showBorder').prop('checked')) {
    toggleBorder();
  }

  startGameFirst('spectate');
};

// Register when the mouse goes off the canvas.
function outOfBounds() {
  if (!continuity) {
    target = { x: 0, y: 0 };
  }
}

// Chat command callback functions.
function keyInput(event) {
  const key = event.which || event.keyCode;
  if (key === KEY_FIREFOOD && reenviar) {
    socket.emit('1');
    reenviar = false;
  } else if (key === KEY_POWER && reenviar) {
    cellId.play();
    socket.emit('2');
    reenviar = false;
  } else if (key === KEY_CHAT) {
    input.focus();
  }
}

feedId.onclick = () => {
  socket.emit('1');
  reenviar = false;
};

splitId.onclick = () => {
  socket.emit('2');
  reenviar = false;
};

function horizontal(key) {
  return key === KEY_LEFT || key === KEY_RIGHT;
}

function vertical(key) {
  return key === KEY_DOWN || key === KEY_UP;
}

function directional(key) {
  return horizontal(key) || vertical(key);
}

// Updates the direction array including information about the new direction.
function newDirection(direction, list, isAddition) {
  let result = false;
  let found = false;
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i] === direction) {
      found = true;
      if (!isAddition) {
        result = true;
        // Removes the direction.
        list.splice(i, 1);
      }
      break;
    }
  }
  // Adds the direction.
  if (isAddition && found === false) {
    result = true;
    list.push(direction);
  }

  return result;
}

// Updates the target according to the directions in the directions array.
function updateTarget(list) {
  target = { x: 0, y: 0 };
  let directionHorizontal = 0;
  let directionVertical = 0;
  for (let i = 0, len = list.length; i < len; i++) {
    if (directionHorizontal === 0) {
      if (list[i] === KEY_LEFT) {
        directionHorizontal -= Number.MAX_VALUE;
      } else if (list[i] === KEY_RIGHT) {
        directionHorizontal += Number.MAX_VALUE;
      }
    }
    if (directionVertical === 0) {
      if (list[i] === KEY_UP) {
        directionVertical -= Number.MAX_VALUE;
      } else if (list[i] === KEY_DOWN) {
        directionVertical += Number.MAX_VALUE;
      }
    }
  }
  target.x += directionHorizontal;
  target.y += directionVertical;
}

// Function called when a key is pressed, will change direction if arrow key.
function directionDown(event) {
  const key = event.which || event.keyCode;

  if (directional(key)) {
    directionLock = true;
    if (newDirection(key, directions, true)) {
      updateTarget(directions);
      socket.emit('0', target);
    }
  } else if (key === KEY_ESC) {
    if (player.type === 'spectate') {
      console.log('ESC KEY PRESS toggleGameMenu(true)');
      toggleGameMenu(true);
    }
  }
}

// Function called when a key is lifted, will change direction if arrow key.
function directionUp(event) {
  const key = event.which || event.keyCode;
  if (directional(key)) {
    if (newDirection(key, directions, false)) {
      updateTarget(directions);
      if (directions.length === 0) directionLock = false;
      socket.emit('0', target);
    }
  }
}

function checkLatency() {
  // Ping.
  startPingTime = Date.now();
  socket.emit('drip');
}

function toggleBorder() {
  if (!borderDraw) {
    borderDraw = true;
   /*  chat.addSystemLine('Showing border.');*/
  } else {
    borderDraw = false;
   /*  chat.addSystemLine('Hiding border.');*/
  }
}

function toggleContinuity() {
  if (!continuity) {
    continuity = true;
    /* chat.addSystemLine('Continuity enabled.'); */
  } else {
    continuity = false;
    /* chat.addSystemLine('Continuity disabled.'); */
  }
}

let timer = setTimeout(function tick() {
  if (chat) {
    chat.registerCommand('ping', 'Check your latency.', () => {
      checkLatency();
    });

    chat.registerCommand('dark', 'Toggle dark mode.', () => {
      toggleDarkMode(chat);
    });

    chat.registerCommand('border', 'Toggle visibility of border.', () => {
      toggleBorder();
    });

    chat.registerCommand('mass', 'Toggle visibility of mass.', () => {
      toggleMass(chat);
    });

    chat.registerCommand('continuity', 'Toggle continuity.', () => {
      toggleContinuity();
    });

    chat.registerCommand('help', 'Information about the chat commands.', () => {
      chat.printHelp();
    });

    chat.registerCommand('login', 'Login as an admin.', (args) => {
      socket.emit('pass', args);
    });

    chat.registerCommand('kick', 'Kick a player, for admins only.', (args) => {
      socket.emit('kick', args);
    });
    clearTimeout(timer);
  } else {
    timer = setTimeout(tick, 1000);
  }
}, 1000);

function gameInput(mouse) {
  if (!directionLock) {
    target.x = mouse.clientX - innerWidth / 2;
    target.y = mouse.clientY - innerHeight / 2;
  }
}

function touchInput(touch) {
  touch.preventDefault();
  touch.stopPropagation();
  if (!directionLock) {
    target.x = touch.touches[0].clientX - innerWidth / 2;
    target.y = touch.touches[0].clientY - innerHeight / 2;
  }
}

c.width = screenWidth; c.height = screenHeight;
c.addEventListener('mousemove', gameInput, false);
c.addEventListener('mouseout', outOfBounds, false);
c.addEventListener('keypress', keyInput, false);
c.addEventListener('keyup', (event) => {reenviar = true; directionUp(event); }, false);
c.addEventListener('keydown', directionDown, false);
c.addEventListener('touchstart', touchInput, false);
c.addEventListener('touchmove', touchInput, false);

window.requestAnimFrame = (() => {
  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

window.cancelAnimFrame = (() => {
  return  window.cancelAnimationFrame || window.mozCancelAnimationFrame;
})();

debug('[STARTING CLIENT]');
