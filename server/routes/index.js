import { Router } from 'express';
import Debug      from 'debug';
import eachSeries from 'async/eachSeries';
import models     from '../models/index';
import Config     from '../../config.json';

const router = new Router();
const debug  = Debug('app');

import passport from 'passport';

import twitter  from 'passport-twitter';
import facebook from 'passport-facebook';
import google   from 'passport-google-oauth';

const Facebook = facebook.Strategy;
const Twitter = twitter.Strategy;
const Google = google.OAuth2Strategy;

function getListPowers() {
  const powers = {'droplist': []};
  for (const prop in Config.power) {
    if (Config.power.hasOwnProperty(prop) && Config.power[prop].active === true) {
      powers['droplist'].push({
        key: prop.toLowerCase(),
        value: Config.power[prop].default
      });
    }
  }
  return powers;
}

const data = {};
const options = {
  chat: true,
  dark: false,
  leaderboard: true,
  border: true,
  mass: false,
  move: true,
  round: true,
  powers: getListPowers()
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new Facebook({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `https://${process.env.DOMAIN}/login/facebook/callback`
}, (accessToken, refreshToken, profile, done) => {
  debug(profile);
  models
    .User
    .findOrCreate({
      where: {
        userId: profile.id
      },
      include: [ models.Setting ],
      defaults: {
        displayName: profile.displayName,
        provider: profile.provider
      }
    })
    .spread((user, created) => {
      debug(user.get({
        plain: true
      }));
      const opt = Object.assign({}, options);
      eachSeries(user.get({
        plain: true
      }).Settings, (option, callback) => {
        opt[option.key] = JSON.parse(option.value);
        callback();
      }, err => {
        if (err) {
          console.error(err);
          done(err);
        } else {
          done(null, {
            userId: user.dataValues.userId,
            username: user.dataValues.username,
            displayName: user.dataValues.displayName,
            options: opt
          });
        }
      });
    });
}));

passport.use(new Twitter({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_KEY_SECRET,
  callbackURL: `https://${process.env.DOMAIN}/login/twitter/callback`
}, (token, tokenSecret, profile, done) => {
  debug(profile);
  models
    .User
    .findOrCreate({
      where: {
        userId: profile.id
      },
      include: [ models.Setting ],
      defaults: {
        displayName: profile.displayName,
        provider: profile.provider
      }
    })
    .spread((user, created) => {
      debug(user.get({
        plain: true
      }));
      const opt = Object.assign({}, options);
      eachSeries(user.get({
        plain: true
      }).Settings, (option, callback) => {
        opt[option.key] = JSON.parse(option.value);
        callback();
      }, err => {
        if (err) {
          console.error(err);
          done(err);
        } else {
          done(null, {
            userId: user.dataValues.userId,
            username: user.dataValues.username,
            displayName: user.dataValues.displayName,
            options: opt
          });
        }
      });
    });
}));

passport.use(new Google({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `https://${process.env.DOMAIN}/login/google/callback`
}, (token, tokenSecret, profile, done) => {
  debug(profile);
  models
    .User
    .findOrCreate({
      where: {
        userId: profile.id
      },
      include: [ models.Setting ],
      defaults: {
        displayName: profile.displayName,
        provider: profile.provider
      }
    })
    .spread((user, created) => {
      debug(user.get({
        plain: true
      }));
      const opt = Object.assign({}, options);
      eachSeries(user.get({
        plain: true
      }).Settings, (option, callback) => {
        opt[option.key] = JSON.parse(option.value);
        callback();
      }, err => {
        if (err) {
          console.error(err);
          done(err);
        } else {
          done(null, {
            userId: user.dataValues.userId,
            username: user.dataValues.username,
            displayName: user.dataValues.displayName,
            options: opt
          });
        }
      });
    });
}));

