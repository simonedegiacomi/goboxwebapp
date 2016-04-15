'use strict';

angular.module('goboxWebapp')

.service('Previewer', function($mdDialog, GoBoxClient, Kind) {

    // Controller of the dialog
    function previewDialogCtrl($scope, $mdDialog, file) {
        
        console.log("Controller runnning");
        
        // Create the preview object
        $scope.preview = {
            file: file,
            kind: Kind.fromFile(file),
            link: GoBoxClient.getDownloadLink(file)
        };

        $scope.close = function () {
            $mdDialog.hide();
        };
    }

    this.show = function($event, fileToShow) {
        
        // Create the dialog
        $mdDialog.show({
            templateUrl: 'components/previewer/previewdialog.html',
            controller: previewDialogCtrl,
            targetEvent: $event,
            clickOutsideToClose: true,
            parent: angular.element(document.body),
            locals: {
                'file': fileToShow
            }
        });
    };
    
});
