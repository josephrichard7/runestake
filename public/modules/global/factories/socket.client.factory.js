'use strict';

angular.module(ApplicationConfiguration.modules.global)
.factory('SocketFactory', ['$rootScope',
    function ($rootScope) {
        var URL    = window.location.protocol + '//' + window.location.host;

        function Socket(namespace){
            this.socket = io.connect(URL + namespace, {'forceNew':false});
        }

        Socket.prototype.on = function (eventName, callback) {
            var socket = this.socket;
            socket.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };

        Socket.prototype.emit = function (eventName, data, callback) {
            var socket = this.socket;
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        };

        Socket.prototype.disconnect = function () {
            this.socket.disconnect();
        };

        Socket.prototype.removeAllListeners = function (eventName) {
            this.socket.removeAllListeners(eventName);
        };

        return Socket;
    }
]);