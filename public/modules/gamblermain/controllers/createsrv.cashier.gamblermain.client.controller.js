'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('CreateSrvCashierController', 
  ['$scope',
  '$location',
  ApplicationConfiguration.services.gamblermain,
  function($scope, $location, gamblermainSrv) {
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

    /*jshint latedef: false */
    // function fnReadAllExchangeRate(sourceCurrency, destinationCurrency){
    //   var size          = 0;
    //   var exchangeRate  = {};

    //   vm.exchangeRateTable  = ExchangeRateService.Query();
    //   size                  = vm.exchangeRateList.length;
    //   for(var i = 0; i < size; i++){
    //     exchangeRate = vm.exchangeRateList[i];
    //     vm.exchangeRateList[exchangeRate.sourceCurrency][exchangeRate.destinationCurrency] = exchangeRate.rate;
    //   }
    // }

    function fnInit(){
      vm.gamblermainSrv           = gamblermainSrv;
      vm.serviceType              = vm.enumServiceType.CASHIN;
      vm.serviceCurrency          = vm.enumCurrency.RS07;
      vm.sourceCurrency           = vm.enumCurrency.RS07;
      vm.destinationCurrency      = vm.enumCurrency.RSCHIP;
      vm.amount                   = 0;
      vm.amountConverted          = 0;
      vm.exchangeRate             = {};
      vm.exchangeRateList         = {};

      vm.exchangeRateList[vm.enumCurrency.RS07]                         = {};
      vm.exchangeRateList[vm.enumCurrency.RS07][vm.enumCurrency.RSCHIP] = 8.5;
      vm.exchangeRateList[vm.enumCurrency.RSGP]                         = {};
      vm.exchangeRateList[vm.enumCurrency.RSGP][vm.enumCurrency.RSCHIP] = 1;
      vm.exchangeRateList[vm.enumCurrency.RSCHIP]                       = {};
      vm.exchangeRateList[vm.enumCurrency.RSCHIP][vm.enumCurrency.RS07] = 0.12;
      vm.exchangeRateList[vm.enumCurrency.RSCHIP][vm.enumCurrency.RSGP] = 1;

      gamblermainSrv.error  = undefined;
      gamblermainSrv.info   = undefined;
      gamblermainSrv.fnResetService();

      fnUpdateLabels();
      gamblermainSrv.fnTradersAvailable();
    }

    function fnConvertAmountByRate(callback){
      fnUpdateLabels();

      // vm.exchangeRate = ExchangeRateService.get({
      //   sourceCurrency:       vm.sourceCurrency,
      //   destinationCurrency:  vm.destinationCurrency
      // },function(exchangeRate){
      //   vm.serviceRate = exchangeRate.rate;
      // });
      vm.serviceRate      = vm.exchangeRateList[vm.sourceCurrency][vm.destinationCurrency];
      vm.amountConverted  = vm.amount * vm.serviceRate;
      if(callback){
        callback();
      }
    }

    function fnCreateService(){
      var amountConvertedOld  = vm.amountConverted;

      if(!vm.amount || vm.amount === ''){
        vm.gamblermainSrv.error = 'Amount must be specified.';
        return;
      }
      
      fnConvertAmountByRate(function(){
        if(amountConvertedOld !== vm.amountConverted){
          vm.gamblermainSrv.error = 'Amount converted has changed because rate has changed as well. Please review your request.';
          return;
        }

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