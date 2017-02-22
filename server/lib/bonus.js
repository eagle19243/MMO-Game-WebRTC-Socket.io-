import SAT       from 'sat';
import shortid   from 'shortid';
import * as Util from './util';
import Config    from '../../config.json';

const V = SAT.Vector;
const C = SAT.Circle;
let spin = -Math.PI;

function valueInRange(min, max, value) {
  return Math.min(max, Math.max(min, value));
}

export function pointBonus(playerCircle) {
  return (f) => {
    return SAT.pointInCircle(new V(f.x, f.y), playerCircle);
  };
}

export function deleteBonus(f, arr) {
  arr[f] = {};
  arr.splice(f, 1);
}

export function addBonus(add, arr, bonus) {
  const radius = Util.massToRadius(Config.defaultPlayerMass);
  let toAdd = add;
  while (toAdd--) {
    const position = Util.randomPosition(radius);
    arr.push({
      id: shortid.generate(),
      x: position.x,
      y: position.y,
      mass: 0,
      radius: radius,
      bonus
    });
  }
}

export function setBonus(bonus, name) {
  const nm = Util.upLetter(name);
  if (!bonus[name] || Config.bonus[nm].update) {
    bonus[name] = {
      time: Date.now(),
      active: true
    };
  }
  return bonus[name];
}

export function setSpeed(cells, value) {
  for (let i = 0; i < cells.length; i++) {
    cells[i].speed = cells[i].speed + value;
  }
}

export function randomBonus() {
  const arr = [];
  for (const name in Config.bonus.Mega.bonuses) {
    if (Config.bonus.Mega.bonuses.hasOwnProperty(name) && (Config.bonus.Mega.bonuses[name] === true)) {
      arr.push(name);
    }
  }
  return arr[Math.random() * arr.length >> 0];
}

export function checkBonuses(user, trigger) {
  let bonuses = user.bonus;
  if (trigger) {
    bonuses = user.bonus.got;
  }
  for (const name in bonuses) {
    if (bonuses.hasOwnProperty(name) && bonuses[name].time) {
      const nm = Util.upLetter(name);
      if (bonuses[name].time) {
        const delta = Date.now() - (bonuses[name].time);
        let config = Config.bonus[nm].time;
        if (trigger) {
          config = Config.bonus[nm].got.time;
        }
        if (delta > (config * 1000)) {
          if (trigger) {
            if (name === 'glue' || name === 'freeze') {
              for (let i = 0; i < user.cells.length; i++) {
                user.cells[i].speed = Config.slowBase;
              }
              delete bonuses[name];
            } else {
              delete bonuses[name];
            }
          } else {
            delete bonuses[name];
          }
        } else if (trigger && name === 'drunk') {
          const target = Util.randomPosition(user.radius);
          user.x = target.x;
          user.y = target.y;
        }
      }
    }
  }
}

export function gotBonuses(user) {
  for (const name in user.bonus.got) {
    if (user.bonus.got.hasOwnProperty(name) && user.bonus.got[name].time) {
      const nm = Util.upLetter(name);
      if (name === 'glue' && !user.bonus.got[name].active) {
        user.bonus.got[name].active = true;
        for (let i = 0; i < user.cells.length; i++) {
          user.cells[i].speed = user.cells[i].speed - Config.bonus[nm].got.value;
        }
      }
      if (name === 'freeze' && !user.bonus.got[name].active) {
        user.bonus.got[name].active = true;
        for (let i = 0; i < user.cells.length; i++) {
          user.cells[i].speed = Config.bonus[nm].got.value;
        }
      }
    }
  }
}

