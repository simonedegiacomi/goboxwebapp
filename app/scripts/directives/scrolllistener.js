'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('scrollListener', function() {
    return {
        restrict: 'A',
        link: function($scope, elements, attrs) {
            // Get the first element
            var element = elements[0];
            
            // Bind the scroll event
            element.bind('scroll', function() {
                
                // If the user reach the end of the page, call the listener
                if (element.scrollTop + element.offsetHeight >= element.scrollHeight) {
                    $scope.listener();
                }
            });
        },
        scope: {
            listener: "=onScrollEnd"
        }
    };
});
