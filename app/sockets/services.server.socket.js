'use strict';

var enumServicesSocket		= require('../utilities/enums/servicessocketevent'),
	enumUserrole			= require('../utilities/enums/userrole'),
	servicesSocketService	= require('../services/servicessocket'),
	userController  		= require('../controllers/users'),
	passport				= require('passport'),
	servicesSocketNsp		= {};

module.exports = ServicesSocketNamespace;

/*jshint latedef: false */
function ServicesSocketNamespace(io, expressSession){
	// Create 'servicesSocket' namespace 
	servicesSocketNsp 	= io.of('/services');
	
	servicesSocketNsp.TRADER_ROOM 			= 'TRADER_ROOM';
	servicesSocketNsp.listServices			= {};
	servicesSocketNsp.numberServices		= 0;
	servicesSocketNsp.queueTraders 			= [];
	servicesSocketNsp.listConnectedTraders 	= {};
	servicesSocketNsp.listConnectedGamblers = {};
	
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

/**
 * Bind event handlers to namespace
 *
 */

function fnLoadEventHandlers(){
	// Bind Event handler when client connects
	servicesSocketNsp.on(enumServicesSocket.natives.CONNECTION, fnOnConnection);
}

/**
 * Called upon client connects.
 *
 * @param {Object} socket object
 */

function fnOnConnection(socket){
	// we store the username in the socket session for this client
	socket.userId 	= socket.request.user.id;
	socket.username = socket.request.user.username;
	socket.role 	= socket.request.user.role;

	servicesSocketService.fnConnectUser(socket, servicesSocketNsp);

	// Event handlers
	socket.on(enumServicesSocket.app.TRADERS_AVAILABLE,		servicesSocketService.fnTradersAvailable(socket, servicesSocketNsp));
	socket.on(enumServicesSocket.app.START_WORK, 			servicesSocketService.fnTraderStartWork(socket, servicesSocketNsp));
	socket.on(enumServicesSocket.app.STOP_WORKING, 			servicesSocketService.fnTraderStopWorking(socket, servicesSocketNsp));
	socket.on(enumServicesSocket.app.REQUEST_TRADER, 		servicesSocketService.fnRequestTrader(socket, servicesSocketNsp));
	socket.on(enumServicesSocket.app.NEW_MESSAGE_SERVICE, 	servicesSocketService.fnNewMessage(socket, servicesSocketNsp));
	socket.on(enumServicesSocket.app.SERVICE_FINISHED, 		servicesSocketService.fnServiceFinished(socket, servicesSocketNsp));
	socket.on(enumServicesSocket.natives.DISCONNECT, 		servicesSocketService.fnDisconnection(socket, servicesSocketNsp));
}