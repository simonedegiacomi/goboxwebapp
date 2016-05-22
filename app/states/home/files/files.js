'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('FileListCtrl', function($state, $timeout, $mdToast, $stateParams, $mdDialog, GoBoxClient, GoBoxFile, Toolbar, Clipboard, Previewer) {

    // Assert that the clipboard is closed on small display
    //$scope.closeSidenav();

    // Attach the clipboard to the scope
    this.Clipboard = Clipboard;

    var self = this;

    GoBoxClient.getInfo($stateParams.id).then(function(detailedFile) {

        if (detailedFile.isDirectory) {

            // Set the current directory
            self.dir = detailedFile;

            // And update the clipboard
            Clipboard.setCurrentFather(detailedFile);

            return;
        }

        // Otherwise open the previewer
        Previewer.show(detailedFile);

        // And set as dir the father of the file
        $state.go('home.files', {
            id: detailedFile.fatherID
        });

    });

    // Config toolbar
    Toolbar.title.mode = 'pwd';
    Toolbar.buttons.switchView.visible = true;
    Toolbar.buttons.search.visible = true;

    // Functions of the fab buttons
    // New folder fab button
    this.newFolder = function(evt) {

        // Create the dialog
        var dialog = $mdDialog.prompt()
            .title('New Folder')
            .textContent('Insert the name of the new folder. The new folder will appear in ' + this.dir.name)
            .placeholder('ex: documents, work...')
            .ariaLabel('New folder name')
            .targetEvent(evt)
            .ok('Create')
            .cancel('Cancel');

        // Show the dialog
        $mdDialog.show(dialog).then(function(result) {

            if (result.length <= 0)
                return;

            // Create the new folder
            var newFolder = new GoBoxFile(result);
            newFolder.isDirectory = true;
            newFolder.fatherID = $stateParams.id;

            // Call the API method to create the effective directory
            GoBoxClient.createFolder(newFolder).then(function() {
                $mdToast.showSimple("Directory " + result + " Created");
            }, function(error) {

                // Ops... something wrong
                $mdToast.showSimple(error);
            });
        });
    };

});