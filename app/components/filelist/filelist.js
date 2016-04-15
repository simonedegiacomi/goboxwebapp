'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('fileList', function($timeout, Clipboard) {

    // Controller of the file list
    var ctrl = function($scope) {
        
        // Time of the last click
        var lastClick = 0;
        
        // Last clicked file
        var lastClickedFile;
        
        // Function called when a file is clicked
        // TODO: move this low level login is a dedicate directive
        $scope.click = function(file, $event) {
            
            if(lastClickedFile == file && Date.now() - lastClick <= 300) { // Double click
            
                // And then call the correct clipboard method
                Clipboard.doubleClick(file, $event);
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

    // Return the object that describes the directive
    return {
        templateUrl: 'components/filelist/filelist.html',
        restrict: 'E',
        scope: {
            files: '=files',
            config: '=config'
        },
        controller: ctrl
    };
});