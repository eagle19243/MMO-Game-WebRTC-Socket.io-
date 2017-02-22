import shortid   from 'shortid';
import Config    from '../config.json';
import * as Util from './lib/util.js';
// import sprites   from '../app/js/sprites.js';
import {
  hslToRgb,
  combineColor
}                from '../app/js/utilities.js';

const initMassLog = Util.log(Config.defaultPlayerMass, Config.slowBase);

function Player(id, name, position, type, speed, power) {
  this.radius = Util.massToRadius(Config.defaultPlayerMass);
  this.ceilsId = 0;
  this.cells = [{
    mass: Config.defaultPlayerMass,
    x: position.x,
    y: position.y,
    radius: this.radius,
    speed: speed,
    id: (this.ceilsId++) + '@' + id
  }];
  this.massTotal = Config.defaultPlayerMass;
  this.admin = false;
  this.id = id;
  this.name = name;
  this.x = position.x;
  this.y = position.y;
  this.w = 1920;
  this.h = 1080;
  this.hue = Math.round(Math.random() * 360);
  this.type = type;
  this.lastHeartbeat = +new Date();
  this.score = 0;
  this.bonus = {
    got: {}
  };
  this.power = {
    active: false
  };
  if (power) {
    this.power.current = power;
  } else {
    for (const prop in Config.power) {
      if (Config.power.hasOwnProperty(prop)) {
        if (Config.power[prop].default === true) {
          this.power.current = prop.toLowerCase();
        }
      }
    }
  }
  this.sprite = Config.defaultPlayerSprite;
  this.color =  combineColor(hslToRgb(Math.random(),1,0.7));
  this.target = {
    x: 0,
    y: 0
  };
}

Player.prototype.heartbeat = function heartbeat(target) {
  this.lastHeartbeat = new Date().getTime();
  const {x, y} = target;
  if (x !== this.x || y !== this.y) {
    this.target = target;
  }
};

Player.prototype.canSplit = function canSplit() {
  return this.cells.length < Config.limitSplit && this.massTotal >= Config.defaultPlayerMass * 2;
};

Player.prototype.splitCell = function splitCell(cell) {
  if (cell && cell.mass >= Config.defaultPlayerMass * 2) {
    cell.mass = cell.mass / 2;
    cell.radius = Util.massToRadius(cell.mass);
    this.cells.push({
      mass: cell.mass,
      x: cell.x,
      y: cell.y,
      radius: cell.radius,
      speed: 25,
      id: (this.ceilsId++) + '@' + this.id,
    });
  }
};

Player.prototype.splitAllCells = function splitAllCells() {
  if (this.cells.length < Config.limitSplit && this.massTotal >= Config.defaultPlayerMass * 2) {
    this.cells.forEach((c) => this.splitCell(c));
  }
};

Player.prototype.biggestCell = function biggestCell() {
  if (Config.bonus.biggest) {
    this.cells.sort((a, b) => { return b.mass - a.mass; });
    for (let i in this.cells) {
      this.cells[i].biggest = (i == 0)
    }
  } else {
    for (let i in this.cells) {
      this.cells[i].biggest = true
    }
  }
};

Player.prototype.resize = function resize(dim) {
  this.w = Math.min(dim.w, 1920);
  this.h = Math.min(dim.h, 1080);
};

