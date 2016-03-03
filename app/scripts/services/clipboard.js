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

.service('Clipboard', function($q, $utils, GoBoxFile, GoBoxClient) {

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
    this.singleClick = function(file, ctrl) {
        if (!ctrl)
            this.clear();
        files.push(file);
        file.selected = true;
        notify();
    };

    // Double click event, call the open listener
    this.doubleClick = function(file) {
        open(file);
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
        return files.length == 1;
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
        this.holdState('copy');
        $utils.$mdToast.showSimple("Copied to clipboard");
    };

    this.cutFile = function() {
        this.holdState('cut');
        $utils.$mdToast.showSimple("Hold in clipboard");
    };

    this.deleteFile = function() {
        // TODO show dialog
        for (var i in files)
            GoBoxClient.remove(files[i]).then(function() {
                $utils.$mdToast.showSimple("File " + files[i].getName() + " deleted!");
            }, function() {
                $utils.$mdToast.showSimple("Sorry, can't delete " + files[i].getName());
            });
    };

    this.shareFile = function() {

        var file = files[0];
        GoBoxClient.share(file, true).then(function(url) {
            $utils.$mdDialog.show(
                $utils.$mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Shared file Link')
                .textContent('The public link of the file is: ' + url)
                .ariaLabel('File shared')
                .ok('Ok')
            );
        }, function() {
            $utils.$mdToast.showSimple("Sorry, can't share " + file.getName());
        });
    };
});