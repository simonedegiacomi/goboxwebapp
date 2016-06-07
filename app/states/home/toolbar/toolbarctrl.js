'use strict';

angular.module('goboxWebapp')

.controller('ToolbarCtrl', function($mdSidenav, Clipboard, Toolbar, Preferences) {

    Toolbar.buttons.switchView.icon = Preferences.listView == 'list' ? 'view_module' : 'list';
    this.conf = Toolbar;
    this.Clipboard = Clipboard;

    this.switchListView = function() {
        Preferences.listView = Preferences.listView == 'list' ? 'grid' : 'list';
        Toolbar.buttons.switchView.icon = Preferences.listView == 'list' ? 'view_module' : 'list'; 
    };
    
    this.toggleSidenav = function () {
        $mdSidenav('sidenav').toggle();  
    };
});