/**
  ** mongoDB schema design
  ** author: Piyush
  ** date: 11/22/2019
**/

// get an instance of mongoose and mongoose.schema for lines
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var saved_url = new Schema({
	"url":{type:String,unique:true},
	"ref_count":{type:Number},
	"params":[]
})

//------------------------------------------------------------------------------------------------------

mongoose.model('saved_url',saved_url);