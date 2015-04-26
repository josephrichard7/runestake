'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('AssigningSrvCashierController',
  ['$scope',
  '$stateParams',
  '$location',
  ApplicationConfiguration.services.gamblermain,
  function($scope, $stateParams, $location, gamblermainSrv) {
    // Private variables
    var vm = this;

    vm.fnInit           = fnInit;
    vm.fnCancelService  = fnCancelService;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv = gamblermainSrv;
      
      gamblermainSrv.error = undefined;

      gamblermainSrv.fnReadServiceById($stateParams.id)
      .then(function(){
        gamblermainSrv.fnRequestTrader();
      });
    }

    function fnCancelService(){
      gamblermainSrv.fnCancelService(gamblermainSrv.service._id)
      .then(function(service){
        gamblermainSrv.fnLoadListServices();
        $location.path('/gamblermain/panel/cashier/createsrv');
      });
    } 

  }
]);