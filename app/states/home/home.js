'use strict';

angular.module('goboxWebapp')

.controller('HomeCtrl', function($mdSidenav, Clipboard, Previewer, GoBoxClient, $state, $timeout) {

    this.clientReady = GoBoxClient.isReady();


    GoBoxClient.addSyncListener(function() {
        $timeout(function() {
            // just refresh
        });
    });


    this.closeSidenav = function() {
        $mdSidenav('sidenav').close();
    };

    this.openSidenav = function() {
        $mdSidenav('sidenav').open();
    };

    this.goTo = function(file) {
        $state.go('home.files', {
            id: file.ID
        });
    };

    this.open = function(file) {
        if (file.isDirectory) {
            $state.go('home.files', {
                id: file.ID
            });
            return;
        }
        Previewer.show(file);
    };

});