'use strict';

var SocketService = {};

module.exports = SocketService;

/** 
 * Send event to all users connected, including me.
 *
 */
SocketService.fnEmitToAll = function(nsp, event, object){
	nsp.emit(event, object);
};

/** 
 * Send event to me
 *
 */
SocketService.fnEmitToMe = function(socket, event, object){
	socket.emit(event, object);	
};

/** 
 * Send event to all users connected, except me.
 *
 */
SocketService.fnEmitToOthers = function(socket, event, object){
	socket.broadcast.emit(event, object);	
};

/** 
 * Send event to all users connected in the room.
 *
 */
SocketService.fnEmitToRoom = function(nsp, roomName, event, object){
	nsp.to(roomName).emit(event, object);
};