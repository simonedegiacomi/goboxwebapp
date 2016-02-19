'use strict';

/**
 * @ngdoc service
 * @name goboxWebapp.Previewer
 * @description
 * # Previewer
 * Service in the goboxWebapp.
 */
angular.module('goboxWebapp')

.service('Previewer', function($mdDialog) {
    
    var self = this;
    
    function previewDialogCtrl ($scope) {
        $scope.file = self.file;    
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
