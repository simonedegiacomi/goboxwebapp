'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')
  .filter('iconFilter', function () {
    return function (file) {
      return file.isDirectory ? 'folder' : 'insert_drive_file';
    };
  });
