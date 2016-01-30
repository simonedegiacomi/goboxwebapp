'use strict';

/**
 * 
 * Created by Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('FileListCtrl', function($scope, $stateParams, $state, GoBoxClient, GoBoxPath, GoBoxFile) {

    // var folderId = $stateParams.id;

    // var path = $scope.path = new GoBoxPath(GoBoxClient);

    // path.cd(folderId);

    // $scope.position = path.ls();
    $scope.mocks = [];
    for (var i = 0; i < 50; i++) {
        $scope.mocks.push(new GoBoxFile("File " + i));
        $scope.mocks[i].setIsDirectory(i % 2 == 0);
    }


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
        ]
    };
    
    $scope.tools = [
        {
            tooltip: 'Copy',
            icon: 'content_copy'
        }, {
            tooltip: 'Cut',
            icon: 'content_cut'
        }, {
            tooltip: 'Delete',
            icon: 'delete'
        }
    ];
    
    $scope.test = false;
    
    $scope.selection = {
        active: false,
        toggle: function () {
            this.active = !this.active;
        }
    };
    
    $scope.logout = function () {
        GoBoxClient.logout();
        $state.go('login');
    };
    
    GoBoxClient.on("storageInfo", function (data) {
        if(!data.connected) {
            
        }
    });
});
