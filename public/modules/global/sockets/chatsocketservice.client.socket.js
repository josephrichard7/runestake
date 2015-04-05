'use strict';

angular.module(ApplicationConfiguration.applicationModuleName).factory('socket', ['$rootScope', 'Authentication', 
    function ($rootScope, Authentication) {
        var URL     = window.location.protocol + '//' + window.location.host;
        var socket  = io.connect(URL+'/chat',{'forceNew':false});
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {  
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            },
            disconnect: function () {
                socket.disconnect();
            }
        };
    }
]);