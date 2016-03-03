'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('HomeCtrl', function($scope, $state, $timeout,  GoBoxClient, Clipboard, GoBoxFile, Previewer) {

    // Set the default function to cal when a file is double clicked
    Clipboard.setOpenAction(function(file) {
        if (file.isDirectory)
            $state.go('home.files', {
                id: file.getId()
            });
        else {
            Previewer.show(file);
        }
    });

});