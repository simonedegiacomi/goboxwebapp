'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('HomeCtrl', function($scope, $state, $stateParams, $mdSidenav, $timeout, $mdMedia, $mdDialog,  GoBoxClient, Clipboard, GoBoxFile, Upload, Env, Previewer) {

    /**
     * Sidenav
     */
    $scope.sidenav = {
        user: GoBoxClient.getAuth(),
        links: [{
            name: 'My Files',
            icon: 'cloud',
            state: 'home.files',
            link: $state.href('home.files', {
                id: 1
            }),
            selected: true
        }, {
            name: 'Shared',
            icon: 'share',
            state: 'home.share',
            divider: true,
            link: $state.href('home.share')
        }, {
            name: 'Search',
            icon: 'search',
            state: "home.filter({kind: 'any'})",
            link: $state.href('home.filter', {
                kind: 'any'
            })
        }, {
            name: 'Music',
            icon: 'library_music',
            state: "home.filter({kind: 'audio'})",
            link: $state.href('home.filter', {
                kind: 'audio'
            })
        }, {
            name: 'Images',
            icon: 'photo_library',
            state: "home.filter({kind: 'image'})",
            link: $state.href('home.filter', {
                kind: 'image'
            })
        }, {
            name: 'Documents',
            icon: 'picture_as_pdf',
            state: "home.filter({kind: 'pdf'})",
            link: $state.href('home.filter', {
                kind: 'document'
            })
        }, {
            name: 'Videos',
            icon: 'video_library',
            state: "home.filter({kind: 'video'})",
            link: $state.href('home.filter', {
                kind: 'video'
            }),
            divider: true
        }, {
            name: 'Settings',
            icon: 'settings',
            state: 'home.settings',
            link: $state.href('home.settings')
        }],

        menuItems: [{
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
        }]
    };

    $scope.toggleSidenav = function() {
        $mdSidenav('sidenav').toggle();
    };

    /**
     * Create a new clipboard
     */
    var clipboard = $scope.clipboard = new Clipboard();

    clipboard.setOpenAction(function(file) {
        if (file.isDirectory)
            $state.go('home.files', {
                id: file.getId()
            });
        else {
            Previewer.show(file);
        }
    });

    /**
     * Uploads
     */
    $scope.upload = {
        uploads: []
    };
    var uploads = $scope.upload.uploads;

    $scope.upload.uploadFile = function(files, errFiles) {

        var fatherId = $stateParams.id == undefined ? 1 : $stateParams.id;

        angular.forEach(files, function(file) {

            var gbFile = new GoBoxFile(file.name);
            gbFile.setFatherId(fatherId);
            var upload = {
                file: gbFile,
                state: 'queue'
            };
            uploads.push(upload);

            gbFile.setIsDirectory(false);
            gbFile.setMime(file.type);

            Upload.http({
                // TODO: absoluty find a better way. Maybe chage the request to a multipart reuqest
                url: Env.base + 'api/transfer/toStorage?json=' + encodeURI(JSON.stringify(gbFile)),
                data: file
            }).then(function(response) {
                $timeout(function() {
                    upload.state = 'complete';
                });
            }, function(response) {
                $timeout(function() {
                    upload.state = 'failed';
                });
            }, function(evt) {
                $timeout(function() {
                    var percentage = Math.min(100, parseInt(100.0 * evt.loaded / evt.total, 10));
                    upload.state = percentage;
                });
            });
        });
    };

    function openInfoDialog($event) {
        
        function infoDialogCtrl ($scope) {
            $scope.conn = {
                ping: -1
            };
            GoBoxClient.ping().then(function (time) {
                $timeout(function(){
                    $scope.conn.ping = time;
                });
            });
            $scope.close = function () {
                $mdDialog.hide();
            };
        }
        
        var dialog = {
            controller: infoDialogCtrl,
            templateUrl: 'views/info.dialog.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
        };
        $mdDialog.show(dialog);
    }

});