'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('CashierController', 
  ['$scope',
  '$location',
  ApplicationConfiguration.services.gamblermain,
  function($scope, $location, gamblermainSrv) {
    // Private variables
    var vm = this;    

    vm.fnInit = fnInit;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv       = gamblermainSrv;
      vm.currentPage          = 1;
      vm.pageSize             = 10;
      gamblermainSrv.fnLoadListServices();
      gamblermainSrv.fnTradersAvailable();
    }

  }
]);