'use strict';

angular.module('chat').controller('ChatController', ['$scope', '$stateParams', '$location', 'Authentication', 'socket', 'Utilities',
  function($scope, $stateParams, $location, Authentication, socket, Utilities) {
    var vm = this;
    var enumChatEvent = {};
    var username = Authentication.user.username;
    var connected = false;

    vm.listMessages             = [];
    vm.listParticipantMessages  = [username + ' starts logging ...'];
    vm.numUsersMessage          = '';
    vm.numUsers                 = 0;
    vm.initChat                 = initChat;
    vm.sendMessage              = sendMessage;

    // Utilities.enumResource.get({enumName: 'chatevent'},function(result){
    //   enumChatEvent = result.data.reduce(function(obj, k) {
    //     obj[k] = k;
    //     return obj;
    //   }, {});
    // });
    
    // var enumresult = Utilities.enumResource.get({enumName: 'chatevent'});
    // enumChatEvent = enumresult.data.reduce(function(obj, k) {
    //   obj[k] = k;
    //   return obj;
    // }, {});

    // Socket listeners

    /*jshint latedef: false */
    function initChat(){
      // Tell the server your username
      socket.emit('ADD_USER', username);
    }

    function log(data) {
      console.log(data);
    }

      // Sends a chat message
    function sendMessage() {
      // Prevent markup from being injected into the message
      // message = cleanInput(message);
      // if there is a non-empty message and a socket connection
      if (vm.message && connected) {
        // $inputMessage.val('');
        // addChatMessage({
        //   username: username,
        //   message: message
        // });
        
        // tell server to execute 'new message' and send along one parameter
        socket.emit('NEW_MESSAGE', vm.message);
        
        // Push message into chat panel
        vm.listMessages.push({username: username, message: vm.message});

        // Clean message textbox of the chat
        vm.message = '';
      }
    }

    function setNumUsersMessage(){
      if (vm.numUsers === 1) {
        vm.numUsersMessage = '(1 user connected)';
      } else {
        vm.numUsersMessage = '(' + vm.numUsers + ' users connected)';
      }
    }

    function addParticipantsMessage (message) {
      vm.listParticipantMessages.push(message);
      log(message);
    }

    // Whenever the server emits 'login', log the login message
    socket.on('LOGIN', function (data) {
      connected = true;
      // Display the welcome message
      // var message = 'Welcome to Socket.IO Chat – ';
      // log(message, {
      //   prepend: true
      // });
      var message = username + ' has logged';
      vm.numUsers = data.numUsers;
      setNumUsersMessage();
      addParticipantsMessage(message);
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on('NEW_MESSAGE', function (data) {
      vm.listMessages.push(data);
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('USER_JOINED', function (data) {
      var message = data.username + ' joined';
      vm.numUsers = data.numUsers;
      setNumUsersMessage();
      addParticipantsMessage(message);
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('USER_LEFT', function (data) {
      var message = data.username + ' left';
      vm.numUsers = data.numUsers;
      setNumUsersMessage();
      addParticipantsMessage(message);
      // removeChatTyping(data);
    });

    socket.on('disconnect_client', function (data) {
      socket.disconnect();
    });

    // Whenever the server emits 'typing', show the typing message
    // socket.on('typing', function (data) {
    //   addChatTyping(data);
    // });

    // Whenever the server emits 'stop typing', kill the typing message
    // socket.on('stop typing', function (data) {
    //   removeChatTyping(data);
    // });
  }
]);