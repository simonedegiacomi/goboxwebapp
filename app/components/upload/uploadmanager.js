angular.module('goboxWebapp')

.service('UploadManager', function(GoBoxClient, Clipboard) {

    // List of uploads
    this._uploads = [];

    var self = this;

    this.getUploadsList = function() {
        return self._uploads;
    };

    this.upload = function(files) {

        // Get the current folder, the father of the new files
        var currentFolder = Clipboard.getCurrenFather();

        // If is a file instead of an array
        if (angular.isArray(files)) {

            // Insert the file into a new array
            var file = files;
            files = [file];
        }

        angular.forEach(files, function(file) {

            file.pendind = true;

            GoBoxClient.uploadFile(file, currentFolder.getId()).then(function() {

                file.pendind = false;
                file.uploaded = true;
                file.error = false;
            }, function() {

                file.pendind = false;
                file.uploaded = false;
                file.error = true;
            }, function(percentage) {

                file.percentage = percentage;
            });
        });
    };
});