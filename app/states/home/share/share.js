'use strict';

angular.module('goboxWebapp')

.controller('ShareCtrl', function($scope, $state, $mdDialog, $mdToast, GoBoxClient, ToolbarManager, LinkDialog) {

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
    ToolbarManager.setVisibility(true);
    ToolbarManager.apply();

    $scope.unshare = function(file, evt) {
        
        $mdDialog.show($mdDialog.confirm()
                .targetEvent(evt)
                .ariaLabel("Unshare file")
                .title("Unashare " + file.getName() + " ?")
                .textContent("If you unshare this file the other people can't download it anymore")
                .ok("Unshare File")
                .cancel("Keep this file public")
        ).then(function() {
            GoBoxClient.unshare(file).then(function () {
                GoBoxClient.getSharedFiles().then(function(files) {
                    $scope.share.files = files;
                });
                $mdToast.showSimple("File unshared");
            }, function () {
                $mdToast.showSimple("Sorry, can't unshare!");
            });
        });
    };

    $scope.show = function(file) {
        
        $state.go('home.files', {
            id: file.getId()
        });
    };
    
    $scope.getPublicLink = function (file) {
        LinkDialog.show(file);
    };

});