router.route('/login/facebook').get(passport.authenticate('facebook'));
router.route('/login/facebook/callback').get(passport.authenticate('facebook', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/');
});
router.route('/login/google').get(passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login']
}));
router.route('/login/google/callback').get(passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/');
});
router.route('/login/twitter').get(passport.authenticate('twitter'));
router.route('/login/twitter/callback').get(passport.authenticate('twitter', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/');
});

router.route('/').get((req, res) => {
  data.files = require('../assets.json');
  data.partials = {
    body: 'index'
  };
  if (req.user !== undefined) {
    models.User.findOne({
      where: {
        userId: req.user.userId
      },
      include: [ models.Setting ]
    }).then(user => {
      req.user.userId = user.userId;
      req.user.username = user.username;
      req.user.displayName = user.displayName;
      return user.getSettings();
    }).then(settings => {
      eachSeries(settings, (option, callback) => {
        req.user.options[option.key] = JSON.parse(option.value);
        callback();
      }, err => {
        if (err) {
          console.error(err);
        } else {
          if (req.session) {
            if (!req.session.powers) {
              req.session.powers = getListPowers();
            }
            data.powers = req.session.powers;
          } else {
            data.powers = getListPowers();
          }
          data.user = req.user;
          console.dir(data);
          res.render('layout', data);
        }
      });
    }).catch(err => {
      console.error(`DB error: ${err}`);
      data.user = {
        options
      };
      res.render('layout', data);
    });
  } else {
    if (req.session) {
      if (!req.session.powers) {
        req.session.powers = getListPowers();
      }
      data.powers = req.session.powers;
    } else {
      data.powers = getListPowers();
    }
    data.user = {
      options
    };
    res.render('layout', data);
  }
});

router.route('/settings').post((req, res) => {
  if (req.user !== undefined) {
    if (options.hasOwnProperty(req.body.option)) {
      models
        .User
        .findOne({
          where: {
            userId: req.user.userId
          },
          include: [ models.Setting ]
        }).then(user => {
          if (user !== null) {
            debug(user.get({
              plain: true
            }));
            let setting;
            eachSeries(user.Settings, (option, callback) => {
              if (option.key === req.body.option) {
                setting = option;
                setting.value = (!JSON.parse(setting.value)).toString();
                req.user.options[setting.key] = JSON.parse(setting.value);
              }
              callback();
            }, err => {
              if (err) {
                console.error(err);
                return null;
              } else {
                if (setting === undefined) {
                  return models.Setting.create({
                    key: req.body.option,
                    value: (!JSON.parse(req.user.options[req.body.option])).toString(),
                    UserId: user.id
                  });
                } else {
                  return setting.save();
                }
              }
            });
          } else {
            return null;
          }
        }).then(() => {
          res.send('OK');
        }).catch(err => {
          console.error(`DB error: ${err}`);
          res.send('OK');
        });
    } else {
      res.send('OK');
    }
  } else {
    res.send('OK');
  }
});

router.route('/settings/name').post((req, res) => {
  if (req.user !== undefined) {
    models.User.findOne({
      where: {
        userId: req.user.userId
      },
      include: [ models.Setting ]
    }).then(user => {
      user.username = req.body.nick;
      req.user.username = user.username;
      return user.save();
    }).then(() => {
      res.send('OK');
    }).catch(err => {
      console.error(`DB error: ${err}`);
      res.send('OK');
    });
  } else {
    res.send('OK');
  }
});

router.route('/settings/avatar').post((req, res) => {
  if (req.user !== undefined) {
    models.User.findOne({
      where: {
        userId: req.user.userId
      },
      include: [ models.Setting ]
    }).then(user => {
      user.avatar = req.body.avatar;
      req.user.avatar = user.avatar;
      return user.save();
    }).then(() => {
      res.send('OK');
    }).catch(err => {
      console.error(`DB error: ${err}`);
      res.send('OK');
    });
  } else {
    res.send('OK');
  }
});

router.route('/logout').post((req, res) => {
  req.session.destroy();
  res.send('OK');
});

export default router;
