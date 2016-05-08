'use strict';

angular.module('goboxWebapp')

.controller('ToolbarCtrl', function($scope, $timeout, Clipboard, Toolbar, Preferences) {

    Toolbar.buttons.switchView.icon = Preferences.listView == 'list' ? 'view_module' : 'list';
    $scope.conf = Toolbar;
    $scope.Clipboard = Clipboard;
    
    // Tools of the toolbar
    // $scope.tools = [{
    //     tooltip: 'Copy',
    //     icon: 'content_copy',
    //     show: function() {
    //         return Clipboard.isFilesSecelted();
    //     },
    //     action: function() {
    //         Clipboard.copyFile();
    //     }
    // }, {
    //     tooltip: 'Cut',
    //     icon: 'content_cut',
    //     show: function() {
    //         return Clipboard.isFilesSecelted();
    //     },
    //     action: function() {
    //         Clipboard.cutFile();
    //     }
    // }, {
    //     tooltip: 'Delete',
    //     icon: 'delete',
    //     show: function() {
    //         return Clipboard.isFilesSecelted();
    //     },
    //     action: function() {
    //         Clipboard.tashFiles();
    //     }
    // }, {
    //     tooltip: 'Rename',
    //     icon: 'mode_edit',
    //     show: function() {
    //         return Clipboard.isSingleFileSelected();
    //     },
    //     action: function() {
    //         Clipboard.renameFile();
    //     }
    // }, {
    //     tooltip: 'Share',
    //     icon: 'share',
    //     single: function() {
    //         return Clipboard.isSingleFileSelected();
    //     },
    //     action: function() {
    //         Clipboard.shareFile();
    //     }
    // }];


    // Add a listener to the toolbar
    Clipboard.addListener(function() {

        // Update the download link
        if (Clipboard.isSingleFileSelected())
            $scope.download = Clipboard.getDownloadLink();
        else
            $scope.download = undefined;
    });

    $scope.switchListView = function() {
        Preferences.listView = Preferences.listView == 'list' ? 'grid' : 'list';
        Toolbar.buttons.switchView.icon = Preferences.listView == 'list' ? 'view_module' : 'list'; 
    };
});