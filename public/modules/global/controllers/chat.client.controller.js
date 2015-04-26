'use strict';

angular.module(ApplicationConfiguration.modules.global)
.controller('ChatController', 
  ['$scope',
    ApplicationConfiguration.services.chat,
  function($scope, ChatService) {
    // Private variables
    var vm = this;

    // View functions and variables
    vm.fnSendMessage  = fnSendMessage;
    vm.chatService    = ChatService.instance;
    vm.enumUserRole   = {
      ADMIN:    'ADMIN',
      BANK:     'BANK',
      TRADER:   'TRADER',
      GAMBLER:  'GAMBLER'
    };
     
    // Sends a chat message
    /*jshint latedef: false */
    function fnSendMessage() {
      vm.chatService.fnSendMessage(vm.message, function(){
        vm.message = '';
      });
    }

    // Remote app listeners for avoiding repeat events
    vm.chatService.removeAppListeners();

    // Register chat socket listeners and their callbacks

    vm.chatService.onConnect();

    vm.chatService.onDisconnect();

    vm.chatService.onLogin();
    
    vm.chatService.onNewMessage();

    vm.chatService.onUserJoined();

    vm.chatService.onUserLeft(function(data){
      if(data.username === vm.chatService.username){
        window.location.reload();
      }
    });
  }
]);