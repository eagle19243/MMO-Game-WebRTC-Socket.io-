import toggleDarkMode from './toggleDarkMode.js';
import toggleMass     from './toggleMass.js';

const c = document.getElementById('cvs');
const chat = $('#chatbox');
const chatbox = $('.button-chatbox');
const chaticon = $('.button-chatbox > i');
const theme = $('.button-theme');
const themeicon = $('.button-theme > i');
const mass = $('.button-mass');
const massicon = $('.button-mass > i');
const leaderboard = $('#status');
const leaderbuttons = $('.button-leaderboard');
const leadericon = $('.button-leaderboard > i');

function buttons(check, cls, btns, icon) {
  if ($(check).hasClass(cls)) {
    $(btns[0]).removeClass('uk-button-danger')
      .addClass('uk-button-primary')
      .removeClass('uk-active');
    $(btns[1]).removeClass('uk-active');
    $(icon).removeClass('uk-icon-close').addClass('uk-icon-check');
    if (check !== btns[0]) {
      $(check).removeClass('uk-hidden');
    }
    c.focus();
  } else {
    $(btns[0]).addClass('uk-active')
      .removeClass('uk-button-primary')
      .addClass('uk-button-danger');
    $(btns[1]).addClass('uk-active');
    $(icon).removeClass('uk-icon-check').addClass('uk-icon-close');
    if (check !== btns[0]) {
      $(check).addClass('uk-hidden');
    }
    c.focus();
  }
}

for (let i = 0; i < chatbox.length; i++) {
  chatbox[i].onclick = () => {
    buttons(chat, 'uk-hidden', chatbox, chaticon);
    $.post('/settings', {
      option: 'chat'
    });
  };
}

for (let i = 0; i < theme.length; i++) {
  theme[i].onclick = () => {
    toggleDarkMode();
    buttons(theme[0], 'uk-active', theme, themeicon);
    $.post('/settings', {
      option: 'dark'
    });
  };
}

for (let i = 0; i < mass.length; i++) {
  mass[i].onclick = () => {
    toggleMass();
    buttons(mass[0], 'uk-active', mass, massicon);
    $.post('/settings', {
      option: 'mass'
    });
  };
}

for (let i = 0; i < leaderbuttons.length; i++) {
  leaderbuttons[i].onclick = () => {
    buttons(leaderboard, 'uk-hidden', leaderbuttons, leadericon);
    $.post('/settings', {
      option: 'leaderboard'
    });
  };
}

export default buttons;
