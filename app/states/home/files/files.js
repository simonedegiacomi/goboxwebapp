'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('FileListCtrl', function($scope, $timeout, $mdToast, $stateParams, $mdDialog, GoBoxClient, GoBoxFile, ToolbarManager, Clipboard, Previewer) {

    // Attach the clipboard to the scope
    $scope.Clipboard = Clipboard;

    // Clear the clipboard
    Clipboard.clear();

    // Function that retrieve the info about the file using the GoBoxClient
    function loadDir(dirId) {

        GoBoxClient.getInfo(dirId).then(function(detailedFile) {
            $timeout(function() {

                if (detailedFile.isDirectory) {

                    // Set the current directory
                    $scope.dir = detailedFile;
                    
                    // And update the clipboard
                    Clipboard.setCurrentFather(detailedFile);
                }
                else {

                    // Otherwise set as dir the father of the file
                    var path = detailedFile.getPath();
                    var father = path[path.length - 1];

                    // Set it to the scope
                    $scope.dir = father;

                    // And in the clipboard
                    Clipboard.setCurrentFather(father);

                    // And open the previewer
                    Previewer.show(detailedFile);
                }

                // Refresh the toolbar
                ToolbarManager.apply();
            });
        });
    }

    // Get the info now
    loadDir($stateParams.id);

    // Register the listener for the sync events
    GoBoxClient.setSyncListener(function() {

        // When a new event arrive, reload the info of this file
        loadDir();
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
            
            // Create the new folder
            var newFolder = new GoBoxFile($scope.input.name);
            newFolder.setIsDirectory(true);
            newFolder.setFatherId($stateParams.id);
            
            // Call the API method to create the effective directory
            GoBoxClient.createFolder(newFolder).then(function() {
                
                $mdToast.showSimple("Directory " + $scope.input.name + " Created");
                loadDir();
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
    };

    // Show the files as listb
    $scope.fileListConfig = {
        mode: 'list'
    };
});