'use strict';

var enumServicesSocket			= require('../utilities/enums/servicessocketevent'),
	enumUserrole				= require('../utilities/enums/userrole'),
	BankServicesSocketService	= require('../services/bankservicessocket'),
	userController  			= require('../controllers/users'),
	passport					= require('passport');

module.exports = BankServicesSocket;

/*jshint latedef: false */
function BankServicesSocket(io, expressSession){
	// Create 'servicesSocket' namespace 
	var bankServicesSocketNsp 	= io.of('/bankServices');

	bankServicesSocketNsp.bankServicesSocketService = new BankServicesSocketService(bankServicesSocketNsp);
	
	// Bind middleware functions to namespace
	fnLoadMiddlewareFunctions(bankServicesSocketNsp, expressSession);
	
	// Bind Event handler when client connects
	bankServicesSocketNsp.on(enumServicesSocket.natives.CONNECTION, function (socket){
		bankServicesSocketNsp.bankServicesSocketService.fnConnectUser(socket);
	});
}

/**
 * Bind middleware functions to namespace
 *
 */

function fnLoadMiddlewareFunctions(bankServicesSocketNsp, expressSession){
	// Extends express session to socket requests
	bankServicesSocketNsp.use(function(socket, next){
        expressSession(socket.request, {}, next);
    });

	// Use passport function to load user authenticated in the object request
	bankServicesSocketNsp.use(function(socket, next){
    	passport.initialize()(socket.request, socket.res, next);
    });
    bankServicesSocketNsp.use(function(socket, next){
    	passport.session()(socket.request, socket.res, next);
    });

	// User Authentication for client connections.
	bankServicesSocketNsp.use(function(socket, next){
		userController.hasAuthorization(
			[enumUserrole.TRADER, enumUserrole.BANK]
		)(socket.request, socket.res, next);
	});
}