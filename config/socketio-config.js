'use strict';

var chatSocket			= require('../app/sockets/chat'),
	servicesSocket		= require('../app/sockets/services'),
	bankServicesSocket	= require('../app/sockets/bankservices');
	// appSocket			= require('../app/sockets/app');

function ConfigSocket(io, expressSession){	
	//Init sockets
	chatSocket(io, expressSession);
	servicesSocket(io, expressSession);
	bankServicesSocket(io, expressSession);
	// appSocket(io, expressSession);
}

module.exports = ConfigSocket;