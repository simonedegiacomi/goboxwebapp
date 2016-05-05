'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('FileListCtrl', function($scope, $state, $timeout, $mdToast, $stateParams, $mdDialog, GoBoxClient, GoBoxFile, ToolbarManager, Clipboard, Previewer) {

    // Attach the clipboard to the scope
    $scope.Clipboard = Clipboard;

    // Clear the clipboard
    Clipboard.clear();

    var dirId = $stateParams.id;

    GoBoxClient.getInfo(dirId).then(function(detailedFile) {
        $timeout(function() {

            if (detailedFile.isDirectory) {

                // Set the current directory
                $scope.dir = detailedFile;

                // And update the clipboard
                Clipboard.setCurrentFather(detailedFile);

                // Refresh the toolbar
                ToolbarManager.apply();
                return;
            }

            // Otherwise set as dir the father of the file
            $state.go('home.files', {
                id: detailedFile.getFatherId()
            });

            // And open the previewer
            Previewer.show(detailedFile);
        });
    });


    // Configure the toolbar
    // The title is the path
    ToolbarManager.setTitle({
        mode: 'pwd'
    });

    // Show search button and tools
    ToolbarManager.showSearch(true);

    // And also the tool
    ToolbarManager.showTools(true);

    // Finally refresh the toolbar
    ToolbarManager.setVisibility(true);
    ToolbarManager.apply();

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

    // Paste fab button
    $scope.paste = function() {

        // Checkif the action is copy or cut
        var cut = Clipboard.getState() == 'cut';

        // Get the holded files
        var files = Clipboard.getHoldFiles();
        
        // For each file...
        angular.forEach(files, function(file) {

            // Call the client method
            GoBoxClient.copyOrCut(file, $scope.dir, cut).then(function() {

                $mdToast.showSimple("File " + file.getName() + " moved");
            }, function() {

                $mdToast.showSimple("Sorry, there was an error with " + file.getName());
            });
        });
        
        Clipboard.clear();
    };
});