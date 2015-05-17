'use strict';

angular.module(ApplicationConfiguration.modules.global)
.directive('jmRsNumberFormat', [
	ApplicationConfiguration.services.utilities,
    function(utilSrv) {
        function link(scope, element, attrs, ngModel){        	
        	ngModel.$formatters.push(utilSrv.util.toRsFormat);
            ngModel.$parsers.push(utilSrv.util.deleteRsFormat);

        	element.bind('change', function(){
        		var formattedValue 	= utilSrv.util.toRsFormat(ngModel.$modelValue);
        		var viewValue 		= ngModel.$viewValue;
                                
                if(formattedValue !== viewValue) {
					element.val(formattedValue);
                }
        	});
        }

        return {
            restrict:   'A',
            require: 	'ngModel',
            link: 		link
        };
    }
]);