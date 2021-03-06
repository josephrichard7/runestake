'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('CashierController', [
  ApplicationConfiguration.services.gamblermain,
  function(gamblermainSrv) {
    // Private variables
    var vm = this;    

    vm.fnInit = fnInit;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv       = gamblermainSrv;
      vm.currentPage          = 1;
      vm.pageSize             = 10;
      gamblermainSrv.fnInitServicesSocket();
      gamblermainSrv.fnLoadListServices();
    }

  }
]);