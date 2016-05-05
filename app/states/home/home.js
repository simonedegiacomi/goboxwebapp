'use strict';

angular.module('goboxWebapp')

.controller('HomeCtrl', function($scope, Clipboard, Previewer, GoBoxClient, $state, $timeout) {

    $scope.clientReady = GoBoxClient.isReady();

    // Set the default function to call when a file is double clicked
    Clipboard.setOpenAction(function(file, $event) {

        // If the file is a directory, show that directory
        if (file.isDirectory) {

            $state.go('home.files', {
                id: file.getId()
            });
        }
        else {
            var links = GoBoxClient.getLinks(file);
            Previewer.show(file, links);
        }
    });

    GoBoxClient.addSyncListener(function() {
        $timeout(function() {
            // just refresh
        });
    });

});