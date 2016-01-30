'use strict';

/**
 * @ngdoc directive
 * @name goboxWebapp.directive:pathPwd
 * @description
 * # pathPwd
 */
angular.module('goboxWebapp')
  .directive('pathPwd', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the pathPwd directive');
      }
    };
  });
