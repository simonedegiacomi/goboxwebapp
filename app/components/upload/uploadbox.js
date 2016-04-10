'use strict';

/**
 * @ngdoc directive
 * @name goboxWebapp.directive:uploadBox
 * @description This directive is used to show the running upload.
 * 
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('uploadBox', function($mdDialog, UploadManager, UploadDialog) {

    // Controller of the directive
    function ctrl($scope) {
        
        // List of pending uploads
        $scope.uploads = UploadManager.getUploadsList();
        
        $scope.showDialog = function ($event) {
            
            UploadDialog.show($event);
        };
    }

    // Return the object that describes the directive
    return {
        templateUrl: 'components/upload/uploadbox.html',
        restrict: 'E',
        controller: ctrl
    };
});