'use strict';

angular.module(ApplicationConfiguration.modules.global)
.directive('jmAutoscroll', 
    function () {
        function link(scope, element, attrs) {            
            var panel = $(element);

            element.css({
                'height':       '200px',
                'max-height':   '200px',
                'overflow-y':   'scroll'
            });

            function fnScroll(height){          
                // Scroll when message overtakes the height panel
                panel.stop().animate({
                    scrollTop: height
                }, 500);
            }

            scope.$watch(function(){
                return panel[0].scrollHeight;
            }, function(newValue) {
                fnScroll(newValue);
            });
        }

        return {
            restrict:   'A',
            link:       link
        };
    }
);