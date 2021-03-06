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
        var currentFolder = Clipboard.currentFather;

        // If is a file instead of an array
        if (!angular.isArray(files)) {

            // Insert the file into a new array
            var temp = files;
            files = [temp];
        }

        angular.forEach(files, function(file) {

            // Create a new upload object
            var upload = {
                file: file,
                pending: true,
                error: false,
                uploaded: false,
                percentage: 0
            };
            
            // Add the upload to the list
            self._uploads.push(upload);
            
            GoBoxClient.uploadFile(file, currentFolder.ID).then(function() {

                upload.pending = false;
                upload.uploaded = true;
                upload.error = false;
            }, function() {

                upload.pending = false;
                upload.uploaded = false;
                upload.error = true;
            }, function(percentage) {

                upload.percentage = percentage;
            });
        });
    };
});