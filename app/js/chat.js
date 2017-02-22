import {
  KEY_ESC,
  KEY_ENTER
} from './keys.js';

import {
  input,
  chatList,
  c,
  mobile
} from './dom.js';

let socket;

function ChatClient(sk) {
  socket = sk;
  this.commands = {};
  input.addEventListener('keypress', this.sendChat.bind(this));
  input.addEventListener('keyup', (key) => {
    const curKey = key.which || key.keyCode;
    if (curKey === KEY_ESC) {
      input.value = '';
      c.focus();
    }
  });
}

// Chat box implementation for the users.
ChatClient.prototype.addChatLine = function(name, message, me) {
  if (mobile) {
    return;
  }
  const newline = document.createElement('li');

  // Colours the chat input correctly.
  newline.className = (me) ? 'me' : 'friend';
  newline.innerHTML = `<b>${((name.length < 1) ? 'An unnamed cell' : name)}</b>: ${message}`;

  this.appendMessage(newline);
};


// Chat box implementation for the system.
ChatClient.prototype.addSystemLine = function(message) {
  if (mobile) {
    return;
  }
  const newline = document.createElement('li');

  // Colours the chat input correctly.
  newline.className = 'system';
  newline.innerHTML = message;

  // Append messages to the logs.
  this.appendMessage(newline);
};

// Places the message DOM node into the chat box.
ChatClient.prototype.appendMessage = (node) => {
  if (mobile) {
    return;
  }

  if (chatList.childNodes.length > 8) {
    chatList.removeChild(chatList.childNodes[0]);
  }

  chatList.appendChild(node);
  chatList.scrollTop = chatList.clientHeight;
};

// Sends a message or executes a command on the click of enter.
ChatClient.prototype.sendChat = function(key) {
  const commands = this.commands;

  const curKey = key.which || key.keyCode;

  if (curKey === KEY_ENTER) {
    const text = input.value.replace(/(<([^>]+)>)/ig, '');
    if (text !== '') {
      // Chat command.
      if (text.indexOf('-') === 0) {
        const args = text.substring(1).split(' ');
        if (commands[args[0]]) {
          commands[args[0]].callback(args.slice(1));
        } else {
          this.addSystemLine(`Unrecognized Command: ${text}, type -help for more info.`);
        }

      // Allows for regular messages to be sent to the server.
      } else {
        socket.emit('playerChat', { message: text });
      }

      // Resets input.
      input.value = '';
      c.focus();
    }
  }
};

// Allows for addition of commands.
ChatClient.prototype.registerCommand = function(name, description, callback) {
  this.commands[name] = {
    description: description,
    callback: callback
  };
};

// Allows help to print the list of all the commands and their descriptions.
ChatClient.prototype.printHelp = function() {
  const commands = this.commands;
  for (const cmd in commands) {
    if (commands.hasOwnProperty(cmd)) {
      this.addSystemLine(`- ${cmd}: ${commands[cmd].description}`);
    }
  }
};

export default (sk) => new ChatClient(sk);
