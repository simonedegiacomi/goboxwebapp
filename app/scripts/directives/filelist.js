'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('fileList', function($timeout) {

    var ctrl = function($scope) {
        var clipboard = $scope.clipboard;
        
        var lastClick = 0;
        var lastClickedFile;
        
        $scope.click = function(file) {
            
            if(lastClickedFile == file && Date.now() - lastClick <= 300) { // Double click
                // And then call the correct clipboard method
                clipboard.doubleClick(file);
            } else {
                lastClick = Date.now();
                lastClickedFile = file;
                
                clipboard.singleClick(file, false);
            }
        };
        
        $scope.order = {
            what: 'name',
            reverse: false,
            toggle: function (newWhat) {
                this.reverse = this.what == newWhat ? !this.reverse : false;
                this.what = newWhat;
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