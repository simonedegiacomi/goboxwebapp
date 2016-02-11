'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('fileList', function() {

    var ctrl = function($scope) {
        var clipboard = $scope.clipboard;
        
        var lastClick = 0;
        var lastClickedFile;
        
        $scope.click = function(file) {
            if(lastClickedFile == file && Date.now() - lastClick <= 300) {
                // Double click
                clipboard.doubleClick(file);
            } else {
                lastClick = Date.now();
                lastClickedFile = file;
            }
        };
    };

    return {
        templateUrl: 'views/filelist.tmpl.html',
        restrict: 'E',
        scope: {
            files: '=files',
            clipboard: '=clipboard'
        },
        controller: ctrl
    };
});