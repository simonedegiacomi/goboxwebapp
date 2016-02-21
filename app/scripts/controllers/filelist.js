'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('FileListCtrl', function($scope, $stateParams, $timeout, $mdToast, $state, $mdDialog, GoBoxClient, GoBoxFile, Env, Upload) {

    var dir = new GoBoxFile();
    dir.setId($stateParams.id);

    function loadDir() {
        GoBoxClient.getInfo(dir).then(function(detailedDir) {
            console.log(detailedDir);
            $timeout(function() {
                $scope.dir = detailedDir;
            });
        });
    }

    loadDir();

    /**
     * Sync Event listener
     */
    GoBoxClient.setSyncListener(function() {
        loadDir();
    });

    /**
     * Configure the toolbar
     */
    $scope.toolbar = {
        title: {
            mode: 'pwd'
        },
        showSearchLink: true,
        downloadUrl: null,
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
    
    $scope.$watch(isSingleFileSelected, function (single) {
        $scope.toolbar.downloadUrl =  single ? generateDownloadLink() : null;
    });

    /**
     * Functions of the fab buttons
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

    $scope.paste = function() {
        var cut = clipboard.getState() == 'cut';
        var files = clipboard.getHoldFiles();
        angular.forEach(files, function(file) {
            GoBoxClient.copyOrCut(file, dir, cut).then(function() {
                $mdToast.showSimple("File " + file.getName() + " moved");
            }, function() {
                $mdToast.showSimple("Sorry, there was an error with " + file.getName());
            });
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

    var clipboard = $scope.clipboard;

    function isSingleFileSelected() {
        return clipboard.getSelectedFiles().length == 1;
    }

    function isFilesSecelted() {
        return clipboard.getSelectedFiles().length > 0;
    }
    
    function generateDownloadLink () {
        var fileToDownload = clipboard.getSelectedFiles()[0];
        if(!angular.isDefined(fileToDownload))
            return "";
        return Env.base + "api/transfer/fromStorage?ID=" + fileToDownload.getId() + "&jwt=" + GoBoxClient.getAuth().getToken();
    }
    
    function copyFile() {
        clipboard.holdState('copy');
        $mdToast.showSimple("Copied to clipboard");
    }

    function cutFile() {
        clipboard.holdState('cut');
        $mdToast.showSimple("Hold in clipboard");
    }

    function deleteFile() {
        // TODO show dialog
        var files = clipboard.getSelectedFiles();
        for (var i in files)
            GoBoxClient.remove(files[i]).then(function() {
                $mdToast.showSimple("File " + files[i].getName() + " deleted!");
            }, function() {
                $mdToast.showSimple("Sorry, can't delete " + files[i].getName());
            });
    }

    function shareFile() {

    }
});