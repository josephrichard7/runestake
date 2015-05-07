'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('SrvCreatedCashierController',
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
      
      gamblermainSrv.fnReadServiceById($stateParams.id);
    }

    function fnDesistService(){
      gamblermainSrv.fnDesistService();
    }
     
    function fnSendMessage() {
      gamblermainSrv.fnSendMessage();
    }

    $scope.$on('$stateChangeStart', function(){
      gamblermainSrv.servicesSocket.socket.disconnect();
      gamblermainSrv.servicesSocket.socket.connect();
    });

  }
]);