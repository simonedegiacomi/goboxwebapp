'use strict';

angular.module('goboxWebapp')

.controller('ToolbarCtrl', function($scope, $timeout, Clipboard, ToolbarManager) {

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
        action: Clipboard.deleteFile
    }, {
        tooltip: 'Share',
        icon: 'share',
        show: Clipboard.isSingleFileSelected,
        action: Clipboard.shareFile
    }];

    // Configure the toolbar with the info of the toolbar manager
    function configFromManager() {
        
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
        
        $timeout(function() {
            
            // Update the download link
            if(Clipboard.isSingleFileSelected())
                $scope.download = Clipboard.getDownloadLink();
            else
                $scope.download = undefined;
        });
    });

    configFromManager();
});