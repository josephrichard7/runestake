'use strict';

angular.module(ApplicationConfiguration.modules.tradermain)
.controller('SrvCreatedCashierTradermainController', [
  '$scope',
  '$stateParams',
  ApplicationConfiguration.services.cashiertradermain,
  function($scope, $stateParams, cashierTradermainSrv) {
    // Private variables
    var vm = this;

    vm.fnInit           = fnInit;
    vm.fnDesistService  = fnDesistService;
    vm.fnSendMessage    = fnSendMessage;

    /*jshint latedef: false*/
    function fnInit(){
      vm.cashierTradermainSrv = cashierTradermainSrv;
      
      cashierTradermainSrv.fnReadServiceById($stateParams.id);
    }

    function fnDesistService(){
      cashierTradermainSrv.fnDesistService();
    }
     
    function fnSendMessage() {
      cashierTradermainSrv.fnSendMessage();
    }

    $scope.$on('$stateChangeStart', function(){
      cashierTradermainSrv.servicesSocket.socket.disconnect();
      cashierTradermainSrv.servicesSocket.socket.connect();
    });

  }
]);