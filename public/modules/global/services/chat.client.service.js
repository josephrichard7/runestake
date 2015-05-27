'use strict';

angular.module(ApplicationConfiguration.modules.global)
.service(ApplicationConfiguration.services.chat, [
	ApplicationConfiguration.factories.chat,
	function(ChatFactory) {
		var _this = this;
		_this.__proto__ = Object.create(new ChatFactory(ApplicationConfiguration.sockets.chat));	
	}
]);