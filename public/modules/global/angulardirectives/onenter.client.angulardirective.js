'use strict';

angular.module(ApplicationConfiguration.modules.global)
.directive('jmOnEnter', 
    function () {
        function link(scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        }

        return {
            restrict: 'A',
            link:     link
        };
    }
);