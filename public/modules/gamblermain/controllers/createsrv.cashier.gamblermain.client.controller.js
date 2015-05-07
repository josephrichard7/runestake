'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('CreateSrvCashierController', 
  ['$scope',
  '$location',
  ApplicationConfiguration.services.gamblermain,
  ApplicationConfiguration.services.exchangerate,
  function($scope, $location, gamblermainSrv, exchangeRateSrv) {
    // Private variables
    var vm      = this;
    
    vm.enumServiceType = {
      CASHIN:   'CASHIN',
      CASHOUT:  'CASHOUT'
    };
    vm.enumCurrency = {
      RS07:     'RS07',
      RSGP:     'RSGP',
      RSCHIP:   'RSCHIP'
    };

    vm.fnInit                 = fnInit;
    vm.fnCreateService        = fnCreateService;
    vm.fnConvertAmountByRate  = fnConvertAmountByRate;

    /*jslint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv           = gamblermainSrv;
      vm.serviceType              = vm.enumServiceType.CASHIN;
      vm.serviceCurrency          = vm.enumCurrency.RS07;
      vm.sourceCurrency           = vm.enumCurrency.RS07;
      vm.destinationCurrency      = vm.enumCurrency.RSCHIP;
      vm.amount                   = 0;
      vm.amountConverted          = 0;

      gamblermainSrv.fnResetService();

      fnUpdateLabels();
      gamblermainSrv.fnTradersAvailable();
    }

    function fnConvertAmountByRate(callback){
      fnUpdateLabels();

      exchangeRateSrv.fnReadForSellerTrader(vm.sourceCurrency, vm.destinationCurrency)
      .then(function(exchangeRate){
        vm.serviceRate      = exchangeRate.rate;
        vm.amountConverted  = vm.amount * vm.serviceRate;
        if(callback){
          callback();
        }
      });
    }

    function fnCreateService(){      
      fnConvertAmountByRate(function(){
        gamblermainSrv.fnResetService();

        gamblermainSrv.service.type                = vm.serviceType;
        gamblermainSrv.service.sourceCurrency      = vm.sourceCurrency;
        gamblermainSrv.service.destinationCurrency = vm.destinationCurrency;
        gamblermainSrv.service.amount              = vm.amount;
        gamblermainSrv.service.rate                = vm.serviceRate;

        gamblermainSrv.fnCreateService();
      });
    }

    function fnUpdateLabels(){
      if(vm.serviceType === vm.enumServiceType.CASHIN){
        if(vm.serviceCurrency === vm.enumCurrency.RS07){
          vm.sourceCurrency           = vm.enumCurrency.RS07;
          vm.destinationCurrency      = vm.enumCurrency.RSCHIP;
        }else if(vm.serviceCurrency === vm.enumCurrency.RSGP){
          vm.sourceCurrency           = vm.enumCurrency.RSGP;
          vm.destinationCurrency      = vm.enumCurrency.RSCHIP;
        }else{
          vm.serviceCurrency          = vm.enumCurrency.RS07;
          vm.sourceCurrency           = vm.enumCurrency.RS07;
          vm.destinationCurrency      = vm.enumCurrency.RSCHIP;
        }
      }else if(vm.serviceType === vm.enumServiceType.CASHOUT){
        if(vm.serviceCurrency === vm.enumCurrency.RS07){
          vm.sourceCurrency           = vm.enumCurrency.RSCHIP;
          vm.destinationCurrency      = vm.enumCurrency.RS07;
        }else if(vm.serviceCurrency === vm.enumCurrency.RSGP){
          vm.sourceCurrency           = vm.enumCurrency.RSCHIP;
          vm.destinationCurrency      = vm.enumCurrency.RSGP;
        }else{
          vm.serviceCurrency          = vm.enumCurrency.RS07;
          vm.sourceCurrency           = vm.enumCurrency.RSCHIP;
          vm.destinationCurrency      = vm.enumCurrency.RS07;
        }
      }else{
        vm.serviceType              = vm.enumServiceType.CASHIN;
        vm.serviceCurrency          = vm.enumCurrency.RS07;
        vm.sourceCurrency           = vm.enumCurrency.RS07;
        vm.destinationCurrency      = vm.enumCurrency.RSCHIP;
      }
    }

  }
]);