'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('FinishStakeGamblermainController', [
  '$stateParams',
  ApplicationConfiguration.services.gamblermain,
  ApplicationConfiguration.services.stakemain,
  function($stateParams, gamblermainSrv, stakemainSrv) {
    // Private variables
    var vm = this;    

    vm.fnInit               = fnInit;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv = gamblermainSrv;
      vm.stakemainSrv   = stakemainSrv;

      vm.stakemainSrv.fnReadStakeById($stateParams.id);
    }

  }
]);