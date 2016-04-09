'use strict';

/**
 * @ngdoc function
 * @name goboxWebapp.controller:SidenavCtrl
 * @description
 * # SidenavCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('SidenavCtrl', function($rootScope, $scope, $mdSidenav, $state, $utils, GoBoxClient, Clipboard) {
    
    // Get the user from the client
    $scope.user = GoBoxClient.getAuth();
    
    // Set the static links
    $scope.links = [{
        name: 'My Files',
        icon: 'cloud',
        state: 'home.files({id:1})',
        selected: true
    }, {
        name: 'Shared',
        icon: 'share',
        state: 'home.share',
        divider: true,
    }, {
        name: 'Search',
        icon: 'search',
        state: "home.filter({kind: 'any'})",
    }, {
        name: 'Music',
        icon: 'library_music',
        state: "home.music",
    }, {
        name: 'Images',
        icon: 'photo_library',
        state: "home.images",
    }, {
        name: 'Documents',
        icon: 'picture_as_pdf',
        state: "home.documents",
    }, {
        name: 'Videos',
        icon: 'video_library',
        state: "home.videos",
        divider: true
    }, {
        name: 'Settings',
        icon: 'settings',
        state: 'home.settings'
    }];
    $scope.menuItems = [{
        name: 'Connection Info',
        icon: 'info',
        action: function($event) {
            // Open a dialog
            openInfoDialog($event);
        }
    }, {
        name: 'Settings',
        icon: 'settings',
        action: function() {
            $state.go('home.settings');
        }
    }, {
        name: 'Logout',
        icon: 'exit_to_app',
        action: function() {
            GoBoxClient.logout();
            $state.go('login');
        }
    }];
    
    function openInfoDialog($event) {
        
        function infoDialogCtrl ($scope) {
            $scope.conn = {
                ping: -1
            };
            $utils.$interval(function() {
                GoBoxClient.ping().then(function(time) {
                    $utils.$timeout(function() {
                        $scope.conn.ping = time;
                    });
                });
            }, 1000);
            $scope.close = function () {
                $utils.$mdDialog.hide();
            };
        }
        
        var dialog = {
            controller: infoDialogCtrl,
            templateUrl: 'views/dialog/info.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true
        };
        $utils.$mdDialog.show(dialog);
    }
    
    $rootScope.toggleSidenav = function () {
        $mdSidenav('sidenav').toggle();
    };
    
    /**
     * Configure uploads queue
     */
    $scope.upload = {
        uploads: GoBoxClient.getUploadsQueue(),
        uploadFile: uploadFile
    };

    function uploadFile (files, errFiles) {

        var currentFolder = Clipboard.getCurrenFather();

        angular.forEach(files, function(file) {

            GoBoxClient.uploadFile(file, currentFolder.getId()).then(function(){
                $utils.$mdToast.showSimple("Upload completed");
            }, function(){
                $utils.$mdToast.showSimple("Upload failed");
            });
        });
    }
});