'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:SharedCtrl
 * @description
 * # SharedCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('ShareCtrl', function($scope, GoBoxClient, $utils, ToolbarManager) {

    $scope.share = {};

    GoBoxClient.getSharedFiles().then(function(files) {
        $scope.share.files = files;
    });
    
    ToolbarManager.setTitle({
        mode: 'title',
        str: 'Shared Files'
    });
    ToolbarManager.showSearch(true);
    ToolbarManager.showTools(false);
    ToolbarManager.apply();
    console.log("Fatto");

    $scope.unshare = function(file, evt) {
        $utils.$mdDialog.show($utils.$mdDialog.confirm()
                .targetEvent(evt)
                .ariaLabel("Unshare file")
                .title("Unashare '" + file.getName() + "' ?")
                .textContent("If you unshare this file the other people can't download it anymore")
                .ok("Unshare File")
                .cancel("Keep this file public")
        ).then(function() {
            GoBoxClient.unshare(file).then(function () {
                GoBoxClient.getSharedFiles().then(function(files) {
                    $scope.share.files = files;
                });
                $utils.$mdToast.showSimple("File unshared");
            }, function () {
                $utils.$mdToast.showSimple("Sorry, can't unshare!");
            });
        });
    };

    $scope.show = function(file) {
        $utils.$state.go('home.files', {
            id: file.getId()
        });
    };

});