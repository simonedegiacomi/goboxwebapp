'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('fileList', function() {

    var ctrl = function($scope) {
        var selection = $scope.selection;
        
        var lastClik = 0;
        
        $scope.click = function(file) {
            if(selection.getSelectedFile() == file && Date.now() - lastClik <= 300) {
                selection.open(file);
            } else {
                selection.select(file);
                lastClik = Date.now();
            }
        };
    };

    return {
        templateUrl: 'views/filelist.tmpl.html',
        restrict: 'E',
        scope: {
            files: '=files',
            selection: '=selection'
        },
        controller: ctrl
    };
});