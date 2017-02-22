import Stats from 'stats.js';

const stats = new Stats();
stats.dom.id = 'statsFPS';
stats.dom.style.left = null;
stats.dom.style.top = null;
stats.showPanel(0);

export default stats;
