'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('PlayStakeGamblermainController', [
  '$scope',
  '$stateParams',
  ApplicationConfiguration.services.gamblermain,
  ApplicationConfiguration.services.stakemain,
  function($scope, $stateParams, gamblermainSrv, stakemainSrv) {
    // Private variables
    var vm = this;    

    vm.fnInit               = fnInit;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv = gamblermainSrv;
      vm.stakemainSrv   = stakemainSrv;

      stakemainSrv.fnStartStake($stateParams.id);
    }

    $scope.$on('$stateChangeStart', function(){
      stakemainSrv.fnDestroyStake();
    });
  }
]);