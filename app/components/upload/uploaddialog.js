angular.module('goboxWebapp')

.service("UploadDialog", function($mdDialog, UploadManager, $mdMedia) {

    var promise;

    this.show = function($event) {

        // Check if the dialog is already present
        if (angular.isDefined(promise))
            return;

        // Create the object that describes the dialog
        var dialog = {
            controller: dialogCtrl,
            templateUrl: 'components/upload/uploaddialog.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true,
            fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
            onRemoving: function() {
                promise = undefined;
            }
        };

        promise = $mdDialog.show(dialog);
    };

    function dialogCtrl($scope) {
        
        // Attach the list of the uploads
        $scope.uploads = UploadManager.getUploadsList();
        
        // And the method used to upload new files
        $scope.upload = UploadManager.upload;
    }

});