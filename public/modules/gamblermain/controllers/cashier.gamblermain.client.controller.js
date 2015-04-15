'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('CashierController', ['$scope',
  function($scope) {
    // Private variables
    var vm = this;    
    
    vm.enumServiceType = {
      CASHIN:   'CASHIN',
      CASHOUT:  'CASHOUT'
    };
    vm.enumCurrency = {
      RS07:     'RS07',
      RSGP:     'RSGP',
      RSCHIP:   'RSCHIP'
    };

    // Initialize
    vm.service                  = {};
    vm.serviceType              = vm.enumServiceType.CASHIN;
    vm.serviceCurrency          = vm.enumCurrency.RS07;
    vm.sourceCurrency           = vm.enumCurrency.RS07;
    vm.destinationCurrency      = vm.enumCurrency.RSCHIP;
    vm.amount                   = 0;
    vm.amountConverted          = 0;
    vm.exchangeRate             = {};
    vm.exchangeRateList         = {};
    vm.fnCreateService          = fnCreateService;
    vm.fnConvertAmountByRate    = fnConvertAmountByRate;

    vm.exchangeRateList[vm.enumCurrency.RS07]                         = {};
    vm.exchangeRateList[vm.enumCurrency.RS07][vm.enumCurrency.RSCHIP] = 8.5;
    vm.exchangeRateList[vm.enumCurrency.RSGP]                         = {};
    vm.exchangeRateList[vm.enumCurrency.RSGP][vm.enumCurrency.RSCHIP] = 1;
    vm.exchangeRateList[vm.enumCurrency.RSCHIP]                       = {};
    vm.exchangeRateList[vm.enumCurrency.RSCHIP][vm.enumCurrency.RS07] = 0.12;
    vm.exchangeRateList[vm.enumCurrency.RSCHIP][vm.enumCurrency.RSGP] = 1;

    // fnUpdateLabels();

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

    function fnReadExchangeRate(callback){
      // vm.exchangeRate = ExchangeRateService.get({
      //   sourceCurrency:       vm.sourceCurrency,
      //   destinationCurrency:  vm.destinationCurrency
      // },function(exchangeRate){
      //   vm.service.rate = exchangeRate.rate;
      // });
      vm.service.rate = vm.exchangeRateList[vm.sourceCurrency][vm.destinationCurrency];
      if(callback){
        callback(vm.service.rate);
      }
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

    function fnConvertAmountByRate(callback){
      fnUpdateLabels();
      fnReadExchangeRate(function(rate){
        vm.amountConverted = vm.amount * rate;
        if(callback){
          callback(vm.amountConverted);
        }
      });
    }

    function fnCreateService(){
      // var service             = new Service();
      var amountConvertedOld  = vm.amountConverted;
      
      fnConvertAmountByRate(function(amountConverted){
        if(amountConvertedOld !== amountConverted){
          vm.error = 'Amount converted has changed because rate has changed as well. Please review your request.';
        }
        else{
          service.type                = vm.serviceType;
          service.sourceCurrency      = vm.sourceCurrency;
          service.destinationCurrency = vm.destinationCurrency;
          service.amount              = vm.amount;
          service.$save(function(response) {

          }, function(errorResponse) {
            vm.error = errorResponse.data.message;
          });
        }
      });
    }

  }
]);