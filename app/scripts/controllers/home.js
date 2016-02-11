'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('HomeCtrl', function($scope, $state, $stateParams, $timeout, GoBoxClient, Clipboard) {

    $scope.connection = {
        state: 'pending'
    };

    if (GoBoxClient.getState() == 'notInitialized')
        GoBoxClient.init();
    else
        $scope.connection.state = 'ok';

    function onStateChange(newState) {
        switch (newState) {
            // Connected to the server and to the storage
            case 'ready':
                $timeout(function() {
                    $scope.connection.state = 'ok';
                });
                break;
                // No storage
            case 'noStorage':
                // Connection close
            case 'close':
                // Error
            case 'error':
                $scope.connection.state = 'error';
                $state.go('home.error');
                break;
            case 'unauthorized':
                GoBoxClient.getAuth().removeCookie();
                $state.go('login');
                break;
        }
    }

    // Active the listener
    GoBoxClient.onStateChange(onStateChange);
    
    function onEventSync(changedFile) {
        if(changedFile.getId() == $stateParams.id)
            $state.go('home.files', { id: $stateParams.id });
    }

    GoBoxClient.addSyncListener(onEventSync);

    /**
     * Sidenav
     */
    $scope.sidenav = {
        user: GoBoxClient.getAuth(),
        links: [{
            name: 'My Files',
            icon: 'cloud',
            link: $state.href('home.files', {
                id: 1 // Link to the root folder
            }),
            selected: true
        }, {
            name: 'Shared',
            icon: 'share',
            divider: true,
        }, {
            name: 'Music',
            icon: 'library_music',
            link: $state.href('home.filter', {
                kind: 'audio'
            })
        }, {
            name: 'Images',
            icon: 'photo_library',
            link: $state.href('home.filter', {
                kind: 'image'
            })
        }, {
            name: 'Documents',
            icon: 'picture_as_pdf',
            link: $state.href('home.filter', {
                kind: 'document'
            })
        }, {
            name: 'Videos',
            icon: 'video_library',
            link: $state.href('home.filter', {
                kind: 'video'
            }),
            divider: true
        }, {
            name: 'Settings',
            icon: 'settings',
            link: $state.href('home.settings')
        }],
        
        menuItems: [{
            name: 'Connection Info',
            icon: 'info',
            action: function () {
                
            }
        }, {
            name: 'Settings',
            icon: 'settings',
            action: function () {
                
            }
        }, {
            name: 'Logout',
            icon: 'exit_to_app',
            action: function () {
                
            }
        }]
    };
    
    /**
     * Create a new clipboard
     */
     var clipboard = $scope.clipboard = new Clipboard();
     
     clipboard.setOpenAction(function (file) {
        if(file.isDirectory)
            $state.go('home.files', { id: file.getId() });
        else {
            
        }
     });
     
     /**
      * Uploads
      */
     $scope.uploads = [];
});

