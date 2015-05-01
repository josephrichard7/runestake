'use strict';

angular.module(ApplicationConfiguration.modules.tradermain)
.controller('ServicesTradermainController', 
  ['$scope',
  '$location',
  ApplicationConfiguration.services.tradermain,
  function($scope, $location, tradermainSrv) {
    // Private variables
    var vm = this;    

    vm.fnInit             = fnInit;
    vm.fnCompleteService  = fnCompleteService;
    vm.fnSendMessage      = fnSendMessage;
    vm.fnToggleWork       = fnToggleWork;

    /*jshint latedef: false*/
    function fnInit(){
      vm.tradermainSrv  = tradermainSrv;
      vm.currentPage    = 1;
      vm.pageSize       = 10;
      tradermainSrv.fnLoadListServices();
    }

    function fnCompleteService(service){
      tradermainSrv.fnCompleteService(service.service._id);
    }

    function fnSendMessage(service) {
      tradermainSrv.fnSendMessage(service.service._id, service.message, function(){
        service.message = '';
      });
    }

    function fnToggleWork(){
      if(tradermainSrv.isWorking){
        tradermainSrv.fnStopWorking();
      }else{
        tradermainSrv.fnStartWork();
      }
    }

  }
]);