'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('SrvStateCashierController', [
  '$stateParams',
  ApplicationConfiguration.services.gamblermain,
  function($stateParams, gamblermainSrv) {
    // Private variables
    var vm = this;

    vm.fnInit           = fnInit;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv = gamblermainSrv;

      gamblermainSrv.fnReadServiceById($stateParams.id);
    } 

  }
]);