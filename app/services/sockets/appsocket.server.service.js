'use strict';

var _ 						= require('lodash'),
	enumAppSocketEvent 		= require('../../utilities/enums/appsocketevent'),
	socketService 			= require('../../services/sockets/socket');

module.exports = AppSocketService;

/*jshint latedef: false */
function AppSocketService(nsp){
	this.nsp 					= nsp;
	this.listConnectedUsers 	= {};
	this.numConnectedUsers 		= 0;

	// Constants
	this.APP_ROOM = 'APP_ROOM';
}

/** 
 * Add user
 *
 */
AppSocketService.prototype.fnAddUser = function(socket){
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
AppSocketService.prototype.fnConnectUser = function(socket){
	// Store the username in the socket session for this user
	socket.username = socket.request.user.username;
	socket.role 	= socket.request.user.role;

	if(this.fnGetConnectedUser(socket.username)){
		socketService.fnEmitToMe(socket, enumAppSocketEvent.app.);
	}

	// Connect new user
	this.fnNewUser(socket);

	// Event handlers
	socket.on(enumAppSocketEvent.natives.DISCONNECT, this.fnDisconnection(socket));
};

/** 
 * Delete connected user
 *
 */
AppSocketService.prototype.fnDeleteConnectedUser = function(username){
	if(this.fnGetConnectedUser(username)){
		delete this.listConnectedUsers[username];
		--this.numConnectedUsers;
	}
};

/** 
 * Called upon client disconnects. Disconnect user from namespace.
 *
 */
AppSocketService.prototype.fnDisconnection = function(socket){
	return function(){
		if (this.fnGetConnectedUser(socket.username)) {
			this.fnDeleteConnectedUser(socket.username);

			// Inform to all users connected that user has left, including me
			socketService.fnEmitToAll(this.nsp, enumAppSocketEvent.app.USER_LEFT, {
				username: 			socket.username,
				numConnectedUsers: 	this.fnGetNumConnectedUsers(),
				listConnectedUsers: _.values(this.fnGetListConnectedUser())
			});
		}		
	};
};

/** 
 * Get connected user
 *
 */
AppSocketService.prototype.fnGetConnectedUser = function(username){
	return this.listConnectedUsers[username];
};

/** 
 * Get connected user
 *
 */
AppSocketService.prototype.fnGetListConnectedUser = function(){
	return this.listConnectedUsers;
};

/** 
 * Get number of connected user
 *
 */
AppSocketService.prototype.fnGetNumConnectedUsers = function(){
	return this.numConnectedUsers;
};

/** 
 * Called upon new client connects. Add new user to namespace.
 *
 */
AppSocketService.prototype.fnNewUser = function(socket){
	if(!this.fnGetConnectedUser(socket.username)){
		// Add user connected
		this.fnAddUser(socket);
	}
};