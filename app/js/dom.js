import Renderer from './renderer';
let m = false;

if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
  m = true;
}

export const playerNameInput = document.getElementById('playerNameInput');
export const c = document.getElementById('cvs');
export const renderer = new Renderer(c);
export const graph = renderer.graph;
export const input = document.getElementById('chatInput');
export const chatList = document.getElementById('chatList');
export const statusId = document.getElementById('status');
export const scoreId = document.getElementById('score');
export const coordinatesId = document.getElementById('coordinates');
export const massId = document.getElementById('mass');
export const btnS = document.getElementById('spectateButton');
export const settingsMenu = document.getElementById('settingsButton');
export const settings = document.getElementById('settings');
export const cellId = document.getElementById('split_cell');
export const feedId = document.getElementById('feed');
export const splitId = document.getElementById('split');
export const btnExit = document.getElementById('exitButton');
export const btn = document.getElementById('startButton');
export const rightBonuses = $('#rightBonuses');
export const bottomBonuses = $('#bottomBonuses');
export const dropPowers = $('.link-power');
export const bChat = $('#chatbox');
export const bChatbox = $('.button-chatbox');
export const bChaticon = $('.button-chatbox > i');
export const bTheme = $('.button-theme');
export const bThemeicon = $('.button-theme > i');
export const bMass = $('.button-mass');
export const bMassicon = $('.button-mass > i');
export const bLeaderboard = $('#status');
export const bLeaderbuttons = $('.button-leaderboard');
export const bLeadericon = $('.button-leaderboard > i');
export const mobile = m;
