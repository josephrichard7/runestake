'use strict';

var enumServicesSocket		= require('../utilities/enums/servicessocketevent'),
	enumUserrole			= require('../utilities/enums/userrole'),
	ServicesSocketService	= require('../services/servicessocket'),
	userController  		= require('../controllers/users'),
	passport				= require('passport');

module.exports = ServicesSocket;

/*jshint latedef: false */
function ServicesSocket(io, expressSession){
	// Create 'servicesSocket' namespace 
	var servicesSocketNsp 	= io.of('/services');

	servicesSocketNsp.servicesSocketService = new ServicesSocketService(servicesSocketNsp);
	
	// Bind middleware functions to namespace
	fnLoadMiddlewareFunctions(servicesSocketNsp, expressSession);
	
	// Bind Event handler when client connects
	servicesSocketNsp.on(enumServicesSocket.natives.CONNECTION, function (socket){
		servicesSocketNsp.servicesSocketService.fnConnectUser(socket);
	});
}

/**
 * Bind middleware functions to namespace
 *
 */

function fnLoadMiddlewareFunctions(servicesSocketNsp, expressSession){
	// Extends express session to socket requests
	servicesSocketNsp.use(function(socket, next){
        expressSession(socket.request, {}, next);
    });

	// Use passport function to load user authenticated in the object request
	servicesSocketNsp.use(function(socket, next){
    	passport.initialize()(socket.request, socket.res, next);
    });
    servicesSocketNsp.use(function(socket, next){
    	passport.session()(socket.request, socket.res, next);
    });

	// User Authentication for client connections.
	servicesSocketNsp.use(function(socket, next){
		userController.hasAuthorization(
			[enumUserrole.TRADER, enumUserrole.GAMBLER]
		)(socket.request, socket.res, next);
	});
}