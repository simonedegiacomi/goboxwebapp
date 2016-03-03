'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')
.controller('FileListCtrl', function($scope, $stateParams, $utils, $state, GoBoxClient, GoBoxFile, ToolbarManager, Clipboard) {

    // Create the file from the url
    var dir = new GoBoxFile();
    dir.setId($stateParams.id);
    Clipboard.setCurrentFather(dir);

    // Function that retrieve the info about the file using the GoBoxClient
    function loadDir() {
        GoBoxClient.getInfo(dir).then(function(detailedDir) {
            $utils.$timeout(function() {
                $scope.dir = detailedDir;
            });
        });
    }
    
    // Get the info now
    loadDir();

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
    ToolbarManager.showTools(true);
    ToolbarManager.apply();

    // Functions of the fab buttons
    // New folder fab button
    $scope.newFolder = function(evt) {
        $utils.$mdDialog.show({
            controller: function($scope, $mdDialog) {
                $scope.abort = function() {
                    $mdDialog.hide();
                };
                $scope.create = function() {
                    var newFolder = new GoBoxFile($scope.input.name);
                    newFolder.setIsDirectory(true);
                    newFolder.setFatherId(dir.getId());

                    GoBoxClient.createFolder(newFolder).then(function() {
                        $utils.$mdToast.showSimple("Directory " + $scope.input.name + " Created");
                    }, function() {
                        $utils.$mdToast.showSimple("Sorry, can't create the folder");
                    });
                    $mdDialog.hide();
                };
            },
            templateUrl: 'views/newfolder.dialog.html',
            targetEvent: evt,
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    };

    // Paste fab button
    $scope.paste = function() {
        var cut = Clipboard.getState() == 'cut';
        var files = Clipboard.getHoldFiles();
        angular.forEach(files, function(file) {
            GoBoxClient.copyOrCut(file, dir, cut).then(function() {
                $utils.$mdToast.showSimple("File " + file.getName() + " moved");
            }, function() {
                $utils.$mdToast.showSimple("Sorry, there was an error with " + file.getName());
            });
        });
    };
});