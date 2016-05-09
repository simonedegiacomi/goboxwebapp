'use strict';

angular.module('goboxWebapp')

.controller('ToolbarCtrl', function($scope, $timeout, Clipboard, Toolbar, Preferences) {

    Toolbar.buttons.switchView.icon = Preferences.listView == 'list' ? 'view_module' : 'list';
    $scope.conf = Toolbar;
    $scope.Clipboard = Clipboard;

    $scope.switchListView = function() {
        Preferences.listView = Preferences.listView == 'list' ? 'grid' : 'list';
        Toolbar.buttons.switchView.icon = Preferences.listView == 'list' ? 'view_module' : 'list'; 
    };
});