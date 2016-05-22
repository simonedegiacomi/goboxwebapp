'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('fileList', function($state, $timeout, Clipboard, Preferences, Previewer) {


    // Controller of the file list
    var ctrl = function($scope) {

        $scope.Clipboard = Clipboard;

        var mobile = !!WURFL ? WURFL.is_mobile : false;

        $scope.click = function(file) {
            if (mobile) {
                if (Clipboard.selectedFiles <= 0) {
                    $scope.open(file);
                }
                return;
            }
            Clipboard.toggle(file);

        };

        $scope.double = function(file, $event) {
            if (mobile) {
                return;
            }
            $scope.open(file);
        };

        $scope.press = function(file) {
            Clipboard.toggle(file);
        };

        // attach the preferences
        $scope.Preferences = Preferences;

        // List order config
        $scope.order = {
            what: 'name',
            reverse: false,
            toggle: function(newWhat) {
                this.reverse = this.what == newWhat ? !this.reverse : false;
                this.what = newWhat;
            }
        };

        $scope.open = function(file) {
            if (file.isDirectory) {
                $state.go('home.files', {
                    id: file.ID
                });
                return;
            }
            Previewer.show(file);
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