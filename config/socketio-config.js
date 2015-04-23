'use strict';

var chatSocket		= require('../app/sockets/chat'),
	servicesSocket	= require('../app/sockets/services');

function ConfigSocket(io, expressSession){	
	//Init sockets
	chatSocket(io, expressSession);
	servicesSocket(io, expressSession);
}

module.exports = ConfigSocket;