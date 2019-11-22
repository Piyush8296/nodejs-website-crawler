var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('./schema/model');

var cors = require('cors');

const rateLimit = require("express-rate-limit");
var config = require('./config');
 
const apiLimiter = rateLimit({
  windowMs: 1000,
  max: 5
});

var app = express();
app.use(cors());

mongoose.connect(config.DB_URL, {useMongoClient: true});

mongoose.connection.on('connected', function(){
  console.log('DB CONNECTION ESTABLISHED'.bold.green);
});

mongoose.connection.on('error',function (err) {  
  console.log('ERROR CONNECTING DB ');
  
  setTimeout(function(){
    mongoose.connect(config.DB_URL, {useMongoClient: true});
  },5000);
});

mongoose.connection.on('disconnected', function () {  
  console.log('DB DISCONNECTED'.bold.red); 
  
  setTimeout(function(){
    mongoose.connect(config.DB_URL, {useMongoClient: true});
  },5000);
});

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    process.exit(0); 
  }); 
}); 

var io = require('./utilities/sockets').listen(app);

var api = require('./routes/api')(io);

app.get('/', function (request, response) {
  console.log('App Running'.bold.green);
  response.send('Un authorised access')
})

app.use(logger('dev'));

app.use(bodyParser.json({limit: '100mb'})); //payload size increased to 100mb
app.use(bodyParser.urlencoded({limit: '100mb', extended: true }));

app.use(cookieParser());


app.use('/api',api);

// only apply to requests that begin with /api/
app.use("/api/", apiLimiter);

module.exports = app;
