'use strict';

angular.module(ApplicationConfiguration.modules.global)
.service(ApplicationConfiguration.services.utilities, [
	'$resource',
	'$state',
	function($resource, $state){
		var _this = this;
		var enumResource = $resource('enum/:name/:type');
		var enumType = {
			ARRAY: 	'ARRAY',
			OBJECT: 'OBJECT'
		};
		var defaultOptionsGoFunction = {
			location: 	false,
			inherit: 	false,
			reload: 	true
		};
		// Default options for jquery notifications
		$.noty.defaults = {
            layout: 'top',
            theme: 'bootstrapTheme', // or 'relax'
            type: 'alert',
            text: '', // can be html or string
            dismissQueue: true, // If you want to use queue feature set this true
            template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
            animation: {
                open: {height: 'animated bounceInLeft'}, // or Animate.css class names like: 'animated bounceInLeft'
                close: {height: 'animated bounceOutLeft'}, // or Animate.css class names like: 'animated bounceOutLeft'
                easing: 'swing',
                speed: 500 // opening & closing animation speed
            },
            timeout: 2000, // delay for closing event. Set false for sticky notifications
            force: false, // adds notification to the beginning of queue when set to true
            modal: false,
            maxVisible: 5, // you can set max visible notification for dismissQueue true option,
            killer: false, // for close all notifications before show
            closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
            callback: {
                onShow: function() {},
                afterShow: function() {},
                onClose: function() {},
                afterClose: function() {},
                onCloseClick: function() {},
            },
            buttons: false // an array of buttons
        };

		_this.util = {};

		_this.enumName = {
			CHATEVENT: 				'chatevent',
			SERVICESSOCKETEVENT: 	'servicessocketevent',
			SERVICESTATE: 			'servicestate',
			TRADERRANK: 			'traderrank',
			USERROLE: 				'userrole',
			USERSTATE: 				'userstate'
		};

		_this.util.fnLoadEnumArray = function(enumName){
			return enumResource.get({
				name: enumName, 
				type: enumType.ARRAY
			}).$promise;
		};

		_this.util.fnLoadEnumObject = function(enumName){
			return enumResource.get({
				name: enumName, 
				type: enumType.OBJECT
			}).$promise;
		};

		_this.util.go = function(state, params, options){
			$state.go(state, params, options || defaultOptionsGoFunction);
		};

		_this.util.notifyError = function(message){
			notify('error', message);
		};
		_this.util.notify = function(message){
			notify('information', message);
		};

		function notify(type, message){
			noty({
	            text: message,
	            type: type,
	            layout: 'top',
	            theme: 'bootstrapTheme', // or 'relax'
	            // type: 'alert',
	            // text: '', // can be html or string
	            dismissQueue: true, // If you want to use queue feature set this true
	            template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
	            animation: {
	                open: 'animated bounceInLeft', // or Animate.css class names like: 'animated bounceInLeft'
	                close: 'animated bounceOutLeft', // or Animate.css class names like: 'animated bounceOutLeft'
	                easing: 'swing',
	                speed: 500 // opening & closing animation speed
	            },
	            timeout: 3000, // delay for closing event. Set false for sticky notifications
	            force: false, // adds notification to the beginning of queue when set to true
	            modal: false,
	            maxVisible: 5, // you can set max visible notification for dismissQueue true option,
	            killer: false, // for close all notifications before show
	            closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
	            callback: {
	                onShow: function() {},
	                afterShow: function() {},
	                onClose: function() {},
	                afterClose: function() {},
	                onCloseClick: function() {},
	            },
	            buttons: false // an array of buttons
			});
		}
	}
]);