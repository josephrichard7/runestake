'use strict';

angular.module(ApplicationConfiguration.modules.global)
.directive('jmRsNumberFormat', [
    '$rootScope',
	ApplicationConfiguration.services.utilities,
    function($rootScope, utilSrv) {
        function link(scope, element, attrs, ngModel){        
            //convert data from model format to view format
        	ngModel.$formatters.push(utilSrv.util.toRsFormat);
            //convert data from view format to model format 
            ngModel.$parsers.push(utilSrv.util.deleteRsFormat);

        	element.bind('keyup', function(){
     //    		var formattedValue 	= ''+utilSrv.util.toRsFormat(ngModel.$modelValue);
     //    		var viewValue 		= ngModel.$viewValue;
                                
     //            if(formattedValue !== viewValue) {
					// element.val(formattedValue);
     //            }
                $rootScope.$apply();
        	});
        }

        return {
            restrict:   'A',
            require: 	'ngModel',
            link: 		link
        };
    }
]);