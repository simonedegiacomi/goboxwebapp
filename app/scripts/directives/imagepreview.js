'use strict';

/**
 * @ngdoc directive
 * @name goboxWebapp.directive:imagePreview
 * @description
 * # imagePreview
 */
angular.module('goboxWebapp')

.directive('imagePreview', function() {
    return {
        template: '<img ng-src="{{preview.link}}" width="100%">',
        restrict: 'E',
        scope: {
            preview: '=preview'
        }
    };
});
