'use strict';

angular.module('goboxWebapp')

.controller('HomeCtrl', function($rootScope, $scope, $mdSidenav, Clipboard, Previewer, GoBoxClient, $state, $timeout) {

    $scope.clientReady = GoBoxClient.isReady();


    GoBoxClient.addSyncListener(function() {
        $timeout(function() {
            // just refresh
        });
    });


    $rootScope.closeSidenav = function() {
        $mdSidenav('sidenav').close();
    };

    $rootScope.openSidenav = function() {
        $mdSidenav('sidenav').open();
    };

    $rootScope.open = function(file) {
        $state.go('home.files', {
            id: file.ID
        });
    };

});