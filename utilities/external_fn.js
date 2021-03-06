var express = require('express');
var app = express();
var cheerio = require('cheerio');
var config = require('../config');
var url_lib = require('url');

var mongoose = require('mongoose');
var saved_url_schema = mongoose.model('saved_url')

module.exports = {

	make_request_to_external_url: function(request,url,callback){

		request(url, function(error, response, body) {
		  if(error) { 
		  	console.error('There was an error!');
		  	callback({success:false,message:'error while making the request'}) 
		  }else{
		  		var $ = cheerio.load(body);

		  		let unique_records = {};

			  	$('a').each(function() {
				    var link = $(this).attr('href');

				    //filterd un-necessary links like to that of email address or any subdomains present on the page
				    if(link && link.match(config.REGEX)){
				      
					    var pathname = link.split("?");
					    
					    var url_parts = url_lib.parse(link, true);
						var query = url_parts.query;
						  
						let all_params = Object.keys(query)

				      	let url = pathname[0]
				    	if(unique_records[url]){
				    		unique_records[url]["ref_count"] = unique_records[url]["ref_count"]+1;
				    		unique_records[url]["params"] = [...new Set([...unique_records[url]["params"] ,...all_params])];
				    	}else{
				    		unique_records[url] = {
				  				"ref_count":1,
				  				"params":[]
				  			}	
				    	}
				    };
			  	});

			  	let total_links = Object.keys(unique_records)

			  	for(let i=0;i<total_links.length;i++){
			  		let key = total_links[i]
			  		module.exports.save_urls_in_db(unique_records[key],key,function(resp){
			  			if(i == total_links.length-1){
			  				callback(resp)
			  			}
			  		})
			  	}
			  	//callback({success:true,message:"Success",data:unique_records})
		    }
		});

	},

	save_urls_in_db: function(data,key,callback){
		saved_url_schema.update(
			 { "url": key }, 
			 { $set:{
			 		"url": key,
			 		"ref_count":data.ref_count,
			 		"params":data.params
			 	}
			 },{upsert:true},
			 function(err,cb) {
			 	if (err) {
					callback({success:false, msg:'Error'});
			 	}else{
					callback({success:true, msg:'success'});
			 	}
		});
	},

	fetch_urls_from_db: function(callback){
		saved_url_schema.find({},{_id:0},function(error,response){
			if(error){
				callback({success:false, msg: 'can not fetch data',data:[]});
			}else{
				callback({success:true, data:response});
			}
		})
	}
};
