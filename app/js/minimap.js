import Config from './config';

const bw = 150;
const bh = 150;
const p = 5;

const cw = bw + (p * 2) + 1;
const ch = bh + (p * 2) + 1;

const deltaX = Config.gameWidth / bw;
const deltaY = Config.gameHeight / bh;

const canvas = $('<canvas id="miniMap" class="uk-hidden"/>').attr({
  width: cw,
  height: ch
}).appendTo('body');
const context = canvas.get(0).getContext('2d');

context.font = '18px';

export default (coorX, coorY, users) => {
  context.clearRect(0, 0, cw, ch);

  for (let x = 0; x <= bw; x += 25) {
    context.moveTo(0.5 + x + p, p);
    context.lineTo(0.5 + x + p, bh + p);
  }

  for (let x = 0; x <= bh; x += 25) {
    context.moveTo(p, 0.5 + x + p);
    context.lineTo(bw + p, 0.5 + x + p);
  }

  const arr = ['A', 'B', 'C', 'D', 'E', 'F'];
  let count = 0;
  for (let y = 0; y <= bh; y += 25) {
    let num = 0;
    for (let x = 0; x <= bw; x += 25) {
      context.fillText(`${arr[count]}${num}`, x + 12, y + 22);
      num += 1;
    }
    count += 1;
  }
  context.strokeStyle = 'white';
  context.stroke();
  for (let i = 0; i < users.length; i++) {
    context.beginPath();
    context.arc(
      (users[i].x / deltaX) + p,
      (users[i].y / deltaY) + p,
      3,
      0,
      2 * Math.PI,
      false
    );
    context.closePath();
    context.fillStyle = 'black';
    context.fill();
  }
  context.beginPath();
  context.arc(
    (coorX / deltaX) + p,
    (coorY / deltaY) + p,
    4,
    0,
    2 * Math.PI,
    false
  );
  context.closePath();
  context.fillStyle = 'white';
  context.fill();
};
