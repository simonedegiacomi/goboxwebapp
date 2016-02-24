'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('LoginCtrl', function($scope, $state, $mdToast, GoBoxAuth, GoBoxClient) {

    // Show loading spinner
    $scope.state = 'loading';

    // TODO: find a better solution
    var form = $scope.form = {};

    // Load an hypotetical old session
    var auth = new GoBoxAuth();
    
    $scope.state = 'welcome';

    /**
     * Call this function to show the login or register card
     */
    $scope.show = function(nextState) {

        form.loading = true;

        // Check if the user exist or not
        GoBoxAuth.existUser(form.username).then(function(exist) {

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
        auth.setUsername(form.username);
        auth.setPassword(form.password);

        // Login using the API
        auth.login().then(function(logged) {
            //Stop the spinner
            form.loading = false;

            GoBoxClient.setAuth(auth);

            // Ok, logged.
            $state.go('home.files', {
                id: 1
            });
        }, function(error) {

            // Mmm an error
            form.loading = false;

            // And the error
            $mdToast.showSimple("Sorry, wrong Username or Password");
        });
    };

    /**
     * Register with inserted information in the form
     */
    $scope.register = function() {

        // Show loading spinner
        $scope.loading = true;

        // Prepare auth object
        auth.setUsername(form.username);
        auth.setPassword(form.password);
        auth.setEmail(form.email);

        var self = this;

        // Register
        auth.register(form.reCaptchaResponse).then(function(registered) {

            // Registered, now login
            self.login();
        }, function(error) {

            $scope.loading = false;
            $mdToast.showSimple("Sorry, there was a problem...");
        });
    };

    $scope.reCaptcha = {
        setResponse: function(response) {
            form.reCaptchaResponse = response;
        },
        expire: function() {
            form.reCaptchaResponseResponse = null;
        }
    };

    $scope.reset = function() {
        $scope.state = 'welcome';
    };
});