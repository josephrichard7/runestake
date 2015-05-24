'use strict';

angular.module(ApplicationConfiguration.modules.global)
.controller('ChatController', [
  '$scope',
  ApplicationConfiguration.services.chat,
  function($scope, chatSrv) {
    // Private variables
    var vm = this;

    // View functions and variables
    vm.fnSendMessage  = fnSendMessage;
    vm.chatSrv        = chatSrv;
    vm.enumUserRole   = chatSrv.enumUserRole;

    chatSrv.fnInitSocket();
     
    // Sends a chat message
    /*jshint latedef: false */
    function fnSendMessage() {
      chatSrv.fnSendMessage();
    }
    
  }
]);