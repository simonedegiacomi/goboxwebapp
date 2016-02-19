'use strict';

/**
 * @ngdoc directive
 * @name goboxWebapp.directive:uploadBox
 * @description This directive is used to show the running upload.
 * 
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('uploadBox', function($mdDialog, $mdMedia) {

    function ctrl($scope) {
        var uploads = $scope.config.uploads;
        var uploadFile = $scope.config.uploadFile;
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
                templateUrl: 'views/uploaddialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
            };

            $mdDialog.show(dialog);
        };
    }

    return {
        templateUrl: 'views/uploadbox.tmpl.html',
        restrict: 'E',
        scope: {
            config: '=config'
        },
        controller: ctrl
    };
});
