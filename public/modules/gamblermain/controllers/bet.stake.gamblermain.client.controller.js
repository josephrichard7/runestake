'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('BetStakeGamblermainController', [
  ApplicationConfiguration.services.gamblermain,
  ApplicationConfiguration.services.stake,
  function(gamblermainSrv, stakeSrv) {
    // Private variables
    var vm = this;    

    vm.fnInit = fnInit;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv = gamblermainSrv;
      vm.stakeSrv       = stakeSrv;    
    }

  }
]);