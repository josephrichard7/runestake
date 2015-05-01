'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('SrvStateCashierController',
  ['$scope',
  '$stateParams',
  '$location',
  ApplicationConfiguration.services.gamblermain,
  function($scope, $stateParams, $location, gamblermainSrv) {
    // Private variables
    var vm = this;

    vm.fnInit           = fnInit;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv = gamblermainSrv;
      
      gamblermainSrv.error  = undefined;
      gamblermainSrv.info   = undefined;

      gamblermainSrv.fnReadServiceById($stateParams.id);
    } 

  }
]);