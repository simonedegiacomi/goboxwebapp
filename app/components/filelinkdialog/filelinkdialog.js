angular.module('goboxWebapp')
.service('LinkDialog', function ($mdDialog, GoBoxClient) {
    
    this.show = function (file) {
        
        // Create the dialog
        var dialog = {
            controller: dialogCtrl,
            templateUrl: 'components/filelinkdialog/dialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                file: file
            }
        };
        
        $mdDialog.show(dialog);
    };
    
    
    function dialogCtrl ($scope, $mdDialog, file) {
        
        $scope.file = file;
        $scope.links = GoBoxClient.getLinks(file);
        
        $scope.close = function () {
            $mdDialog.hide();
        };

    }
});