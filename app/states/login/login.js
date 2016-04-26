'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('LoginCtrl', function(GoBoxAuth, $scope, $state, $mdToast, $timeout, GoBoxClient) {

    // Load an hypotetical old session
    var auth = GoBoxClient.getAuth();

    $scope.state = 'welcome';

    /**
     * Call this function to show the login or register card
     */
    $scope.show = function(nextState, user) {

        $scope.loading = true;

        $scope.name = user.name;

        // Check if the user exist or not
        GoBoxAuth.existUser(user.name).then(function(exist) {

            $timeout(function() {
                //Stop the spinner
                $scope.loading = false;

                // If it doesn't exist and the user want to log ...
                //if (!exist && nextState == 'login') {
                //    $mdToast.showSimple("Invalid Username");
                //}

                // If the account exist but the user want to create a new account ...
                if (exist && nextState == 'register') {
                    $mdToast.showSimple("Sorry, this username is not available");
                }

                // If the user existency is corret for the selected action
                else
                    $scope.state = nextState;
            });

        });
    };

    /**
     * Login contatting the server trough http
     */
    $scope.login = function(user) {

        // Show loading spinner
        $scope.loading = true;

        // Prepare the auth object
        auth.setUsername(user.name);
        auth.setPassword(user.password);

        // Login using the API
        auth.login().then(function(logged) {
            //Stop the spinner
            $scope.loading = false;

            // Ok, logged.
            $state.go('home.files', {
                id: 1
            });
        }, function(error) {

            // Mmm an error
            $scope.loading = false;

            // And the error
            $mdToast.showSimple("Sorry, wrong Username or Password");
        });
    };

    /**
     * Register with inserted information in the form
     */
    $scope.register = function(user) {

        // Show loading spinner
        $scope.loading = true;

        // Prepare auth object
        auth.setUsername(user.name);
        auth.setPassword(user.password);
        auth.setEmail(user.email);

        var self = this;

        // Register
        auth.register($scope.reCaptcha.response).then(function(registered) {

            // Registered, now login
            self.login(user);
        }, function(error) {

            $scope.loading = false;
            $mdToast.showSimple(error.data);
        });
    };

    $scope.reCaptcha = {
        setResponse: function(response) {
            $scope.reCaptcha.response = response;
        },
        expire: function() {
            $scope.reCaptcha.response = null;
        }
    };

    $scope.reset = function() {
        $scope.state = 'welcome';
    };
});