Player.prototype.move = function move() {
  let x = 0;
  let y = 0;

  for (let i = 0; i < this.cells.length; i++) {
    const target = {
      x: this.x - this.cells[i].x + this.target.x,
      y: this.y - this.cells[i].y + this.target.y
    };
    const dist = Math.sqrt(Math.pow(target.y, 2) + Math.pow(target.x, 2));
    const deg = Math.atan2(target.y, target.x);
    let slowDown = 1;
    if (this.cells[i].speed <= Config.slowBase) {
      slowDown = Util.log(this.cells[i].mass, Config.slowBase) - initMassLog + 1;
    }

    let deltaY = this.cells[i].speed * Math.sin(deg) / slowDown;
    let deltaX = this.cells[i].speed * Math.cos(deg) / slowDown;

    if (this.cells[i].speed > Config.slowBase) {
      if (this.bonus.speed === undefined) {
        if (this.power.current === 'speedo') {
          if (Date.now() - (Config.power.Speedo.time * 1000) > this.power.last) {
            this.cells[i].speed -= 0.5;
          }
        } else {
          this.cells[i].speed -= 0.5;
        }
      }
    }
    if (dist < (50 + this.cells[i].radius)) {
      deltaY *= dist / (50 + this.cells[i].radius);
      deltaX *= dist / (50 + this.cells[i].radius);
    }
    if (!isNaN(deltaY)) {
      this.cells[i].y += deltaY;
    }
    if (!isNaN(deltaX)) {
      this.cells[i].x += deltaX;
    }
    // Find best solution.
    this.cells.forEach((c, j) => {
      if (j !== i && this.cells[i] !== undefined) {
        const distance = Math.sqrt(Math.pow(c.y - this.cells[i].y, 2) + Math.pow(c.x - this.cells[i].x, 2));
        const radiusTotal = (this.cells[i].radius + c.radius);
        if (distance < radiusTotal) {
          if (this.lastSplit > new Date().getTime() - 1000 * Config.mergeTimer) {

            const ang = Math.atan2(c.y - this.cells[i].y,c.x - this.cells[i].x)
            const del = radiusTotal - distance
            const dx = Math.abs(0.25 * del * Math.cos(ang))
            const dy = Math.abs(0.25 * del * Math.sin(ang))

            if (this.cells[i].x < c.x) {
              this.cells[i].x -= dx;
            } else if (this.cells[i].x > c.x) {
              this.cells[i].x += dx;
            }
            if (this.cells[i].y < c.y) {
              this.cells[i].y -= dy;
            } else if ((this.cells[i].y > c.y)) {
              this.cells[i].y += dy;
            }
          } else if (distance < radiusTotal * 0.2 ) {
            this.cells[i].realRadius = 0
            this.cells[j].realRadius = 0
            this.cells[i].mass += c.mass;
            this.cells[i].radius = Util.massToRadius(this.cells[i].mass);
            this.cells.splice(j, 1);
          } else {
            // this.cells[i].realRadius = this.cells[i].realRadius || this.cells[i].radius
            // this.cells[j].realRadius = this.cells[j].realRadius || this.cells[j].radius

            // this.cells[i].realRadius -= 0.5;
            // this.cells[j].realRadius -= 0.5;
          }
        }
      }
    });
    if (this.cells.length > i) {
      const borderCalc = this.cells[i].radius / 3;
      if (this.cells[i].x > Config.gameWidth - borderCalc) {
        this.cells[i].x = Config.gameWidth - borderCalc;
      }
      if (this.cells[i].y > Config.gameHeight - borderCalc) {
        this.cells[i].y = Config.gameHeight - borderCalc;
      }
      if (this.cells[i].x < borderCalc) {
        this.cells[i].x = borderCalc;
      }
      if (this.cells[i].y < borderCalc) {
        this.cells[i].y = borderCalc;
      }
      x += this.cells[i].x;
      y += this.cells[i].y;
    }
  }
  this.x = x / this.cells.length;
  this.y = y / this.cells.length;
  this.biggestCell();
};

Player.prototype.fireFood = function fireFood(massFood) {
  this.cells.forEach((c, i) => {
    if (((c.mass >= Config.defaultPlayerMass + Config.fireFood) && Config.fireFood > 0)
      || (c.mass >= 20 && Config.fireFood === 0)) {
      const masa = Config.fireFood > 0
        ? Config.fireFood
        : c.mass * 0.1;
      c.mass -= masa;
      this.massTotal -= masa;
      massFood.push({
        id: Math.random(),
        _id: this.id,
        num: i,
        masa: masa,
        hue: this.hue,
        target: {
          x: this.x - c.x + this.target.x,
          y: this.y - c.y + this.target.y
        },
        x: c.x,
        y: c.y,
        radius: Util.massToRadius(masa),
        speed: 25
      });
    }
  });
};

Player.prototype.fireGun = function fireGun(bullet, x, y) {
  bullet.push({
    id: shortid.generate(),
    playerID: this.id,
    hue: this.hue,
    target: {
      x: x - this.x,
      y: y - this.y
    },
    x: this.x,
    y: this.y,
    time: Date.now(),
    radius: Config.bullets.radius,
    speed: Config.bullets.speed
  });
  this.power.fire = Date.now();
};

export default Player;
