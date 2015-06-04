'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('LobbyStakeGamblermainController', [
  ApplicationConfiguration.services.gamblermain,
  ApplicationConfiguration.services.stakemain,
  function(gamblermainSrv, stakemainSrv) {
    // Private variables
    var vm = this;    

    vm.fnInit               = fnInit;
    vm.fnPostStake          = fnPostStake;
    vm.fnRemovePostedStake  = fnRemovePostedStake;
    vm.currentPage  = 1;
    vm.pageSize     = 20;

    /*jshint latedef: false*/
    function fnInit(){
      vm.gamblermainSrv = gamblermainSrv;
      vm.stakemainSrv   = stakemainSrv;        

      stakemainSrv.fnInitStakeSocket();
    }

    function fnPostStake(){
      stakemainSrv.fnPostStake(vm.stakeAmount);
    }

    function fnRemovePostedStake(){
      stakemainSrv.fnRemovePostedStake();
    }

  }
]);