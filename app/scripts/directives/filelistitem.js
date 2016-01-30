'use strict';

/**
 * 
 * Created by Degiacomi Simone
 */
angular.module('goboxWebapp')
  .directive('fileListItem', function () {
    return {
      templateUrl: 'views/filelistitem.tmpl.html',
      restrict: 'E',
      scope: {
        file: '=file'
      }
    };
  });
