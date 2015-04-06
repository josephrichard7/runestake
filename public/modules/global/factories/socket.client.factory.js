'use strict';

angular.module(ApplicationConfiguration.modules.global)
.factory('SocketFactory', ['$rootScope',
    function ($rootScope) {
        var URL    = window.location.protocol + '//' + window.location.host;
        var socket = {};

        function Socket(namespace){
            socket = io.connect(URL + namespace, {'forceNew':false});
        }

        Socket.prototype.on = function (eventName, callback) {
            socket.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };

        Socket.prototype.emit = function (eventName, data, callback) {
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
            socket.disconnect();
        };

        Socket.prototype.removeAllListeners = function (eventName) {
            socket.removeAllListeners(eventName);
        };

        return Socket;
    }
]);