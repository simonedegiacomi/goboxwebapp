'use strict';

/**
 * @ngdoc directive
 * @name goboxWebapp.directive:soundPreview
 * @description
 * # soundPreview
 */
angular.module('goboxWebapp')
  .directive('soundPreview', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the soundPreview directive');
      }
    };
  });
