'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('FileListCtrl', function($scope, $stateParams, $timeout, $mdToast, $state, $mdDialog, GoBoxClient, GoBoxFile, Env, Upload) {

    var dir = new GoBoxFile();
    dir.setId($stateParams.id);
    GoBoxClient.getInfo(dir).then(function(detailedDir) {
        $scope.dir = detailedDir;
    });

    /**
     * Configure the toolbar
     */
    $scope.toolbar = {
        title: {
            mode: 'pwd'
        },
        showSearchLink: true,
        tools: [{
            tooltip: 'Copy',
            icon: 'content_copy',
            show: isFilesSecelted,
            action: copyFile
        }, {
            tooltip: 'Cut',
            icon: 'content_cut',
            show: isFilesSecelted,
            action: cutFile
        }, {
            tooltip: 'Delete',
            icon: 'delete',
            show: isFilesSecelted,
            action: deleteFile
        }, {
            tooltip: 'Share',
            icon: 'share',
            show: isSingleFileSelected,
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
     * Functions of the buttons
     */

    $scope.newFolder = function(evt) {
        $mdDialog.show({
            controller: function($scope, $mdDialog) {
                $scope.abort = function() {
                    $mdDialog.hide();
                };
                $scope.create = function() {
                    var newFolder = new GoBoxFile($scope.input.name);
                    newFolder.setIsDirectory(true);
                    newFolder.setFatherId(dir.getId());

                    GoBoxClient.createFolder(newFolder).then(function() {
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

    var uploads = $scope.uploads;

    $scope.uploadFiles = function(files, errFiles) {

        angular.forEach(files, function(file) {

            var gbFile = new GoBoxFile(file.name);
            gbFile.setFatherId(dir.getId());
            var upload = {
                file: gbFile,
                state: 'queue'
            };
            uploads.push(upload);

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
                    var percentage = Math.min(100, parseInt(100.0 * evt.loaded / evt.total))
                    upload.state = percentage + '%';
                });
            });
        });
    };

    function isSingleFileSelected() {
        return $scope.clipboard.getSelectedFiles().length == 1;
    }

    function isFilesSecelted() {
        return $scope.clipboard.getSelectedFiles().length > 0;
    }

    function copyFile() {
        $scope.clipboard.holdState('copy');
    }

    function cutFile() {
        $scope.clipboard.holdState('c');
    }

    function deleteFile() {

    }

    function shareFile() {

    }
});