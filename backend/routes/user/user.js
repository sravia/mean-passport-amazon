var _ = require('lodash');
var express = require('express');
var app = express();
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('users');
var jwt = require('jsonwebtoken');
var config = require('./../../config.js');
var AmazonStrategy = require('passport-amazon').Strategy

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new AmazonStrategy({
    clientID: config.amazonClientId,
    clientSecret: config.amazonClientSecret,
    callbackURL: "http://"+config.host+":"+config.port+"/api/user/amazon/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

router.get('/profile', ensureAuthenticated, function(req, res){
  return res.status(200).send({ user: req.user });
});

router.get('/amazon/callback', 
  passport.authenticate('amazon', {successRedirect: '/',failureRedirect: '/login'}),
  function(req, res) {
    User.findOne({ 'amazonId': req.user.id }, (err, user) => {
      if(err)
        return done(err);
      if(!user){
        var newUser = new User();
        newUser.amazonId = req.user.id;
        newUser.emails = req.user.emails;
        newUser.save(function (err) {
            if(err){
              console.log(err);
            }
        });
      }
    })
  });

router.get('/authenticate', (req, res) => {
  var redirect = req.body.redirect || false;
  if (req.isAuthenticated()) {
    var token = jwt.sign({
      _id: req.user.amazonId
    }, config.jwt, {expiresIn: config.tokenexpirationtime})
    return res.status(200).send({
      user: {
        amazonId: req.user.id,
        _id: req.user._id
      },
      token: token,
      success: true,
      authenticated: true,
      redirect: redirect
    })
  } else {
    return res.status(200).send({
      user: {},
      success: false,
      authenticated: false,
      redirect: redirect
    })
  }
});

router.get('/login',
  passport.authenticate('amazon', { scope: ['profile', 'postal_code'] }),
  function(req, res){
  });

router.get('/logout', (req, res) => {
  req.logout();
  return res.status(200).send();
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  return res.status(400).send();
}

module.exports = router;
