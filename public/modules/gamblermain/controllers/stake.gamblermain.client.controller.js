'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('StakeGamblermainController', [
  ApplicationConfiguration.services.gamblermain,
  function(gamblermainSrv) {
    // Private variables
    var vm = this;    

    vm.fnInit = fnInit;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv       = gamblermainSrv;
    }

  }
]);