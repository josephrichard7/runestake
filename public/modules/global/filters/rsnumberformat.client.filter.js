'use strict';

angular.module(ApplicationConfiguration.modules.global)
.filter('jmRsNumberFormatFilter', [
	ApplicationConfiguration.services.utilities,
    function(utilSrv) {
        return function(inputValue){        	
            return utilSrv.util.toRsFormat(inputValue);
        };
    }
]);