'use strict';

var _ 				= require('lodash'),
	enumChatEvent 	= require('../../utilities/enums/chatevent'),
	socketService 	= require('../../services/sockets/socket');

module.exports = ChatSocketService;

/*jshint latedef: false */
function ChatSocketService(nsp){
	this.nsp 				= nsp;
	this.listConnectedUsers = {};
	this.numConnectedUsers  = 0;
}

/** 
 * Add user
 *
 */
ChatSocketService.prototype.fnAddUser = function(socket){
	if(!this.fnGetConnectedUser(socket.username)){
		this.listConnectedUsers[socket.username] = {
			username: 	socket.username,
			role: 		socket.role
		};
		++this.numConnectedUsers;
	}
};

/** 
 * Connects a new gambler or trader.
 *
 */
ChatSocketService.prototype.fnConnectUser = function(socket){
	// Store the username in the socket session for this user
	socket.username = socket.request.user.username;
	socket.role 	= socket.request.user.role;

	// Connect new user
	this.fnNewUser(socket);

	// Event handlers
	socket.on(enumChatEvent.app.NEW_MESSAGE, 	this.fnNewMessage(socket));
	socket.on(enumChatEvent.natives.DISCONNECT, this.fnDisconnection(socket));
};

/** 
 * Delete connected user
 *
 */
ChatSocketService.prototype.fnDeleteConnectedUser = function(username){
	if(this.fnGetConnectedUser(username)){
		delete this.listConnectedUsers[username];
		--this.numConnectedUsers;
	}
};

/** 
 * Called upon client disconnects. Disconnect user from namespace.
 *
 */
ChatSocketService.prototype.fnDisconnection = function(socket){
	var self = this;
	return function(){
		if (self.fnGetConnectedUser(socket.username)) {
			self.fnDeleteConnectedUser(socket.username);

			// Inform to all users connected that user has left, including me
			socketService.fnEmitToAll(self.nsp, enumChatEvent.app.USER_LEFT, {
				username: 			socket.username,
				numConnectedUsers: 	self.fnGetNumConnectedUsers(),
				listConnectedUsers: _.values(self.fnGetListConnectedUser())
			});
		}		
	};
};

/** 
 * Get connected user
 *
 */
ChatSocketService.prototype.fnGetConnectedUser = function(username){
	return this.listConnectedUsers[username];
};

/** 
 * Get connected user
 *
 */
ChatSocketService.prototype.fnGetListConnectedUser = function(){
	return this.listConnectedUsers;
};

/** 
 * Get number of connected user
 *
 */
ChatSocketService.prototype.fnGetNumConnectedUsers = function(){
	return this.numConnectedUsers;
};

/** 
 * Send chat message to all users connected.
 *
 * @param {String} message
 */
ChatSocketService.prototype.fnNewMessage = function(socket){
	return function (message){
		socketService.fnEmitToAll(this.nsp, enumChatEvent.app.NEW_MESSAGE, {
			username: socket.username,
			message:  message
		});
	};
};

/** 
 * Called upon new client connects. Add new user to namespace.
 *
 */
ChatSocketService.prototype.fnNewUser = function(socket){
	if(!this.fnGetConnectedUser(socket.username)){
		// Add user connected
		this.fnAddUser(socket);

		// Send user joined to others connected
		socketService.fnEmitToOthers(socket, enumChatEvent.app.USER_JOINED, {
			username: 			socket.username,
			numConnectedUsers: 	this.fnGetNumConnectedUsers(),
			listConnectedUsers: _.values(this.fnGetListConnectedUser())
		});
	}
	socketService.fnEmitToMe(socket, enumChatEvent.app.LOGIN, {
		username: 			socket.username,
		numConnectedUsers: 	this.fnGetNumConnectedUsers(),
		listConnectedUsers: _.values(this.fnGetListConnectedUser())
	});
};