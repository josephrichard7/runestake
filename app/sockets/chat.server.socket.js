'use strict';

var enumChatEvent 		= require('../utilities/enums/chatevent'),
	enumUserrole		= require('../utilities/enums/userrole'),
	userController  	= require('../controllers/users'),
	ChatSocketService	= require('../services/sockets/chatsocket'),
	passport			= require('passport'),
	chatSocketNsp		= {};

module.exports = ChatNamespace;

/*jshint latedef: false */
function ChatNamespace(io, expressSession){
	// Create 'chat' namespace 
	chatSocketNsp = io.of('/chat');

	chatSocketNsp.chatSocketService = new ChatSocketService(chatSocketNsp);

	// Bind middleware functions to namespace
	fnLoadMiddlewareFunctions(expressSession);
	
	// Bind Event handler when client connects
	chatSocketNsp.on(enumChatEvent.natives.CONNECTION, function (socket){
		chatSocketNsp.chatSocketService.fnConnectUser(socket);
	});
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