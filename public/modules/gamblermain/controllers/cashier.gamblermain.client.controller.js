'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('CashierController', ['$scope',
  function($scope) {
    // Private variables
    var vm = this;

    vm.serviceType  = 'CASHIN';
    vm.currency     = 'RS07';

  }
]);