import Config from './config';

export default (chat) => {
  if (Config.toggleMassState === 0) {
    Config.toggleMassState = 1;
    if (chat !== undefined) {
      chat.addSystemLine('Viewing mass enabled.');
    }
  } else {
    Config.toggleMassState = 0;
    if (chat !== undefined) {
      chat.addSystemLine('Viewing mass disabled.');
    }
  }
};
