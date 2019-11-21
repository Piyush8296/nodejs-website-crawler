/*const rateLimit = require("express-rate-limit");
 
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
 
// only apply to requests that begin with /api/
app.use("/api/", apiLimiter);*/

var request = require('request');
var cheerio = require('cheerio');

var URL = 'https://www.medium.com';

request(URL, function(error, response, body) {
  if(error) { return  console.error('There was an error!'); }

  var $ = cheerio.load(body);

  $('a').each(function() {
    var text = $(this).text();
    var link = $(this).attr('href');

    if(link && link.match(/medium.com/)){
      console.log(link);
    };
  });
});