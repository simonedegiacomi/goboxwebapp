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

    /**
     * Current folder
     */
    this.currentFather = undefined;

    /**
     * Array with the selected files. this array containsalso files that were selected.
     * Use getSelectedFiles to get only the current selected files
     */
    var files = [];
    
    /**
     * Action copy o cut, evaluated by the paste method
     */
    var action;
    
    var holdFiles;
    
    /**
     * Number of selected files
     */
    this.selectedFiles = 0;

    /**
     * True if copy or cut was called
     */
    this.canPaste = false;

    /**
     * Change the current father
     */
    this.setCurrentFather = function(father) {
        this.currentFather = father;
        files = father.children;
        this.clear();
    };

    /**
     * Unselect all the files
     */
    this.clear = function() {
        files.forEach(function(file) {
            file.selected = false;
        });
        this.selectedFiles = 0;
    };

    /**
     * Return an array with the selected files
     */
    this.getSelectedFiles = function() {
        return files.filter(function(file) {
            return file.selected;
        });
    };
    
    this.toggle = function (file) {
        file.selected = !file.selected;
        this.selectedFiles += file.selected ? 1 : -1;
    };
    
    this.update = function (file) {
        this.selectedFiles += file.selected ? 1 : -1;
    };


    /**
     * Return the download link of the first selected file
     */
    this.getDownloadLink = function() {
        
        // Assert that at least one file is selected
        if (this.selectedFiles <= 0)
            return;
            
        var fileToDownload = this.getSelectedFiles()[0];
        return {
            name: fileToDownload.name,
            url: GoBoxClient.getLinks(fileToDownload).raw
        };
    };

    /**
     * Prepare for the copy action
     */
    this.copy = function() {
        action = 'copy';
        holdFiles = this.getSelectedFiles();
        this.canPaste = true;
        this.clear();
        $mdToast.showSimple("Copied to clipboard");
    };

    /**
     * Prepare for the cut action
     */
    this.cut = function() {
        action = 'cut';
        holdFiles = this.getSelectedFiles();
        this.canPaste = true;
        this.clear();
        $mdToast.showSimple("Hold in clipboard");
    };

    this.paste = function () {
        var self = this;
        holdFiles.forEach(function(file) {
            GoBoxClient.copyOrCut(file, self.currentFather, action == 'cut').then(function () {
                $mdToast.showSimple(file.name + " moved");
            }, function () {
                $mdToast.showSimple("cannot move " + file.name);
            }); 
        });
        this.canPaste = false;
        this.clear();
    };


    /**
     * Ask the user and then trash the specified file.
     * TODO: separe logic from view
     */
    this.trashFiles = function() {

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
                    $mdToast.showSimple("File " + fileToDelete.name + " deleted!");
                }, function() {

                    $mdToast.showSimple("Sorry, can't delete " + fileToDelete.name);
                });
            });
        });

        this.clear();
    };

    /**
     * Ask the user for the name of the new file
     * TODO: separe logic from view
     */
    this.renameFile = function() {

        // Get  the file to rename
        var fileToRename = this.getSelectedFiles()[0];

        // Create the dialog
        var dialog = $mdDialog.prompt()
            .title("Rename File")
            .textContent("Choose the new name of the file")
            .placeholder(fileToRename.name)
            .ariaLabel("Rename File")
            .ok("Rename")
            .cancel("Cancel");

        // Show the dialog
        $mdDialog.show(dialog).then(function(newName) {
            console.log("In clipboard, file to rename:", fileToRename);
            GoBoxClient.rename(fileToRename, newName).then(function() {

                $mdToast.showSimple("File updated");
            }, function() {

                $mdToast.showSimple(("Cannot rename the file"));
            });
        });
        
        this.clear();
    };

    /**
     * Share the first selected file
     * TODO: separe logic from view
     */
    this.shareFile = function() {

        // Take the first selected file
        var file = this.getSelectedFiles()[0];

        // Use the client object to share the file
        GoBoxClient.share(file, true).then(function() {

            // Show an alert with the link to the shared file
            LinkDialog.show(file);
        }, function() {
            $mdToast.showSimple("Sorry, can't share " + file.name);
        });
        
        this.clear();
    };
});