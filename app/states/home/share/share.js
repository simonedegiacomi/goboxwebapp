'use strict';

angular.module('goboxWebapp')

.controller('ShareCtrl', function($scope, $state, $mdDialog, $mdToast, GoBoxClient, Toolbar, LinkDialog) {

    $scope.share = {};

    GoBoxClient.getSharedFiles().then(function(files) {
        $scope.share.files = files;
    });
    
    // Config toolbar
    Toolbar.title.mode = 'title';
    Toolbar.title.str = 'Share';
    Toolbar.buttons.switchView.visible = false;
    Toolbar.buttons.search.visible = true;

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