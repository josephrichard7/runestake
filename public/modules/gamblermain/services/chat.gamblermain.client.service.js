'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.service('GamblerChatService', ['ChatFactory',
	function(ChatFactory) {
		this.instance = new ChatFactory(ApplicationConfiguration.chats.gamblermain);
	}
]);