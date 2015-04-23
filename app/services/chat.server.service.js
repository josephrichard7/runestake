'use strict';

var _ = require('lodash'),
enumChatEvent 	= require('../utilities/enums/chatevent');

module.exports = new ChatService();

/*jshint latedef: false */
function ChatService(){
}

/** 
 * Send chat message to all users connected.
 *
 * @param {String} message
 */
ChatService.prototype.fnNewMessage = function(socket, chatSocketNsp){
	return function (message){
		chatSocketNsp.emit(enumChatEvent.app.NEW_MESSAGE, {
			username: socket.username,
			message:  message
		});	
	};
};

/** 
 * Called upon new client connects. Add new user to namespace.
 *
 */
ChatService.prototype.fnNewUser = function(socket, chatSocketNsp){
	if(!chatSocketNsp.listConnectedUsers[socket.username]){
		// add the client's username to the global list
		chatSocketNsp.listConnectedUsers[socket.username] = {
			username: 	socket.username,
			role: 		socket.role
		};

		++chatSocketNsp.numConnectedUsers;

		// Send user joined to others connected
		socket.broadcast.emit(enumChatEvent.app.USER_JOINED, {
			username: 			socket.username,
			numConnectedUsers: 	chatSocketNsp.numConnectedUsers,
			listConnectedUsers: _.values(chatSocketNsp.listConnectedUsers)
		});
	}
	socket.emit(enumChatEvent.app.LOGIN, {
		username: 			socket.username,
		numConnectedUsers: 	chatSocketNsp.numConnectedUsers,
		listConnectedUsers: _.values(chatSocketNsp.listConnectedUsers)
	});
};

/** 
 * Called upon client disconnects. Disconnect user from namespace.
 *
 */
ChatService.prototype.fnDisconnection = function(socket, chatSocketNsp){
	return function(){
		if (chatSocketNsp.listConnectedUsers[socket.username]) {
			delete chatSocketNsp.listConnectedUsers[socket.username];
			--chatSocketNsp.numConnectedUsers;

			// echo globally that this client has left, including me
			chatSocketNsp.emit(enumChatEvent.app.USER_LEFT, {
				username: 			socket.username,
				numConnectedUsers: 	chatSocketNsp.numConnectedUsers,
				listConnectedUsers: _.values(chatSocketNsp.listConnectedUsers)
			});
		}		
	};
};