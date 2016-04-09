'use strict';

/**
 * @ngdoc directive
 * @name goboxWebapp.directive:uploadBox
 * @description This directive is used to show the running upload.
 * 
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('uploadBox', function($mdDialog, $mdMedia, UploadManager) {

    function ctrl($scope) {
        
        var uploads = UploadManager.getUploadsList();
        var uploadFile = UploadManager.uploadFile;
        
        $scope.showDialog = function($event) {
            
            function dialogCtrl ($scope) {
                $scope.uploads = uploads;
                $scope.uploadFile = uploadFile;
                $scope.close = function () {
                    $mdDialog.hide();  
                };
            }
            
            var dialog = {
                controller: dialogCtrl,
                templateUrl: 'components/uploaddialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
            };

            $mdDialog.show(dialog);
        };
    }

    return {
        templateUrl: 'components/uploaddialog/uploadbox.html',
        restrict: 'E',
        scope: {
            config: '=config'
        },
        controller: ctrl
    };
});
