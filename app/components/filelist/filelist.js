'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('fileList', function($state, Clipboard, Preferences) {


    // Controller of the file list
    var ctrl = function($scope) {
        
        $scope.Clipboard = Clipboard;
        
        var mobile = WURFL.is_mobile;
        console.log("Mode: " + (mobile ? "mobile" : "desktop"));
        
        $scope.click = function (file) {
            if (mobile) {
                $scope.open(file);
                return;
            }
            Clipboard.toggle(file);
        };
        
        $scope.double = function (file, $event) {
            if (mobile) {
                return;
            }
            $scope.open(file);
        };
        
        $scope.press = function (file) {
            Clipboard.toggle(file);
        };
        
        // attach the preferences
        $scope.Preferences = Preferences;
        
        // List order config
        $scope.order = {
            what: 'name',
            reverse: false,
            toggle: function (newWhat) {
                this.reverse = this.what == newWhat ? !this.reverse : false;
                this.what = newWhat;
            }
        };
        
        $scope.open = function (file) {
            $state.go('home.files', {
                id: file.ID
            });
        };
        
        $scope.checkBoxClick = function (file) {
            file.selected =! file.selected;
            Clipboard.toggle(file);
        };
    };

    // Return the object that describes the directive
    return {
        templateUrl: 'components/filelist/filelist.html',
        restrict: 'E',
        scope: {
            files: '=files'
        },
        controller: ctrl
    };
});