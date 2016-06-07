'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.controller('LoginCtrl', function(GoBoxAuth, Env, $state, $mdToast, $timeout) {

    // Load an hypotetical old session
    var auth = GoBoxAuth;

    this.state = 'welcome';
    
    var self = this;

    /**
     * Call this function to show the login or register card
     */
    this.show = function(nextState, user) {

        this.loading = true;

        // Check if the user exist or not
        GoBoxAuth.existUser(user.name).then(function(exist) {

            $timeout(function() {
                //Stop the spinner
                self.loading = false;

                // If it doesn't exist and the user want to log ...
                //if (!exist && nextState == 'login') {
                //    $mdToast.showSimple("Invalid Username");
                //}

                // If the account exist but the user want to create a new account ...
                if (exist && nextState == 'register') {
                    $mdToast.showSimple("Sorry, this username is not available");
                }

                // If the user existency is corret for the selected action
                else {
                    self.state = nextState;
                }
            });

        });
    };

    /**
     * Login contatting the server trough http
     */
    this.login = function(user, firstTime) {

        // Show loading spinner
        this.loading = true;

        // Prepare the auth object
        auth.setUsername(user.name);

        // Login using the API
        auth.login(user.password, user.keepLogged).then(function(logged) {
            //Stop the spinner
            self.loading = false;

            // Ok, logged.
            $state.go('loading', {
                first: firstTime
            });
        }, function(error) {

            // Mmm an error
            self.loading = false;

            // And the error
            $mdToast.showSimple("Sorry, wrong Username or Password");
        });
    };

    /**
     * Register with inserted information in the form
     */
    this.register = function(user) {

        // Show loading spinner
        this.loading = true;

        // Prepare auth object
        auth.setUsername(user.name);
        auth.setEmail(user.email);

        // Register
        auth.register(user.password, this.reCaptcha.response).then(function(registered) {

            // Registered, now login
            self.login(user, true);
        }, function(error) {

            self.loading = false;
            $mdToast.showSimple("Error, cannot register");
        });
    };

    this.reCaptcha = {
        setResponse: function(response) {
            self.reCaptcha.response = response;
        },
        expire: function() {
            self.reCaptcha.response = null;
        }
    };

    this.reset = function() {
        self.state = 'welcome';
    };
    
    this.getAvatar = function (user) {
        return Env.base + '/api/user/image/' + user.name;
    }
});