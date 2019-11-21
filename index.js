var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cors = require('cors');

const rateLimit = require("express-rate-limit");
 
const apiLimiter = rateLimit({
  windowMs: 1000,
  max: 5
});

var app = express();
app.use(cors());

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

console.log('Server is up and running')
