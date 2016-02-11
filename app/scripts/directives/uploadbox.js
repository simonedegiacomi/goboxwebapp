'use strict';

/**
 * @ngdoc directive
 * @name goboxWebapp.directive:uploadBox
 * @description This directive is used to show the running upload.
 * 
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('uploadBox', function() {
    return {
        templateUrl: 'views/uploadbox.tmpl.html',
        restrict: 'E',
        scope: {
            uploads: '=uploads'
        }
    };
});
