'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.factory('GoBoxAuth', function($http, $q) {

    var valid = false;
    
    this.username = undefined;
    this.id = undefined;
    this.email = undefined;
    this.token = undefined;

    this.setUsername = function(username) {
        this.username = username;
    };

    this.getUsername = function() {
        return this.username;
    };

    this.setEmail = function(email) {
        this.email = email;
    };

    this.getEmail = function() {
        return this.email;
    };

    /**
     * Query the server and try to login. If the informations are correct
     * a new token is saved in this object. This function return a new promise.
     */
    this.login = function(password, keepLogged) {

        // Create the new promise
        var future = $q.defer();

        // Create the request body
        var request = {
            username: this.username,
            password: password,
            type: 'C',
            keepLogged: keepLogged | false,
            cookie: true
        };

        var self = this;

        // Make the http request
        $http.post('/api/user/login', request).then(function(response) {

            if (response.data.result == 'logged in') {

                valid = true;
                self.id = response.data.id;
                future.resolve(true);
            }
            else {
                
                valid = false;
                future.reject(response.data.result);
            }
        }, function(error) {
            
            valid = false;
            future.reject(error.data);
        });

        // Return thre promise
        return future.promise;
    };

    /**
     * Delete any informations from this object and from the cookie. Then
     * tell invalidate the session.
     */
    this.logout = function() {

        valid = false;
        this.token = undefined;
        this.username = undefined;

        // Tell the server to invalidate the session
        $http.post('/api/user/logout');
    };

    /**
     * Create a new user
     */
    this.register = function(password, reCaptcha) {

        // Create a ne wpromise
        var future = $q.defer();

        // Prepare the request body
        var request = {
            username: this.username,
            password: password,
            email: this.email,
            reCaptcha: reCaptcha
        };

        // Make the request
        $http.post('/api/user/signup', request).then(function(response) {
            future.resolve(true);
        }, function(error) {
            future.reject(error.data);
        });

        // Return the promise
        return future.promise;
    };

    /**
     * Check if a the session is still valid
     */
    this.isLogged = function() {
        
        // Prepare the promise
        var future = $q.defer();
        
        // If the auth is already verified
        if (valid) {
            
            // Resolve immediately the promise
            future.resolve(true);
            return future.promise;
        }

        // Prepare the request
        var request = {
            method: 'POST',
            url: '/api/user/check'
        };

        var self = this;

        // Make the request
        $http(request).then(function(response) {
            
            valid = true;
            self.username = response.data.username;
            self.id = response.data.id;
            future.resolve(true);
        }, function(error) {
            
            future.resolve(false);
        });

        return future.promise;
    };

    /**
     * Check if a user with this name already exists
     */
    this.existUser = function(username) {
        
        // Change valid flag
        valid = false;
        
        // Prepare the promise
        var future = $q.defer();

        // Prepare the request
        var config = {
            params: {
                username: username
            }
        };

        // Make the request
        $http.get('/api/user/exist', config).then(function(response) {

            future.resolve(response.data.exist);
        }, function(response) {
            
            future.resolve(false);
        });

        return future.promise;
    };

    /**
     * Change the password of the user
     */
    this.changePassword = function(old, newPassword) {
        
        // Prepare the promise
        var future = $q.defer();
        
        // Make the request;
        $http.post('/api/user/changePassword', {
            'old': old,
            'new': newPassword
        }).then(function(response) {
            
            future.resolve();
        }, function(error) {
            
            future.reject();
        });
        
        return future.promise;
    };

    // Return the API Object
    return this;
});