'use strict';

/**
 * @author Degiacomi Simone
 * @ngdoc service
 * @name goboxWebapp.clipboard
 * @description
 * # clipboard
 * Service in the goboxWebapp.
 */
angular.module('goboxWebapp')

.service('Clipboard', function($q, $mdToast, $mdDialog, GoBoxFile, GoBoxClient, LinkDialog) {

    // Current folder
    this.currentFather = undefined;

    // Selected files
    var files = [];
    this.selectedFiles = 0;

    // Hold files, when the copy or cut button is pressed
    var holdFiles = [];

    // Listeners for a click event
    var listeners = [];

    // Double click listener
    var open;
    var state;

    var self = this;

    // Call all the listeners
    function notify() {
        for (var i in listeners)
            listeners[i]();
    }

    // Register a new listener
    this.addListener = function(callback) {
        listeners.push(callback);
    };

    // Change the current file
    this.setCurrentFather = function(father) {
        this.currentFather = father;
        files = father.children;
    };

    // Single click event. UPdate the selected file list and call the listeners.
    // It should be called with the value of the ctrl key button
    this.singleClick = function(file) {
        file.selected = !file.selected;
        this.selectedFiles += file.selected ? 1 : -1;
        notify();
    };

    // Double click event, call the open listener
    this.doubleClick = function(file, $event) {
        open(file, $event);
    };

    // Change the open function, the double click listener
    this.setOpenAction = function(action) {
        open = action;
    };


    this.clear = function() {
        files.forEach(function(file) {
            file.selected = false;
        });
        this.selectedFiles = 0;
    };

    this.holdState = function(newState) {
        state = newState;
        this.clear();
        holdFiles = files;
    };

    this.getState = function() {
        return state;
    };

    this.clearState = function() {
        this.clear();
        state = null;
    };

    this.getHoldFiles = function() {
        return holdFiles.filter(function(file) {
            return file.selected;
        });
    };


    this.getDownloadLink = function() {
        var fileToDownload = files[0];
        if (!angular.isDefined(fileToDownload))
            return null;
        return {
            name: fileToDownload.getName(),
            url: GoBoxClient.getLinks(fileToDownload).raw
        };
    };

    this.copyFile = function() {
        self.holdState('copy');
        $mdToast.showSimple("Copied to clipboard");
    };

    this.cutFile = function() {
        self.holdState('cut');
        $mdToast.showSimple("Hold in clipboard");
    };


    this.tashFiles = function() {

        var filesToTrash = this.getSelectedFiles();

        // Prepare the dialog
        var dialog = $mdDialog.confirm()
            .title("Move to Trash")
            .textContent('Are you sure you want to delete ' + filesToTrash.length + (filesToTrash.length > 1 ? ' files?' : ' file?'))
            .ariaLabel('Delete File')
            .ok('Delete')
            .cancel('Don\'t Delete');

        // Show the dialog
        $mdDialog.show(dialog).then(function(newName) {

            // Delete each file
            filesToTrash.forEach(function(fileToDelete) {
                GoBoxClient.trash(fileToDelete).then(function() {
                    $mdToast.showSimple("File " + fileToDelete.getName() + " deleted!");
                }, function() {

                    $mdToast.showSimple("Sorry, can't delete " + fileToDelete.getName());
                });
            });
        });

        this.clear();
    };

    this.renameFile = function() {

        // Get  the file to rename
        var fileToRename = this.getSelectedFiles()[0];

        // Create the dialog
        var dialog = $mdDialog.prompt()
            .title("Rename File")
            .textContent("Choose the new name of the file")
            .placeholder(fileToRename.getName())
            .ariaLabel("Rename File")
            .ok("Rename")
            .cancel("Cancel");

        // Show the dialog
        $mdDialog.show(dialog).then(function(newName) {

            GoBoxClient.rename(fileToRename, newName).then(function() {

                $mdToast.showSimple("File updated");
            }, function() {

                $mdToast.showSimple(("Canot rename the file"));
            });
        });
        
        this.clear();
    };

    this.shareFile = function() {

        // Take the first selected file
        var file = this.getSelectedFiles()[0];

        // Use the client object to share the file
        GoBoxClient.share(file, true).then(function() {

            // Show an alert with the link to the shared file
            LinkDialog.show(file);
        }, function() {
            $mdToast.showSimple("Sorry, can't share " + file.getName());
        });
        
        this.clear();
    };
});