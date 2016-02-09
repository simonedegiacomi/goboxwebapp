'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('HomeCtrl', function($scope, $state, $timeout, GoBoxClient) {

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
        }
    }

    // Active the listener
    GoBoxClient.onStateChange(onStateChange);

    /**
     * Sidenav
     */
    $scope.sidenav = {
        user: GoBoxClient.getAuth(),
        links: [{
            name: 'My Files',
            icon: 'cloud',
            link: $state.href('home.files', {
                id: 1
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
            icon: 'info'
        }, {
            name: 'Settings',
            icon: 'settings'
        }, {
            name: 'Logout',
            icon: 'exit_to_app'
        }]
    };
});
