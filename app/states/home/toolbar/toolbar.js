'use strict';

/**
 * @author Degiacomi Simone
 * @ngdoc function
 * @name goboxWebapp.controller:ToolbarCtrl
 * @description
 * # ToolbarCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('ToolbarCtrl', function($scope, $utils, Clipboard, ToolbarManager) {

    $scope.Clipboard = Clipboard;

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

    ToolbarManager.onChange(function() {
        $utils.$timeout(function() {
            configFromManager();
        });
    });

    Clipboard.addListener(function() {
       $utils.$timeout(function() {
            $scope.download = Clipboard.getDownloadLink();   
       });
    });

    function configFromManager() {
        $scope.showTools = ToolbarManager.getShowTools();
        $scope.showSearchLink = ToolbarManager.getShowSearch();
        $scope.title = ToolbarManager.getTitle();
        $scope.file = Clipboard.getCurrenFather();
        $scope.download = Clipboard.getDownloadLink();
    }

    configFromManager();
});