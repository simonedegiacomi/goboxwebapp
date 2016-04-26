'use strict';

angular.module('goboxWebapp')

.controller('HomeCtrl', function(Clipboard, Previewer, $state) {
    
    // Set the default function to call when a file is double clicked
    Clipboard.setOpenAction(function(file, $event) {
        
        // If the file is a directory, show that directory
        if (file.isDirectory) {
            
            $state.go('home.files', {
                id: file.getId()
            });
        } else {
            
            // Otherwise show the preview
            Previewer.show($event, file);
        }
    });

});