export function checkExtra(player, users) {
  if (player.bonus.extra1 &&
      player.bonus.extra2 &&
      player.bonus.extra3 &&
      player.bonus.extra4 &&
      player.bonus.extra5) {
    player.bonus.extra = {
      time: Date.now(),
      active: true
    };
    delete player.bonus.extra1;
    delete player.bonus.extra2;
    delete player.bonus.extra3;
    delete player.bonus.extra4;
    delete player.bonus.extra5;
    const top = users.sort((a, b) => {
      return b.massTotal - a.massTotal;
    });
    if (player.id !== top[0].id) {
      if (player.massTotal < top[0].massTotal) {
        const delta = (top[0].massTotal - player.massTotal) + 1;
        for (let i = 0; i < player.cells.length; i++) {
          if (player.cells[i].biggest) {
            player.cells[i].mass += delta;
            player.massTotal += delta;
            break;
          }
        }
      }
    }
  }
}

export function drawBonusCircle(cellCurrent, userCurrent, player, circle, screenWidth, screenHeight, gameHeight, gameWidth, graph, radius) {
  if (cellCurrent.biggest) {
    const r =  (cellCurrent.radius * radius);
    const scale = innerWidth / screenWidth
    const points = 15 + r * 0.05;
    const increase = Math.PI * 2 / points;
    let x = 0;
    let y = 0;
    const listPoints = [];
    for (let i = 0; i < points; i++) {
      x = r * Math.cos(spin) + circle.x;
      y = r * Math.sin(spin) + circle.y;
      if (typeof(userCurrent.id) === 'undefined') {
        x = valueInRange(-userCurrent.x + screenWidth / 2, gameWidth - userCurrent.x + screenWidth / 2, x);
        y = valueInRange(-userCurrent.y + screenHeight / 2, gameHeight - userCurrent.y + screenHeight / 2, y);
      } else {
        x = valueInRange(-cellCurrent.x - player.x + screenWidth / 2 + (cellCurrent.radius / 3), gameWidth - cellCurrent.x + gameWidth - player.x + screenWidth / 2 - (cellCurrent.radius / 3), x);
        y = valueInRange(-cellCurrent.y - player.y + screenHeight / 2 + (cellCurrent.radius / 3), gameHeight - cellCurrent.y + gameHeight - player.y + screenHeight / 2 - (cellCurrent.radius / 3), y);
      }
      spin += increase;
      listPoints.push(x * scale);
      listPoints.push(y * scale);
    }

    // graph.lineStyle(1, hslToRgb(userCurrent.hue, 1, 0.45));
    graph.beginFill(0x000000, 0.25);
    graph.drawPolygon(listPoints);
  }
}

export function infection(name, c, currentCell, user) {
  const nm = Util.upLetter(name);
  const resp = new SAT.Response();
  let bonusCollided;
  if (Config.bonus.biggest) {
    if (currentCell.biggest) {
      bonusCollided = SAT.testCircleCircle(
        new C(new V(currentCell.x, currentCell.y), currentCell.radius * Config.bonus[nm].radius),
        new C(new V(c.x, c.y), c.radius), resp
      );
    }
  } else {
    bonusCollided = SAT.testCircleCircle(
      new C(new V(currentCell.x, currentCell.y), currentCell.radius * Config.bonus[nm].radius),
      new C(new V(c.x, c.y), c.radius), resp
    );
  }
  if (bonusCollided) {
    if (!user.bonus.got[name]) {
      user.bonus.got[name] = {
        time: Date.now()
      };
    }
  }
}

export function drawBonus(bonus, name, player, screenWidth, screenHeight) {
  const nm = Util.upLetter(name);
  bonus.loop();
  bonus.render(bonus.x - player.x + screenWidth / 2, bonus.y - player.y + screenHeight / 2, Config.bonus[nm].image.w, Config.bonus[nm].image.h);
}

export function getDashoffset(configTime, bonusTime, r) {
  const now = Date.now() - bonusTime;
  const delta = configTime - (now / 1000);
  const val = Math.round((delta / configTime) * 100);
  const c = Math.PI * (r * 2);
  const pct = ((100 - val) / 100) * c;
  return pct;
}
