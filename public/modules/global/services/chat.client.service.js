'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.service(ApplicationConfiguration.services.chat, 
	[ApplicationConfiguration.factories.chat,
	function(ChatFactory) {
		this.instance = new ChatFactory(ApplicationConfiguration.chats.chat);
	}
]);