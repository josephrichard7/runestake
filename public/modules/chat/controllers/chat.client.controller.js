'use strict';

angular.module('chat').controller('ChatController', ['$scope', '$stateParams', '$location', 'Authentication', 'socket',
  function($scope, $stateParams, $location, Authentication, socket) {
    // Private variables
    var vm              = this;
    var enumChatEvent   = {
      // Native events
      CONNECTION:   'connect',
      DISCONNECT:   'disconnect',
      // App events
      LOGIN:        'LOGIN',
      NEW_USER:     'NEW_USER',
      NEW_MESSAGE:  'NEW_MESSAGE',
      USER_JOINED:  'USER_JOINED',
      USER_LEFT:    'USER_LEFT'
    };
    var enumUserChatState = {
      CONNECTED:      'CONNECTED',
      DISCONNECTED:   'DISCONNECTED',
      CONNECTING:     'CONNECTING',
      LOGGED:         'LOGGED'
    };
    var enumMessageType = {
      USER:   'USER',
      INFO:   'INFO'
    };
    var username        = Authentication.user.username;
    var serverConnected = false;

    // Watching variables
    $scope.numConnectedUsers    = 0;

    // View functions and variables
    vm.sendMessage              = sendMessage;
    vm.listMessages             = [];
    vm.listParticipantMessages  = [username + ' starts logging ...'];
    vm.listConnectedUsers       = [];
    vm.numUsersMessage          = '';
    vm.chatState                = enumUserChatState.DISCONNECTED;
    vm.enumUserChatState        = enumUserChatState;
    vm.enumMessageType          = enumMessageType;

    // Socket listeners
     
    // Sends a chat message
    /*jshint latedef: false */
    function sendMessage() {
      // if there is a non-empty message and a socket connection
      if (vm.message && serverConnected) {        
        // Send 'new message' to server
        socket.emit(enumChatEvent.NEW_MESSAGE, vm.message);

        // Clean message textbox of the chat
        vm.message = '';
      }
    }

    function setNumUsersMessage(){
      if ($scope.numConnectedUsers === 1) {
        vm.numUsersMessage = '(1 user '+ enumUserChatState.CONNECTED +')';
      } else {
        vm.numUsersMessage = '(' + $scope.numConnectedUsers + ' users '+ enumUserChatState.CONNECTED +')';
      }
    }

    function addChatMessage (username, message, type) {
      var objMessage      = {
        username: username,
        message:  message,
        type:     type
      };
      vm.listMessages.push(objMessage);
      // Scroll when message overtakes the height panel
      $('#chatPanel').stop().animate({
        scrollTop: $('#chatPanel')[0].scrollHeight
      }, 500);
    }

    // Whenever the server emits 'login', log the login message
    socket.on(enumChatEvent.LOGIN, function (data) {
      $scope.numConnectedUsers  = data.numConnectedUsers;
      vm.listConnectedUsers     = data.listConnectedUsers;
      serverConnected           = true;
      addChatMessage(
        data.username, 
        ' logged',
        enumMessageType.INFO
      );
    });

    // When Maganer socketio is ready on client. This event is emit by client, not by server.
    socket.on(enumChatEvent.CONNECTION, function () {
      vm.chatState = enumUserChatState.CONNECTED;
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on(enumChatEvent.NEW_MESSAGE, function (data) {
      addChatMessage(
        data.username, 
        data.message,
        enumMessageType.USER
      );
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on(enumChatEvent.USER_JOINED, function (data) {
      $scope.numConnectedUsers  = data.numConnectedUsers;
      vm.listConnectedUsers     = data.listConnectedUsers;
      addChatMessage(
        data.username, 
        'joined',
        enumMessageType.INFO
      );
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on(enumChatEvent.USER_LEFT, function (data) {
      if(data.username === username){
        window.location.reload();
      }else{
        $scope.numConnectedUsers = data.numConnectedUsers;
        vm.listConnectedUsers    = data.listConnectedUsers;        
        addChatMessage(
          data.username, 
          'left',
          enumMessageType.INFO
        );
      }
    });

    socket.on(enumChatEvent.DISCONNECT, function () {
      vm.chatState    = enumUserChatState.DISCONNECTED;
      serverConnected = true;
    });

    $scope.$watch('numConnectedUsers', function() {
        setNumUsersMessage();      
    });

  }
]);