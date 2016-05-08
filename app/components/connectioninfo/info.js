angular.module('goboxWebapp')

.service('ConnectionInfoDialog', function(GoBoxClient, $mdDialog, $interval, $timeout) {

    // Promise returne from the show dialog method
    var promise;

    // Promise of the interval used to calculate the ping
    var intervalPromise;

    // Open the info connection dialog
    this.open = function($event) {

        // Check if the dialog is already open
        if (angular.isDefined(promise))
            return;

        // Create the dialog object
        var dialog = {
            controller: dialogCtrl,
            templateUrl: 'components/connectioninfo/info.html',
            targetEvent: $event,
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            onRemoving: function () {
                
                // Delete the promise so the dialog can be reopened
                promise = undefined;
                
                // If the interval is running
                if(angular.isDefined(intervalPromise)) {
                    
                    // Stop it
                    $interval.cancel(intervalPromise);
                    intervalPromise = undefined;
                }
            }
        };

        // Show the dialog
        promise = $mdDialog.show(dialog);

    };

    // Controller of the info dialog
    function dialogCtrl($scope) {
        
        // Attach to the scope the conn object
        $scope.conn = {
            
            ping: -1 // Ping not determined yet
        };
        
        // Set the interval to calculate the ping
        intervalPromise = $interval(function() {
            
            // Make the ping request
            GoBoxClient.ping().then(function(time) {
                
                // Update the conn object
                $timeout(function() {
                    
                    $scope.conn.ping = time;
                });
            });
        }, 1000);
        
        // Close the dialog
        $scope.close = function() {
            
            $mdDialog.hide();
        };
    }

});