'use strict';

angular.module('goboxWebapp')

.controller('ToolbarCtrl', function($scope, $timeout, Clipboard, ToolbarManager, Preferences) {

    // Tools of the toolbar
    $scope.tools = [{
        tooltip: 'Copy',
        icon: 'content_copy',
        show: Clipboard.isFilesSecelted,
        action: Clipboard.copyFile
    }, {
        tooltip: 'Cut',
        icon: 'content_cut',
        show: Clipboard.isFilesSecelted,
        action: Clipboard.cutFile
    }, {
        tooltip: 'Delete',
        icon: 'delete',
        show: Clipboard.isFilesSecelted,
        action: Clipboard.tashFiles
    }, {
        tooltip: 'Rename',
        icon: 'mode_edit',
        show: Clipboard.isSingleFileSelected,
        action: Clipboard.renameFile
    }, {
        tooltip: 'Share',
        icon: 'share',
        single: true,
        action: Clipboard.shareFile
    }];

    // Configure the toolbar with the info of the toolbar manager
    function configFromManager() {
        $scope.showToolbar = ToolbarManager.getVisibility();
        $scope.showTools = ToolbarManager.getShowTools();
        $scope.showSearchLink = ToolbarManager.getShowSearch();
        $scope.title = ToolbarManager.getTitle();
        $scope.currentFile = Clipboard.getCurrenFather();
    }

    // When the toolbar manager change the config of the toolbar
    ToolbarManager.onChange(function() {

        $timeout(function() {

            // Reload the settings
            configFromManager();
        });
    });


    // Add a listener to the toolbar
    Clipboard.addListener(function() {
        
        // Update the download link
        if(Clipboard.isSingleFileSelected())
            $scope.download = Clipboard.getDownloadLink();
        else
            $scope.download = undefined;
    });

    var setSwitchIcon = function () {
        $scope.switchListViewIcon = Preferences.listView == 'list' ? 'view_module' : 'list';
    };

    $scope.switchListView = function () {
        Preferences.listView = Preferences.listView == 'list' ? 'grid' : 'list';  
        setSwitchIcon();
        console.log("called");
    };
    
    setSwitchIcon();
    
    configFromManager();
});