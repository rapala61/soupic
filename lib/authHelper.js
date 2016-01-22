var dotEnv = require('dotenv').config();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var session = require('client-sessions');
var AuthHelper = AuthHelper || {};

// Sets the session name
AuthHelper.sessionName = process.env.DEV_SESSION_NAME || 'soupic.prod.session';

// middleWare related functionality
AuthHelper.middleWare = {

  // This middleware is fired when the user requests /login
  // If the user is already logged in, redirects to /profile
  // If not, it checks the username and password to authenticate and log in,
  // or redirect to /login with error.
  loginUser: function(req, res, next ){

    // User is already in session
    if ( req.user ) {
      res.redirect('/profile');

    // If it's a post request
    }else if( req.body.user ){
      var userPayload = req.body.user;
      User.findOne({ username: userPayload.username }, function(err, dbUser) {

        if ( err ) { res.status(500).end() }

        // not found
        if ( !dbUser ) {
          console.log('invalid username');



          // TODO : flash messages
          res.redirect('/') //, { error: 'Invalid username or password.' });

        // found
        }else {
          console.log('user is found, lets see if passwords match');
          bcrypt.compare( userPayload.password, dbUser.password, function(err, isMatch){

            if (isMatch) {
              req[AuthHelper.sessionName].user = dbUser;
              req.user = dbUser;
              res.render('profile', { title: 'Welcome ' + dbUser.username , user: dbUser });

            // password doesnt match
            }else {
              res.redirect('/') //, { error: 'Invalid username or password.' });
            }
          });
        }
      })
    }else {
      res.redirect('/')
    }
  },

  // Middleware to load user from session
  loadUserFromSession: function( req, res, next ) {
    var activeSession = req[AuthHelper.sessionName];

    // If there is an active session
    if ( activeSession && activeSession.user ) {

      User.findOne({ username: activeSession.user.username }, function( err, dbUser ) {

        if (dbUser) {
          console.log('user has valid session, refresh it');
          req[AuthHelper.sessionName].user = dbUser;
          req.user = dbUser
        }else {
          console.log('user no longer exists');
          req[AuthHelper.sessionName].reset();
          req.user = undefined;
        }
        next();
      });
    }else {
      req[AuthHelper.sessionName] = {};
      req.user = undefined;
      next();
    }
  },

  // Used as a middleware to require authentication
  requireLogin: function( req, res, next ) {
    if (!req.user) {
      res.redirect('/');
    }else {
      next();
    }
  }
}

AuthHelper.loginUser = function( user ){
  req[AuthHelper.sessionName].user = user;
  req.user = user;
}

// AuthHelper.resetUser = function() {
//
// }

module.exports = AuthHelper;
