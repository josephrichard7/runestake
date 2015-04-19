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
    function fnCancelService(){
      vm.gamblermainSrv.fnCancelService(function(err, service){
        if(err){
          vm.error = err;
        }else{
          $location.path('/gamblermain/panel/cashier/srvcanceled/' + service._id);
        }
      });
    }

    function fnInit(){
      vm.gamblermainSrv           = gamblermainSrv;

      vm.gamblermainSrv.fnReadServiceById($stateParams.id);
    }

  }
]);