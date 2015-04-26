'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('SrvAssignedCashierController',
  ['$scope',
  '$stateParams',
  '$location',
  ApplicationConfiguration.services.gamblermain,
  function($scope, $stateParams, $location, gamblermainSrv) {
    // Private variables
    var vm = this;

    vm.fnInit           = fnInit;
    vm.fnDesistService  = fnDesistService;
    vm.fnSendMessage    = fnSendMessage;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv = gamblermainSrv;
      
      gamblermainSrv.error     = undefined;
      gamblermainSrv.fnReadServiceById($stateParams.id);
    }

    function fnDesistService(){
      gamblermainSrv.fnDesistService(gamblermainSrv.service._id)
      .then(function(service){
        gamblermainSrv.fnLoadListServices();
        $location.path('/gamblermain/panel/cashier/createsrv');
      });
    }
     
    function fnSendMessage() {
      gamblermainSrv.fnSendMessage(vm.message, function(){
        vm.message = '';
      });
    }

  }
]);