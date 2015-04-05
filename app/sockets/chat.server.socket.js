'use strict';

var enumChatEvent 	= require('../utilities/enums/chatevent'),
	enumUserrole	= require('../utilities/enums/userrole'),
	chatService		= require('../services/chat'),
	userController  = require('../controllers/users'),
	passport		= require('passport'),
	chatSocketNsp	= {};

module.exports = ChatNamespace;

/*jshint latedef: false */
function ChatNamespace(io, expressSession){
	// Create 'chat' namespace 
	chatSocketNsp 	= io.of('/chat');
	
	// usernames which are currently connected to the chat
	chatSocketNsp.listConnectedUsers = {};
	chatSocketNsp.numConnectedUsers  = 0;
	
	// mirar como hacer para que los mensajes para por el middleware para que validar autenticacion, recargar la pagina cuando se 
	// desloguee.

	fnLoadMiddlewareFunctions(expressSession);
	fnLoadEventHandlers();
}

/**
 * Bind middleware functions to namespace
 *
 */

function fnLoadMiddlewareFunctions(expressSession){
	// Extends express session to socket requests
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

	// User Authentication for client connections.
	chatSocketNsp.use(function(socket, next){
		userController.hasAuthorization(
			[enumUserrole.TRADER, enumUserrole.GAMBLER]
		)(socket.request, socket.res, next);
	});
}

/**
 * Bind event handlers to namespace
 *
 */

function fnLoadEventHandlers(){
	// Bind Event handler when client connects
	chatSocketNsp.on(enumChatEvent.CONNECTION, fnOnConnection);
}


/**
 * Called upon client connects.
 *
 * @param {Object} socket object
 */

function fnOnConnection(socket){
	// we store the username in the socket session for this client
	socket.username = socket.request.user.username;
	socket.role 	= socket.request.user.role;

	// Connect new user
	chatService.fnNewUser(socket, chatSocketNsp);

	// Event handlers
	socket.on(enumChatEvent.NEW_MESSAGE, chatService.fnNewMessage(socket, chatSocketNsp));
	socket.on(enumChatEvent.DISCONNECT,  chatService.fnDisconnection(socket, chatSocketNsp));
}