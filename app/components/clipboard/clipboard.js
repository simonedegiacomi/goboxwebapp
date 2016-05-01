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
    var currentFather;

    // Selected files
    var files = [];

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

    // Return the current file
    this.getCurrenFather = function() {
        return currentFather;
    };

    // Change the current file
    this.setCurrentFather = function(father) {
        currentFather = father;
    };

    // Single click event. UPdate the selected file list and call the listeners.
    // It should be called with the value of the ctrl key button
    this.singleClick = function(file) {

        if (file.selected)
            files.splice(files.indexOf(file), 1);
        else
            files.push(file);
        file.selected = !file.selected;
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

    this.getSelectedFiles = function() {
        return files;
    };

    this.clear = function() {
        for (var i in files)
            files[i].selected = false;
        files = [];
    };

    this.holdState = function(newState) {
        state = newState;
        for (var i in files)
            files[i].selected = false;
        holdFiles = files;
        files = [];
    };

    this.getState = function() {
        return state;
    };

    this.clearState = function() {
        holdFiles = [];
        state = null;
    };

    this.getHoldFiles = function() {
        return holdFiles;
    };

    this.isSingleFileSelected = function() {
        var count = 0;
        for (var i = 0; i < files.length && count <= 2; i++)
            if (files[i].selected)
                count++;
        return count == 1;
    };

    this.isFilesSecelted = function() {
        return files.length > 0;
    };

    this.getDownloadLink = function() {
        var fileToDownload = files[0];
        if (!angular.isDefined(fileToDownload))
            return null;
        return {
            name: fileToDownload.getName(),
            url: GoBoxClient.getDownloadLink(fileToDownload)
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

        // Prepare the dialog
        var dialog = $mdDialog.confirm()
            .title("Move to Trash")
            .textContent('Are you sure you want to delete ' + files.length  + (files.length > 1 ? ' files?' : ' file?'))
            .ariaLabel('Delete File')
            .ok('Delete')
            .cancel('Don\'t Delete');

        // Show the dialog
        $mdDialog.show(dialog).then(function(newName) {
            
            // Delete each file
            for (var i in files) {
                
                GoBoxClient.trash(files[i]).then(function() {
                    
                    $mdToast.showSimple("File " + files[i].getName() + " deleted!");
                }, function() {
                    
                    $mdToast.showSimple("Sorry, can't delete " + files[i].getName());
                });
            }
        });

    };

    this.renameFile = function() {

        // Get  the file to rename
        var fileToRename = files[0];

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
    };

    this.shareFile = function() {

        // Take the first selected file
        var file = files[0];

        // Use the client object to share the file
        GoBoxClient.share(file, true).then(function() {
            
            // Show an alert with the link to the shared file
            LinkDialog.show(file);
        }, function() {
            $mdToast.showSimple("Sorry, can't share " + file.getName());
        });
    };
});