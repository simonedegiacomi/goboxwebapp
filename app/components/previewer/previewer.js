'use strict';

/**
 * @ngdoc service
 * @name goboxWebapp.Previewer
 * @description
 * # Previewer
 * Service in the goboxWebapp.
 */
angular.module('goboxWebapp')

.service('Previewer', function($mdDialog, GoBoxClient, Kind) {
    
    var self = this;
    
    function previewDialogCtrl ($scope) {
        var file = self.file;
        $scope.preview = {
            file: file,
            type: Kind.fromFile(file),
            link: GoBoxClient.getDownloadLink(file)
        };
        
        $scope.close = function () {
            $mdDialog.hide();  
        };
    }
    
    var dialog = {
        templateUrl: 'views/preview.dialog.html',
        controller: previewDialogCtrl,
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        isOpen: false
    };

    this.show = function(fileToShow) {
        this.file = fileToShow;
        if (dialog.isOpen)
            this.close();
        $mdDialog.show(dialog);
        
    };

    this.close = function() {

    };
});
