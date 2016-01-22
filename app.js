var dotEnv = require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');
var clientSessions = require('client-sessions');

// connect to db
mongoose.connect( process.env.MONGOLAB_URI || process.env.MONGODEV_URI );

// Setup ejs engine support
app.set('view engine', 'ejs');

// Setup default assets folder
app.use(express.static('./public'));

// Session middleware
app.use(clientSessions({
  cookieName: process.env.DEV_SESSION_NAME || 'soupic.prod.session',
  secret: 'anythingcanbesoupic',
  duration: 2 * 60 * 60 * 1000, // 2 hours
  activeDuration: 10 * 60 * 1000 // 10 minutes
}));

// middleware
app.use(bodyParser.urlencoded({extended: true}));

// map routes
app.use( '/', indexRouter );

// start server
var port = process.env.PORT || process.env.DEV_PORT || 8080;
app.listen( port, function() {
  console.log( '...magic at ' + port );
});
