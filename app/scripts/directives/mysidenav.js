'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.directive:mySidenav
 * @description
 * # mySidenav
 */
angular.module('goboxWebapp')

.directive('mySidenav', function() {
    return {
        templateUrl: 'views/mysidenav.tmpl.html',
        restrict: 'E',
        transclude: true,
        scope: {
            config: '=config'
        }
    };

});