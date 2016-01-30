'use strict';

/**
 * 
 * Created by Degiacomi Simone
 */
angular.module('goboxWebapp')
  .directive('fileList', function () {
    return {
      templateUrl: 'views/filelist.tmpl.html',
      restrict: 'E',
      scope: {
        files: '=files',
        selection: '=selection'
      }
    };
  });
