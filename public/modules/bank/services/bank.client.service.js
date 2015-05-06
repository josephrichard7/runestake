'use strict';

angular.module(ApplicationConfiguration.modules.bank)
.service(ApplicationConfiguration.services.bank, [
	'$resource',
	ApplicationConfiguration.services.account,
	function($resource, accountSrv) {
		var _this = this;

		var BankResource = $resource('bank', false, {
			update: {
				method: 'PUT'
			}
		});

		var LoadChipsBankResource = $resource('bank/loadchips');

		_this.fnLoadChips = function(chipsAmount){
			var resource = new LoadChipsBankResource();

			resource.chipsAmount = chipsAmount;
			return resource.$save();
		};

		_this.fnRead = function(){
			return BankResource.get().$promise
			.then(function(bank){
				return accountSrv.fnReadAccountByUserId(bank._id)
				.then(function(account){
					bank.account = account;
					return bank;
				});
			});
		};

		_this.fnUpdate = function(bankVO) {
			var bank = new BankResource(bankVO);
			return bank.$update();
		};
	}
]);