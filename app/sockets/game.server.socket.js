'use strict';

var enumGameSocket		= require('../utilities/enums/gammesocketevent'),
	enumUserrole		= require('../utilities/enums/userrole'),
	GameSocketService	= require('../services/gamesocket'),
	userController  	= require('../controllers/users'),
	passport			= require('passport');

module.exports = GameSocket;

/*jshint latedef: false */
function GameSocket(io, expressSession){
	// Create 'appSocket' namespace 
	var gameSocketNsp 	= io.of('/game');

	gameSocketNsp.gameSocketService = new GameSocketService(gameSocketNsp);
	
	// Bind middleware functions to namespace
	fnLoadMiddlewareFunctions(gameSocketNsp, expressSession);
	
	// Bind Event handler when client connects
	gameSocketNsp.on(enumGameSocket.natives.CONNECTION, function (socket){
		gameSocketNsp.gameSocketService.fnConnectUser(socket);
	});
}

/**
 * Bind middleware functions to namespace
 *
 */

function fnLoadMiddlewareFunctions(gameSocketNsp, expressSession){
	// Extends express session to socket requests
	gameSocketNsp.use(function(socket, next){
        expressSession(socket.request, {}, next);
    });

	// Use passport function to load user authenticated in the object request
	gameSocketNsp.use(function(socket, next){
    	passport.initialize()(socket.request, socket.res, next);
    });
    gameSocketNsp.use(function(socket, next){
    	passport.session()(socket.request, socket.res, next);
    });

	// User Authentication for client connections.
	gameSocketNsp.use(function(socket, next){
		userController.hasAuthorization(
			[enumUserrole.GAMBLER]
		)(socket.request, socket.res, next);
	});
}