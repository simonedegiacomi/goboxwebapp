'use strict';

/**
 * This is the official GoBox API Client. It offers some basic method that
 * allows you to get and upload files from/to the storage.
 * 
 * Created by Degiacomi Simone on 26/01/2016
 */
angular.module('goboxWebapp')

.service('GoBoxClient', function($q, MyWS, GoBoxPath, Env) {
    
    /**
     * Initialize the client oepning a new web socket connection to the server
     */
    this.init = function(auth) {
        
        // Save the auth object
        this._auth = auth;
        
        // Open the socket connection
        var ws = this._ws = new MyWS(Env.ws);
        
        ws.on('open', function () {
            
           // Send auth informations 
           ws.send('authentication', { token: auth.getToken() });
        });
    };

    /**
     * Return if the client is initialized wit the auth object
     */
    this.isLogged = function() {
        
        // If the auth is setted, check if is valid
        if (angular.isDefined(this._auth))
            return this._auth.isValid();

        return false;
    };
    
    this.logout = function () {
        this._auth.logout();
        delete this._auth;
        this._ws.send('goodbye', { invalidate: true });
        
    };
    
    this.on = function (event, listener) {
        this._ws.on(event, listener);
    };
    
    /**
     * This method talk to the server and return a promise. When the promise
     * is resolved you'll have a new not-dummy GoBoxFile
     */
    this.listFile = function (id) {
        
        var future = $q();
        
        this._ws.query('listFile', { father: id }).then( function(dir) {
            
            // From the server i receive only a simple json, so let's wrap it
            // in a new GoBoxFile
            future.resolve(new GoBoxFile.wrap(dir));
        }, function (error) {
            future.reject();
        });
        
        return future.promise;
    };

});