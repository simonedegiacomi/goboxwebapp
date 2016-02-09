'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('myToolbar', function() {

    return {
        templateUrl: 'views/mytoolbar.tmpl.html',
        restrict: 'E',
        scope: {
            config: '=config',
        }
    };
});