'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('FileListCtrl', function($scope, $state, $timeout, $mdToast, $stateParams, $mdDialog, GoBoxClient, GoBoxFile, Toolbar, Clipboard, Previewer) {

    // Assert that the clipboard is closed on small display
    $scope.closeSidenav();
    
    // Clear the clipboard
    Clipboard.clear();

    // Attach the clipboard to the scope
    $scope.Clipboard = Clipboard;

    GoBoxClient.getInfo($stateParams.id).then(function(detailedFile) {
        $timeout(function() {

            if (detailedFile.isDirectory) {

                // Set the current directory
                $scope.dir = detailedFile;

                // And update the clipboard
                Clipboard.setCurrentFather(detailedFile);

                return;
            }

            // Otherwise set as dir the father of the file
            $state.go('home.files', {
                id: detailedFile.ID
            });

            // And open the previewer
            Previewer.show(detailedFile);
        });
    });
    
    // Config toolbar
    Toolbar.title.mode = 'pwd';
    Toolbar.buttons.switchView.visible = true;
    Toolbar.buttons.search.visible = true;

    // Functions of the fab buttons
    // New folder fab button
    $scope.newFolder = function(evt) {

        // Create the dialog
        var dialog = $mdDialog.prompt()
            .title('New Folder')
            .textContent('Insert the name of the new folder. The new folder will appear in ' + $scope.dir.getName())
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
            newFolder.setIsDirectory(true);
            newFolder.setFatherId($stateParams.id);

            // Call the API method to create the effective directory
            GoBoxClient.createFolder(newFolder).then(function() {
                $mdToast.showSimple("Directory " + result + " Created");
            }, function() {

                // Ops... something wrong
                $mdToast.showSimple("Sorry, can't create the folder");
            });
        });
    };

});