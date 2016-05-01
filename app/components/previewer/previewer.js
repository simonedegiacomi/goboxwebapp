'use strict';

angular.module('goboxWebapp')

.service('Previewer', function($mdDialog, GoBoxClient, Kind) {

    // Controller of the dialog
    function previewDialogCtrl($scope, $mdDialog, file, links) {
        
        $scope.file = file;
        $scope.links = links;
        
        $scope.close = function () {
            $mdDialog.hide();
        };
    }

    this.show = function(fileToShow, links) {
        // Create the dialog
        $mdDialog.show({
            templateUrl: 'components/previewer/previewdialog.html',
            controller: previewDialogCtrl,
            clickOutsideToClose: true,
            parent: angular.element(document.body),
            locals: {
                'file': fileToShow,
                'links': links
            }
        });
    };
    
});
