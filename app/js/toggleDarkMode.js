import Config from './config';

let LIGHT_THEME = 'light';
const gameArea = $('#gameAreaWrapper');
const buttons = $('#optionButtons');
const chatbox = $('#chatbox');
const body = $('body');
const LINELIGHT = '#000000';
const LINEDARK = '#ff0099';

export default (chat) => {
  if (LIGHT_THEME === 'light') {
    body.addClass('darkmode');
    chatbox.addClass('dark');
    gameArea.addClass('dark');
    buttons.addClass('dark');
    Config.lineColor = LINEDARK;
    LIGHT_THEME = 'dark';
    if (chat !== undefined) {
      chat.addSystemLine('Dark mode enabled.');
    }
  } else {
    body.removeClass('darkmode');
    chatbox.removeClass('dark');
    gameArea.removeClass('dark');
    buttons.removeClass('dark');
    Config.lineColor = LINELIGHT;
    LIGHT_THEME = 'light';
    if (chat !== undefined) {
      chat.addSystemLine('Dark mode disabled.');
    }
  }
};

export const getTheme = function(){
  return LIGHT_THEME
}
