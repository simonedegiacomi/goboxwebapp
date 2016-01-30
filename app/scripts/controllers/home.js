'use strict';

/**
 * @ngdoc function
 * @name goboxWebapp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('HomeCtrl', function($scope, GoBoxClient) {

    $scope.sidenav = {
        username: GoBoxClient.getAuth().getUsername(),
        elements: [
            {
                name: 'My Files',
                icon: 'cloud',
                selected: true
            }, {
                name: 'Shared',
                icon: 'share',
                divider: true
            },{
                name: 'Music',
                icon: 'library_music'
            }, {
                name: 'Images',
                icon: 'photo_library'
            }, {
                name: 'Documents',
                icon: 'picture_as_pdf'
            }, {
                name: 'Videos',
                icon: 'video_library',
                divider: true
            }, {
                name: 'Settings',
                icon: 'settings'
            }
        ],
        menuItems: [
            {
                name: 'Connection Info',
                icon: 'info'
            }, {
                name: 'Settings',
                icon: 'settings'
            }, {
                name: 'Logout',
                icon:'exit_to_app'
            }
        ]
    };
    
    $scope.connection = {
        state: 'ok' 
    };

});
