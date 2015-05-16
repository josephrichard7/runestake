'use strict';

angular.module(ApplicationConfiguration.modules.bankmain)
.controller('ServicesBankmainController', 
  ['$scope',
  '$location',
  ApplicationConfiguration.services.bankmain,
  function($scope, $location, bankmainSrv) {
    // Private variables
    var vm = this;    

    vm.fnInit             = fnInit;
    vm.fnCompleteService  = fnCompleteService;
    vm.fnSendMessage      = fnSendMessage;
    vm.fnToggleWork       = fnToggleWork;

    /*jshint latedef: false*/
    function fnInit(){
      vm.bankmainSrv    = bankmainSrv;
      vm.currentPage    = 1;
      vm.pageSize       = 10;
      bankmainSrv.fnLoadListServices();
    }

    function fnCompleteService(service){
      bankmainSrv.fnCompleteService(service.service._id);
    }

    function fnSendMessage(service) {
      bankmainSrv.fnSendMessage(service.service._id, service.message, function(){
        service.message = '';
      });
    }

    function fnToggleWork(){
      if(bankmainSrv.isWorking){
        bankmainSrv.fnStopWorking();
      }else{
        bankmainSrv.fnStartWork();
      }
    }

  }
]);