'use strict';

/**
 * @ngdoc function
 * @name goboxWebapp.controller:SidenavCtrl
 * @description
 * # SidenavCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('SidenavCtrl', function($rootScope, $mdSidenav, $state, GoBoxAuth, ConnectionInfoDialog) {
    
    // Get the user from the client
    this.user = GoBoxAuth;
    
    // Set the static links
    // TODO: maybe move these links to angular contant?
    this.links = [{
        name: 'My Files',
        icon: 'cloud',
        state: 'home.files({id:1})',
        selected: true
    }, {
        name: 'Shared',
        icon: 'share',
        state: 'home.share'
    }, {
        name: 'Recent',
        icon: 'history',
        state: 'home.recent'
    }, {
        name: 'Trash',
        icon: 'delete',
        state: 'home.trash',
        divider: true
    }, {
        name: 'Music',
        icon: 'library_music',
        state: "home.filter({kind: 'audio'})",
    }, {
        name: 'Images',
        icon: 'photo_library',
        state: "home.filter({kind: 'image'})",
    }, {
        name: 'Documents',
        icon: 'picture_as_pdf',
        state: "home.filter({kind: 'pdf'})",
    }, {
        name: 'Videos',
        icon: 'video_library',
        state: "home.filter({kind: 'video'})",
        divider: true
    }];
    
    // Item on the menu at the top of the sidenav
    this.menuItems = [{
        name: 'Connection Info',
        icon: 'info',
        action: function($event) {
            
            // Open a dialog
            ConnectionInfoDialog.open($event);
        }
    }, { 
        name: 'Settings',
        icon: 'settings',
        action: function() {
            
            // Go to the state settings
            $state.go('home.settings');
        }
    }, {
        name: 'Logout',
        icon: 'exit_to_app',
        action: function() {
            
            // Disconnect the client and invalidate this session
            GoBoxClient.logout();
            
            // Go to the login
            $state.go('login');
        }
    }];
    
    // Expose in every scope the method that toggle the sidenav
    $rootScope.toggleSidenav = function () {
        
        // Just toggle the sidenav
        $mdSidenav('sidenav').toggle();
    };
    
});