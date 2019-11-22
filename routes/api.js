// packages/modules to import
var express = require('express'); 
var app = express();
var router = express.Router();
var request = require('request');
var external_functions = require('../utilities/external_fn');
var config = require('../config');

module.exports = function(io){

	router.get('/crawl_weblink',function(req,res){
		
		external_functions.make_request_to_external_url(request,config.URL_TO_BE_FETCHED,(response)=>{
			res.json(response)
		})				
	});

	router.get('/fetch_saved_links',function(req,res){
		
		external_functions.fetch_urls_from_db((response)=>{
			res.json(response)
		})				
	});

	return router;

};