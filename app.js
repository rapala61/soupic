var dotEnv = require('dotenv');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');

// Load env variables
if (!process.env.NODE_ENV) {
  console.log(process.env.NODE_ENV);
  dotEnv.load();
}


// connect to db
mongoose.connect( process.env.MONGOLAB_URI || process.env.MONGODEV_URI );

// Setup ejs engine support
app.set('view engine', 'ejs');

// Setup default assets folder
app.use(express.static('./public'));

// middleware
app.use(bodyParser.urlencoded({extended: true}));

// map routes
app.use( '/', indexRouter );

// start server
app.listen( process.env.PORT || process.env.DEV_PORT, function() {
  console.log( '...magic at ' + process.env.DEV_PORT );
});
