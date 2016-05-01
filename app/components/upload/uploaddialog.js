angular.module('goboxWebapp')

.service("UploadDialog", function($mdDialog, UploadManager, $mdMedia) {

    this.show = function($event) {

        // Create the object that describes the dialog
        var dialog = {
            controller: dialogCtrl,
            templateUrl: 'components/upload/uploaddialog.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true
        };

        $mdDialog.show(dialog);
    };

    function dialogCtrl($scope, $mdDialog) {
        
        // Attach the list of the uploads
        $scope.uploads = UploadManager.getUploadsList();
        
        // And the method used to upload new files
        $scope.uploadFile = UploadManager.upload;
        
        // Method to cancel an upload
        $scope.cancel = UploadManager.cancel;
        
        $scope.close = function () {
            $mdDialog.hide();
        };
    }

});