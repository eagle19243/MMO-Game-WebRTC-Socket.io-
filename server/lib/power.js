import SAT       from 'sat';
import * as Util from './util';
import Config    from '../../config.json';

const V = SAT.Vector;
const C = SAT.Circle;

export function checkPowers(user) {
  const nm = Util.upLetter(user.power.current);
  if (user.power.last) {
    const delta = Date.now() - user.power.last;
    const config = Config.power[nm].time;
    if (delta > (config * 1000)) {
      user.power.active = false;
    }
  }
}

export function moveInOut(name, c, currentCell, user, way) {
  const nm = Util.upLetter(name);
  const resp = new SAT.Response();
  let powerCollided;
  if (currentCell.biggest) {
    powerCollided = SAT.testCircleCircle(
      new C(new V(currentCell.x, currentCell.y), currentCell.radius * Config.power[nm].radius),
      new C(new V(c.x, c.y), c.radius), resp
    );
  }
  if (powerCollided) {
    let w = 10;
    if (way) {
      w = -10;
    }
    const x = (currentCell.x - c.x) * w;
    const y = (currentCell.y - c.y) * w;
    user.target.x = x;
    user.target.y = y;
  }
}

export function invisible(e, u) {
  if (e.power.active) {
    if (e.power.current === 'invisible') {
      if (e.id === u.id) {
        return e;
      }
    } else {
      return e;
    }
  } else {
    return e;
  }
}

export function slower(c, currentCell, user) {
  const resp = new SAT.Response();
  let powerCollided;
  if (currentCell.biggest) {
    powerCollided = SAT.testCircleCircle(
      new C(new V(currentCell.x, currentCell.y), currentCell.radius * Config.power.Slower.radius),
      new C(new V(c.x, c.y), c.radius), resp
    );
  }
  if (powerCollided) {
    for (let i = 0; i < user.cells.length; i++) {
      user.cells[i].speed = Config.power.Slower.value;
    }
  }
}

export function fire(c, currentCell, currentPlayer, bullet) {
  const resp = new SAT.Response();
  let powerCollided;
  if (currentCell.biggest) {
    powerCollided = SAT.testCircleCircle(
      new C(new V(currentCell.x, currentCell.y), currentCell.radius * Config.power.Slower.radius),
      new C(new V(c.x, c.y), c.radius), resp
    );
  }

  if (powerCollided) {
    const time = Config.bullets.rate * 1000;
    if ((currentPlayer.power.fire === undefined) ||
        ((Date.now() - currentPlayer.power.fire) > time)) {
      currentPlayer.fireGun(bullet, c.x, c.y);
    }
  }
}
