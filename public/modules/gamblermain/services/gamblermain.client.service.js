'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.service(ApplicationConfiguration.services.gamblermain, 
	['$resource', 	 
	 ApplicationConfiguration.services.authentication, 
	 ApplicationConfiguration.services.account,
	function($resource, Authentication, accountSrv) {
		var _this = this;

		_this.authentication 	= Authentication;
		_this.gambler 			= {};
		_this.gambler.account 	= {};

		_this.gamblerResource = $resource('gamblermain/:gamblerId', {
			gamblerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		_this.fnLoadUser = function (){
			_this.gamblerResource.get({
				gamblerId: _this.authentication.user._id
			},function(gambler){
				_this.gambler = gambler;

				accountSrv.get({
					userId: _this.gambler._id
				},function(account){
					_this.gambler.account = account;
				});
			});
		};
		
	}
]);