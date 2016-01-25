'use strict';

/**
 * 
 * Created by Degiacomi Simone on 25/01/2016
 */
angular.module('goboxWebapp')

.controller('LoginCtrl', function($scope, $state, $mdToast, GoBoxAuth, GoBoxClient) {

    // Show loading spinner
    $scope.state = 'loading';
    
    // TODO: find a better solution
    var form = $scope.form = { };

    // Load an hypotetical old session
    var auth = GoBoxAuth.loadFromCookie();

    // If there is an old session...
    if (auth.hasToken()) {

        // Check if is still valid
        auth.check().then(function(valid) {

            if (!valid) {

                // If it's not valid show the welcome  card
                $scope.state = 'welcome';
            }
            else {

                // If is still valid configure the API Client
                GoBoxClient.setAuth(auth);

                // and redirect to the home
                $state.go('home');
            }
        });

    }
    else {

        // Otherwise show the welcome card
        $scope.state = 'welcome';
    }


    /**
     * Call this function to show the login or register card
     */
    $scope.show = function(nextState) {
        
        form.loading = true;

        // Check if the user exist or not
        GoBoxAuth.existUser(form.username.str).then(function(exist) {
            
            //Stop the spinner
            form.loading = false;

            // If it doesn't exist and the user want to log ...
            if (!exist && nextState == 'login') {
                $mdToast.showSimple("Invalid Username");
            }

            // If the account exist but the user want to create a new account ...
            else if (exist && nextState == 'register') {
                $mdToast.showSimple("Sorry, this username is not available");
            }

            // If the user existency is corret for the selected action
            else
                $scope.state = nextState;
        });
    };

    /**
     * Login contatting the server trough http
     */
    $scope.login = function() {

        // Show loading spinner
        form.loading = true;

        // Prepare the auth object
        auth.setUsername(form.username.str);
        auth.setPassword(form.password.str);

        // Login using the API
        auth.login().then(function(logged) {
            //Stop the spinner
            form.loading = false;
            
            // If the user want to stay logged, save a new cookie
            if(form.keepLogged)
                auth.saveToCookie();
            
            // Ok, logged.
            $state.go('home');
        }, function(error) {
            
            // Mmm an error
            form.loading = false;
            
            // And the error
            $mdToast.showSimple("Sorry, wrong password");
        });
    };

    /**
     * Register with inserted information in the form
     */
    $scope.register = function() {
        
        // Show loading spinner
        $scope.loading = true;
        
        // Prepare auth object
        auth.setUsername(form.username.str);
        auth.setPassword(form.password.str);
        auth.setEmail(form.email.str);
        
        var self = this;
        
        // Register
        auth.register().then(function(registered) {
            
            // Registered, now login
            self.login();
            
        }, function(error) {
            
            $scope.loading = false;
            $mdToast.showSimple("Sorry, there was a problem...");
        });
    };
    
    $scope.reset = function () {
        $scope.state = 'welcome';  
    };

});