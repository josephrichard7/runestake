'use strict';

angular.module(ApplicationConfiguration.modules.tradermain)
.controller('SrvStateCashierTradermainController', [
  '$stateParams',
  ApplicationConfiguration.services.cashiertradermain,
  function($stateParams, cashierTradermainSrv) {
    // Private variables
    var vm = this;

    vm.fnInit           = fnInit;

    /*jshint latedef: false*/
    function fnInit(){
      vm.cashierTradermainSrv = cashierTradermainSrv;

      cashierTradermainSrv.fnReadServiceById($stateParams.id);
    } 

  }
]);