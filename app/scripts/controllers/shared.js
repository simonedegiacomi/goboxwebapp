'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:SharedCtrl
 * @description
 * # SharedCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('ShareCtrl', function($scope, GoBoxClient, $mdDialog, $mdToast) {

    $scope.share = {};

    GoBoxClient.getSharedFiles().then(function(files) {
        $scope.share.files = files;
    });

    $scope.unshare = function(file, evt) {

        $mdDialog.show($mdDialog.confirm()
                .targetEvent(evt)
                .ariaLabel("Unshare file")
                .title("Unashare '" + file.getName() + "' ?")
                .textContent("If you unshare this file the other people can't download it anymore")
                .ok("Unshare File")
                .cancel("Keep this file public")
        ).then(function() {
            GoBoxClient.unshare(file).then(function () {
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

});
