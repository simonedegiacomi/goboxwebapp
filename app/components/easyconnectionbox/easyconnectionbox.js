angular.module('goboxWebapp')

.directive('easyConnectionBox', function ($mdToast, $mdDialog, GoBoxClient) {
    
    
    function boxCtrl ($scope) {
        
        $scope.mode = GoBoxClient.getConnectionMode();
        
        $scope.switchTo = function (mode) {
            
            GoBoxClient.switch(mode).then(function () {
                
                $scope.mode = GoBoxClient.getConnectionMode();
                $mdToast.showSimple("Switched to " + mode + "!");
            }, function (address) {
                
                // Show the dialog
                $mdDialog.show({
                    templateUrl: 'components/easyconnectionbox/switchdialog.html',
                    controller: ErrDialogCtrl,
                    locals: {
                        url: address + '/test'
                    }
                }).then(function () {
                    
                    $scope.switchTo(mode);
                });
            });
        };
    }
    
    function ErrDialogCtrl ($window, $scope, $mdDialog, url) {
        
        $scope.open = function () {
            $window.open(url, '_blank');
        };
        
        $scope.done = function () {
            $mdDialog.hide();
        };
        
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }
    
    // Return the object that describes the directive
    return {
        templateUrl: 'components/easyconnectionbox/box.html',
        restricted: 'E',
        controller: boxCtrl
    };
});