'use strict';

angular.module('goboxWebapp')

.controller('SettingsCtrl', function($scope, $mdToast, GoBoxClient, ToolbarManager, Upload, Env) {

    

    // This object contains the functions for the password change
    var password = $scope.password = {};

    password.change = function() {
        
        // Show loading spinner
        this.loading = true;
        
        // Use the api to change password
        GoBoxClient.getAuth().changePassword($scope.password.old, $scope.password.new).then(function() {
            
            $mdToast.showSimple("Password changed");
            $scope.password.loading = false;
        }, function() {
            
            $mdToast.showSimple("Sorry, can't change the password");
            $scope.password.loading = false;
        });
    };

    // Account function
    var account = $scope.account = {};

    // Get the available sessions
    GoBoxClient.getSessions().then(function(sessions) {
        $scope.account.sessions = sessions;
    });

    // Disable a session
    account.disableSession = function(session) {
        
        GoBoxClient.disableSession(session).then(function() {
            
            // Get the new sessions
            GoBoxClient.getSessions().then(function(sessions) {
                
                $scope.account.sessions = sessions;
            });
            
            // Show a simple toast
            $mdToast.showSimple("Session deleted");
        }, function (){
            
            $mdToast.showSimple("Error");
        });
    };

    // Profile image functions
    var image = $scope.image = {};

    // Upload the image
    image.uploadImage = function(croppedImage) {

        // Show the loading spinner
        image.loading = true;

        // Upload the image
        Upload.upload({
            url: Env.base + 'api/user/image/' + GoBoxClient.getAuth().getUsername(),
            data: {
                file:Upload.dataUrltoBlob(croppedImage, "profile_image")
            }
        }).then(function() {

            image.loading = false;
            image.file = undefined;
            $mdToast.showSimple("Image updated");
            location.reload();
        }, function() {

            image.loading = false;
            $mdToast.showSimple("Error");
        });
    };
});