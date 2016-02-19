'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')
    
.factory('GoBoxAuth', function($http, $q, $cookies, Env) {

    var GoBoxAuth = function() {
        // constructor
        this._valid = false;
    };

    GoBoxAuth.prototype.setUsername = function(username) {
        this._username = username;
    };

    GoBoxAuth.prototype.getUsername = function() {
        return this._username;
    };
        
    GoBoxAuth.prototype.setEmail = function(email) {
        this._email = email;
    };

    GoBoxAuth.prototype.getEmail = function() {
        return this.email;
    };

    GoBoxAuth.prototype.setPassword = function(password) {
        this._password = password;
    };

    GoBoxAuth.prototype.getPassword = function() {
        return this._password;
    };

    /**
     * Set the token and update the authorization http header.
     * If the old token was saved in a cookie, update it
     */
    GoBoxAuth.prototype.setToken = function(token) {
        this._token = token;
        setAuthHeader(token);
        if($cookies.get('gobox_keepLogged'))
            $cookies.put('gobox_token', token);
    };

    GoBoxAuth.prototype.getToken = function() {
        return this._token;
    };

    /**
     * Save the account informations ina  new cookie
     */
    GoBoxAuth.prototype.saveToCookie = function() {
        
        // Save the token
        $cookies.put('gobox_token', this._token);
        $cookies.put('gobox_username', this._username);
        // And a flag to save that the user want to stay logged
        $cookies.put('gobox_keepLogged', true);
    };
    
    GoBoxAuth.prototype.deleteCookie = function () {
        $cookies.remove('gobox_username');
        $cookies.remove('gobox_token');
    };

    /**
     * Load an existring session from the cookies and return a new
     * GoBoaAuth object
     */
    GoBoxAuth.loadFromCookie = function() {
        
        // Crate a new GoBoxAuth
        var auth = new GoBoxAuth();
        
        // Load informations from the cookie
        auth._token = $cookies.get('gobox_token');
        auth._username = $cookies.get('gobox_username');

        return auth;
    };

    GoBoxAuth.prototype.hasToken = function() {
        return angular.isDefined(this._token);
    };

    /**
     * Query the server and try to login. If the informations are correct
     * a new token is saved in this object. This function return a new promise.
     */
    GoBoxAuth.prototype.login = function() {
        
        // Create the new promise
        var future = $q.defer();

        // Create the request body
        var request = {
            username: this._username,
            password: this._password,
            type: 'C'
        };

        var self = this;

        // Make the http request
        $http.post(Env.base + 'api/user/login', request).then(function(response) {
            if (response.data.result == 'logged in') {
                self.setToken(response.data.token);
                self._valid = true;
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
        
        $cookies.remove('gobox_token');
        delete this._token;
        $cookies.remove('gobox_username');
        delete this._username;
        delete this._password;

        // Tell the server to invalidate the session
        $http.post(Env.base + 'api/user/logout');
    };

    /**
     * Create a new user
     */
    GoBoxAuth.prototype.register = function(reCaptcha) {
        
        // Create a ne wpromise
        var future = $q.defer();

        // Prepare the request body
        var request = {
            username: this._username,
            password: this._password,
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
     * Check if a session token is stil valid and get a new one.
     */
    GoBoxAuth.prototype.check = function() {
        var future = $q.defer();
            
        var authString = 'Bearer ' + this._token;

        var request = {
            method: 'POST',
            url: Env.base + '/api/user/check',
            headers: {
                'Authorization': authString
            }
        }
            
        var self = this;
            
        $http(request).then(function(response) {
            self._valid = true;
            self.setToken(response.data.newOne);
            future.resolve(true);
        }, function (error) {
            future.resolve(false);
            future.resolve(false);
        });

        return future.promise;
    };
        
    GoBoxAuth.existUser = function (username) {
            
        var future = $q.defer();
            
        var config = {
            params: {
                username: username
            }  
        };

        $http.get(Env.base + 'api/user/exist', config).then(function (response) {
            
            future.resolve(true);
        }, function (response) {
            future.resolve(false);
        });
        
        return future.promise;
    }
    
    GoBoxAuth.prototype.isValid = function () {
        return this._valid;
    };
        
    function setAuthHeader (token) {
        // TODO: set the header only for the APIs
        $http.defaults.headers.common.Authorization = 'Bearer ' + token;
    }
    
    GoBoxAuth.prototype.changePassword = function (old, newPassword) {
        return $http.post(Env.base + 'api/username/changePassword', {
            'old': old,
            'new': newP
        });
    };

    // Public API here
    return GoBoxAuth;
});