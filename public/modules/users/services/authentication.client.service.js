'use strict';

// Authentication service for user variables
angular.module(ApplicationConfiguration.modules.user)
.factory(ApplicationConfiguration.services.authentication, [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);