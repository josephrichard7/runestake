'use strict';

var enumAppSocket		= require('../utilities/enums/appsocketevent'),
	enumUserrole		= require('../utilities/enums/userrole'),
	AppSocketService	= require('../services/sockets/appsocket'),
	userController  	= require('../controllers/users'),
	passport			= require('passport');

module.exports = AppSocket;

/*jshint latedef: false */
function AppSocket(io, expressSession){
	// Create 'appSocket' namespace 
	var appSocketNsp 	= io.of('/app');

	appSocketNsp.appSocketService = new AppSocketService(appSocketNsp);
	
	// Bind middleware functions to namespace
	fnLoadMiddlewareFunctions(appSocketNsp, expressSession);
	
	// Bind Event handler when client connects
	appSocketNsp.on(enumAppSocket.natives.CONNECTION, function (socket){
		appSocketNsp.appSocketService.fnConnectUser(socket);
	});
}

/**
 * Bind middleware functions to namespace
 *
 */

function fnLoadMiddlewareFunctions(appSocketNsp, expressSession){
	// Extends express session to socket requests
	appSocketNsp.use(function(socket, next){
        expressSession(socket.request, {}, next);
    });

	// Use passport function to load user authenticated in the object request
	appSocketNsp.use(function(socket, next){
    	passport.initialize()(socket.request, socket.res, next);
    });
    appSocketNsp.use(function(socket, next){
    	passport.session()(socket.request, socket.res, next);
    });

	// User Authentication for client connections.
	appSocketNsp.use(function(socket, next){
		userController.hasAuthorization(
			[enumUserrole.TRADER, enumUserrole.BANK, enumUserrole.GAMBLER, enumUserrole.ADMIN]
		)(socket.request, socket.res, next);
	});
}