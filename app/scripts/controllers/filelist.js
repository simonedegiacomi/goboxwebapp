'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('FileListCtrl', function($scope, $stateParams, $timeout, $mdToast, $state, $mdDialog, GoBoxClient, GoBoxPath, GoBoxFile, Selection, Env) {

    // Create a new Path
    var path = $scope.path = new GoBoxPath(GoBoxClient);

    // Add the listener for the path changes
    path.addListener(function onPathChange(newDir) {
        // When the path change update the scope
        $timeout(function() {
            $scope.dir = newDir;
            // update the url
            
        });
    });

    // Enter in the folder of the url
    var folder = new GoBoxFile();
    folder.setId($stateParams.id);
    path.cd(folder);


    /**
     * Configure the toolbar
     */
    $scope.toolbar = {
        title: {
            mode: 'pwd',
            path: path,
            str: "titolo"
        },
        showSearchLink: true,
        showTools: true,
        tools: [{
            tooltip: 'Copy',
            icon: 'content_copy',
            action: copyFile
        }, {
            tooltip: 'Cut',
            icon: 'content_cut',
            action: cutFile
        }, {
            tooltip: 'Delete',
            icon: 'delete',
            action: deleteFile
        }, {
            tooltip: 'Share',
            icon: 'share',
            action: shareFile
        }]
    };

    /**
     * Configure the fab
     */
    $scope.fab = {
        add: {
            open: false
        }
    };

    /**
     * Configure the selection
     */
    var selection = $scope.selection = new Selection(path);

    selection.setOpenFunction(function(file) {
        $state.go('home.files', { id: file.getId() })
    });

    /**
     * Functions of the buttons
     */

    $scope.newFolder = function(evt) {
        $mdDialog.show({
            controller: function($scope, $mdDialog) {
                $scope.abort = function() {
                    $mdDialog.hide();
                };
                $scope.create = function() {
                    path.mkdir($scope.input.name).then(function() {
                        $mdToast.showSimple("Directory " + $scope.input.name + " Created");
                    }, function() {
                        $mdToast.showSimple("Sorry, can't create the folder");
                    });
                    $mdDialog.hide();
                };
            },
            templateUrl: 'views/newfolder.dialog.html',
            targetEvent: evt,
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    };

    $scope.uploadFiles = function(files, errFiles) {
        angular.forEach(files, function(file) {
            console.log(file);
            var gbfile = new GoBoxFile(file.name);
            file.upload = Upload.upload({
                // TODO: absoluty find a better way. Maybe chage the request to a multipart reuqest
                url: Env.base + '/api/transfer/toStorage/?json=' + encodeURI(JSON.stringify(file)),
                headers: {
                    'Content-Type': file.type
                },
                data: file
            });

            file.upload.then(function(response) {
                $timeout(function() {
                    file.result = response.data;
                });
            }, function(response) {
                console.log(response);
            }, function(evt) {
                console.log(evt);
            });
        });
    };

    function copyFile() {

    }

    function cutFile() {

    }

    function deleteFile() {

    }

    function shareFile() {

    }
});
