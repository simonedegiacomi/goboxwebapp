'use strict';

/**
 * 
 * Crated by Degiacomi Simone
 */
angular.module('goboxWebapp')
  .directive('uploadBox', function () {
    return {
      templateUrl: 'views/uploadbox.tmpl.html',
      restrict: 'E',
    };
  });
