'use strict';

var enumChatEvent 	= require('../utilities/enums/chatevent'),
	enumUserrole	= require('../utilities/enums/userrole'),
	// chatService		= require('../services/chat'),
	userController  = require('../controllers/users'),
	passport		= require('passport');

module.exports = fnChatSocket;

/*jshint latedef: false */
function fnChatSocket(io, sharedSession, expressSession){
	// Set a new namespace for chat socket
	var chatSocketNsp = io.of('/chat');
	// usernames which are currently connected to the chat
	chatSocketNsp.usernames	= {};
	chatSocketNsp.numUsers 	= 0;
	
	// Share express session with socket
	// chatSocketNsp.use(sharedSession);

	chatSocketNsp.use(function(socket, next){
        expressSession(socket.request, {}, next);
    });

	// Use passport function to load user authenticated in the object request
	chatSocketNsp.use(function(socket, next){
    	passport.initialize()(socket.request, socket.res, next);
    });
    chatSocketNsp.use(function(socket, next){
    	passport.session()(socket.request, socket.res, next);
    });

	// Middleware validations
	chatSocketNsp.use(fnAuthorization);

	// Event handler for init connection
	chatSocketNsp.on('connection', fnConnection);

	// Middleware functions
	/*jshint latedef: false */
	function fnAuthorization(socket, next){
		var req = socket.request;
		var res = socket.res;

		userController.hasAuthorization(
			[enumUserrole.TRADER, enumUserrole.GAMBLER]
		)(req,res,next);
	}

	// Functions for attending events
	/*jshint latedef: false */
	function fnConnection(socket){
		var req 		= socket.request;

		// console.log('conecto ' + req.user.username); 

		// Event handlers
		socket.on(enumChatEvent.NEW_MESSAGE, 	fnNewMessage);
		socket.on(enumChatEvent.ADD_USER,	 	fnAddUser);	
		socket.on(enumChatEvent.DISCONNECTION, 	fnDisconnection);

		// when the client emits 'new message', this listens and executes
		function fnNewMessage(data){
			// chatService.fnNewMessage(socket, message);

			// we tell the client to execute 'new message'
			socket.broadcast.emit(enumChatEvent.NEW_MESSAGE, {
				username: socket.username,
				message: data
			});
		}

		// when the client emits 'add user', this listens and executes
		function fnAddUser(){
			// chatService.fnAddUser(socket);

			var username = req.user.username;

			// we store the username in the socket session for this client
			socket.username 	= username;

			if(!chatSocketNsp.usernames[username]){
				// add the client's username to the global list
				chatSocketNsp.usernames[username] = username;

				++chatSocketNsp.numUsers;

				// echo globally (all clients) that a person has connected
				socket.broadcast.emit(enumChatEvent.USER_JOINED, {
					username: username,
					numUsers: chatSocketNsp.numUsers
				});
			}
			socket.emit(enumChatEvent.LOGIN, {
				numUsers: chatSocketNsp.numUsers
			});
		}

	  // when the client emits 'typing', we broadcast it to others
	  // socket.on('typing', function () {
	  //   socket.broadcast.emit('typing', {
	  //     username: socket.username
	  //   });
	  // });

	  // when the client emits 'stop typing', we broadcast it to others
	  // socket.on('stop typing', function () {
	  //   socket.broadcast.emit('stop typing', {
	  //     username: socket.username
	  //   });
	  // });

		// when the user disconnects.. perform this
		function fnDisconnection(){
			// chatService.fnDisconnection(socket, message);

			// remove the username from global usernames list
			if (chatSocketNsp.usernames[socket.username]) {
				delete chatSocketNsp.usernames[socket.username];
				--chatSocketNsp.numUsers;

				socket.emit('disconnect_client', {
					username: socket.username
				});

				// echo globally that this client has left
				socket.broadcast.emit(enumChatEvent.USER_LEFT, {
					username: socket.username,
					numUsers: chatSocketNsp.numUsers
				});

				chatSocketNsp.sockets = removeByAttr(chatSocketNsp.sockets, 'username', socket.username);
			}
		}

		function removeByAttr(arr, attr, value){
		    var i = arr.length;
		    while(i--){
		       if( arr[i] 
		           && arr[i].hasOwnProperty(attr) 
		           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

		           arr.splice(i,1);

		       }
		    }
		    return arr;
		}

	}

}