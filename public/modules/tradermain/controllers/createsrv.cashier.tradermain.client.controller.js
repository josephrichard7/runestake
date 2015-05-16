'use strict';

angular.module(ApplicationConfiguration.modules.tradermain)
.controller('CreateSrvCashierTradermainController', [
  ApplicationConfiguration.services.cashiertradermain,
  ApplicationConfiguration.services.exchangerate,
  function(cashierTradermainSrv, exchangeRateSrv) {
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
      vm.cashierTradermainSrv     = cashierTradermainSrv;
      vm.serviceCurrency          = vm.enumCurrency.RS07;
      vm.sourceCurrency           = vm.enumCurrency.RS07;
      vm.destinationCurrency      = vm.enumCurrency.RSCHIP;
      vm.amount                   = 0;
      vm.amountConverted          = 0;

      cashierTradermainSrv.fnResetService();

      fnUpdateLabels();
      cashierTradermainSrv.fnBanksAvailable();
    }

    function fnConvertAmountByRate(callback){
      fnUpdateLabels();

      exchangeRateSrv.fnReadForSellerBank(vm.sourceCurrency, vm.destinationCurrency)
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
        cashierTradermainSrv.fnResetService();

        cashierTradermainSrv.service.type                = vm.serviceType;
        cashierTradermainSrv.service.sourceCurrency      = vm.sourceCurrency;
        cashierTradermainSrv.service.destinationCurrency = vm.destinationCurrency;
        cashierTradermainSrv.service.amount              = vm.amount;
        cashierTradermainSrv.service.rate                = vm.serviceRate;

        cashierTradermainSrv.fnCreateService();
      });
    }

    function fnUpdateLabels(){
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
    }

  }
]);