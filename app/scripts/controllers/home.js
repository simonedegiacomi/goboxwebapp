'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('HomeCtrl', function($scope, $state, $stateParams, $mdSidenav, $timeout, GoBoxClient, Clipboard, GoBoxFile, Upload, Env, Previewer) {

    $scope.connection = {
        state: 'notIni'
    };

    function onStateChange(newState) {
        $timeout(function() {
            switch (newState) {
                case 'noStorage':
                case 'close':
                case 'error':
                    console.log("Redirect to error");
                    $scope.connection.state = 'error';
                    $state.go('home.error');
                    break;
                default:
                    $scope.connection.state = newState;
                    break;
            }
        });
    }

    var currentState = GoBoxClient.getState();
    if (currentState == 'notInitialized')
        GoBoxClient.init();

    onStateChange(currentState);

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
                id: 1 // Link to the root folder
            }),
            selected: true
        }, {
            name: 'Shared',
            icon: 'share',
            divider: true,
            link: $state.href('home.share')
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
            action: function() {

            }
        }, {
            name: 'Settings',
            icon: 'settings',
            action: function() {

            }
        }, {
            name: 'Logout',
            icon: 'exit_to_app',
            action: function() {

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
        
        console.log("OK", files);
        
        var fatherId = $stateParams.id == undefined ? 1 : $stateParams.id;

        angular.forEach(files, function(file) {

            var gbFile = new GoBoxFile(file.name);
            gbFile.setFatherId(fatherId);
            var upload = {
                file: gbFile,
                state: 'queue'
            };
            uploads.push(upload);

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
                    var percentage = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    upload.state = percentage + '%';
                });
            });
        });
    };

});