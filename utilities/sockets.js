var express = require('express');
var app = express();
var socketio = require('socket.io');
var colors = require('colors');

var SOCKET_LIST = {};

var ALL_USERS = {}

module.exports = {
	listen :function(app){
		var port = 4000;

		var server = app.listen(process.env.PORT || port);
		var io = socketio.listen(server);

		io.on('connection', function(socket){
			//console.log('client id - '+ socket.id);
			console.log('socket connection established'.bold.green);
			socket.on('test-emit', function(data){
				console.log(data);
			});

			socket.on('user_joined', function(user_id){
				console.log(('('+user_id+') USER JOINED').bold.cyan)
				SOCKET_LIST[user_id] = socket;

  				//console.log(socket.handshake.headers.host)

				/*
					checking if user already connected or not
						1. if connected, checks if it is already present: if not present then pushed into []
						2. if not connected, generates a new entry for the user id and data is pushed into the array
				*/
				/*if(ALL_USERS[user_id]){
					var flag = ALL_USERS[user_id]["socket_ids"].includes(socket);
					if(flag)
						ALL_USERS[user_id]["socket_ids"].push(socket)
				}else{
					ALL_USERS[user_id] = {
						"socket_ids":[]
					}
					ALL_USERS[user_id]["socket_ids"].push(socket)
				}*/
			});

			socket.on('server_joined', function(server_id){
				console.log(('('+server_id+') SOCKET SERVER CONNECTED').bold.cyan)
				SOCKET_LIST[server_id] = socket;
			});

			socket.on('disconnect', function(){
				console.log('DISCONNECTED')
				module.exports.get_all_servers_connected(socket.id)
				//delete SOCKET_LIST[socket.id];
			});

			socket.on('user_disconnect', function(user_id){
				delete SOCKET_LIST[user_id];
			});

		});

		return io;
	},

	get_all_servers_connected: function(id){
		let all_servers = Object.keys(SOCKET_LIST)
		
		for(let i=0;i<all_servers.length;i++){
			let id_to_be_deleted = all_servers[i];

			if(SOCKET_LIST[id_to_be_deleted]['id'] == id){
				//console.log(id_to_be_deleted)
				delete SOCKET_LIST[id_to_be_deleted];
				break;
			}
		}
	},

	webhook : function(){
		var socket = require('socket.io-client')('http://localhost:3001');
		/*
		socket.on('connect',function(){
			console.log('webhook connected'.bold.green)
		});*/

		socket.emit('hello', 'world');

		/*socket.on('event', function(){
			console.log('EVENT'.bolg.blue)
		});

		socket.on('terminate',function(){
			console.log('Termination'.bold.red)
		})*/
	},

	getSOCKET_LIST : function(){
		return SOCKET_LIST;
	},

	get_all_users : function(){
		return ALL_USERS;
	},

	disconnect_user : function(user_id){
		delete SOCKET_LIST[user_id];;
	}
};