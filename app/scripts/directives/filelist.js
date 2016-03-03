'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('fileList', function($timeout, Clipboard) {

    var ctrl = function($scope) {
        // Time of the last click
        var lastClick = 0;
        // Last clicked file
        var lastClickedFile;
        
        $scope.click = function(file) {
            
            if(lastClickedFile == file && Date.now() - lastClick <= 300) { // Double click
                // And then call the correct clipboard method
                Clipboard.doubleClick(file);
            } else {
                lastClick = Date.now();
                lastClickedFile = file;
                
                Clipboard.singleClick(file, false);
            }
        };
        
        // List order config
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