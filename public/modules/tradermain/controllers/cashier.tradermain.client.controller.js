'use strict';

angular.module(ApplicationConfiguration.modules.tradermain)
.controller('CashierTradermainController', [
  ApplicationConfiguration.services.cashiertradermain,
  function(cashierTradermainSrv) {
    // Private variables
    var vm = this;    

    vm.fnInit = fnInit;

    /*jshint latedef: false*/
    function fnInit(){
      vm.cashierTradermainSrv = cashierTradermainSrv;
      vm.currentPage          = 1;
      vm.pageSize             = 10;
      cashierTradermainSrv.fnInitServicesSocket();
      cashierTradermainSrv.fnLoadListServices();
    }

  }
]);