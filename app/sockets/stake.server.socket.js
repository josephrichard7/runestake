'use strict';

var enumStakeSocket		= require('../utilities/enums/stakesocketevent'),
	enumUserrole		= require('../utilities/enums/userrole'),
	StakeSocketService	= require('../services/sockets/stakesocket'),
	userController  	= require('../controllers/users'),
	passport			= require('passport');

module.exports = StakeSocket;

/*jshint latedef: false */
function StakeSocket(io, expressSession){
	// Create 'stakeSocket' namespace 
	var stakeSocketNsp 	= io.of('/stake');

	stakeSocketNsp.stakeSocketService = new StakeSocketService(stakeSocketNsp);
	
	// Bind middleware functions to namespace
	fnLoadMiddlewareFunctions(stakeSocketNsp, expressSession);
	
	// Bind Event handler when client connects
	stakeSocketNsp.on(enumStakeSocket.natives.CONNECTION, function (socket){
		stakeSocketNsp.stakeSocketService.fnOnConnectGambler(socket);
	});
}

/**
 * Bind middleware functions to namespace
 *
 */

function fnLoadMiddlewareFunctions(stakeSocketNsp, expressSession){
	// Extends express session to socket requests
	stakeSocketNsp.use(function(socket, next){
        expressSession(socket.request, {}, next);
    });

	// Use passport function to load user authenticated in the object request
	stakeSocketNsp.use(function(socket, next){
    	passport.initialize()(socket.request, socket.res, next);
    });
    stakeSocketNsp.use(function(socket, next){
    	passport.session()(socket.request, socket.res, next);
    });

	// User Authentication for client connections.
	stakeSocketNsp.use(function(socket, next){
		userController.hasAuthorization(
			[enumUserrole.GAMBLER]
		)(socket.request, socket.res, next);
	});
}