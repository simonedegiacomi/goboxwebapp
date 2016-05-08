'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.factory('GoBoxAuth', function($http, $q, Env) {

    // constructor
    var GoBoxAuth = function() {
        this._valid = false;
    };

    GoBoxAuth.prototype.setUsername = function(username) {
        this.username = username;
    };

    GoBoxAuth.prototype.getUsername = function() {
        return this.username;
    };

    GoBoxAuth.prototype.setEmail = function(email) {
        this.email = email;
    };

    GoBoxAuth.prototype.getEmail = function() {
        return this.email;
    };

    /**
     * Query the server and try to login. If the informations are correct
     * a new token is saved in this object. This function return a new promise.
     */
    GoBoxAuth.prototype.login = function(password, keepLogged) {

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
        $http.post(Env.base + 'api/user/login', request).then(function(response) {

            if (response.data.result == 'logged in') {

                self._valid = true;
                self._id = response.data.id;
                future.resolve(true);
            }
            else {
                
                self._valid = false;
                future.reject(response.data.result);
            }
        }, function(error) {
            
            self._valid = false;
            future.reject(error.data);
        });

        // Return thre promise
        return future.promise;
    };

    /**
     * Delete any informations from this object and from the cookie. Then
     * tell invalidate the session.
     */
    GoBoxAuth.prototype.logout = function() {

        this._valid = false;
        delete this._token;
        delete this.username;
        delete this._password;

        // Tell the server to invalidate the session
        $http.post(Env.base + 'api/user/logout');
    };

    /**
     * Create a new user
     */
    GoBoxAuth.prototype.register = function(password, reCaptcha) {

        // Create a ne wpromise
        var future = $q.defer();

        // Prepare the request body
        var request = {
            username: this.username,
            password: password,
            email: this._email,
            reCaptcha: reCaptcha
        };

        // Make the request
        $http.post(Env.base + 'api/user/signup', request).then(function(response) {
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
    GoBoxAuth.prototype.isLogged = function() {
        
        // Prepare the promise
        var future = $q.defer();
        
        // If the auth is already verified
        if (this._valid) {
            
            // Resolve immediately the promise
            future.resolve(true);
            return future.promise;
        }

        // Prepare the request
        var request = {
            method: 'POST',
            url: Env.base + 'api/user/check'
        };

        var self = this;

        // Make the request
        $http(request).then(function(response) {
            
            self._valid = true;
            self.username = response.data.username;
            self._id = response.data.id;
            future.resolve(true);
        }, function(error) {
            
            future.resolve(false);
        });

        return future.promise;
    };

    /**
     * Check if a user with this name already exists
     */
    GoBoxAuth.existUser = function(username) {
        
        // Prepare the promise
        var future = $q.defer();

        // Prepare the request
        var config = {
            params: {
                username: username
            }
        };

        // Make the request
        $http.get(Env.base + 'api/user/exist', config).then(function(response) {

            future.resolve(response.data.exist);
        }, function(response) {
            
            future.resolve(false);
        });

        return future.promise;
    };

    /**
     * Change the password of the user
     */
    GoBoxAuth.prototype.changePassword = function(old, newPassword) {
        
        // Prepare the promise
        var future = $q.defer();
        
        // Make the request;
        $http.post(Env.base + 'api/user/changePassword', {
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
    return GoBoxAuth;
});