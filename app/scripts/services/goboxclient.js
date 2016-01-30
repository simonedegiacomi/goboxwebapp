'use strict';

/**
 * This is the official GoBox API Client. It offers some basic method that
 * allows you to get and upload files from/to the storage.
 * 
 * Created by Degiacomi Simone on 26/01/2016
 */
angular.module('goboxWebapp')

.service('GoBoxClient', function($q, MyWS, GoBoxPath, GoBoxFile, Env) {
    
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
    
    this.getAuth = function () {
        return this._auth;
    };
    
    this.logout = function () {
        this._auth.logout();
        delete this._auth;
        this._ws.send('goodbye', { invalidate: true });
    };
    
    /**
     * Add a listener for the incoming event from the storage
     */
    this.on = function (event, listener) {
        this._ws.on(event, listener);
    };
    
    /**
     * This method talk to the server and return a promise. When the promise
     * is resolved you'll have a new not-dummy GoBoxFile
     */
    this.listFile = function (file) {
        
        var future = $q.defer();
        
        this._ws.query('listFile', { father: file.getId() }).then( function(dir) {
            
            // From the server i receive only a simple json, so let's wrap it
            // in a new GoBoxFile
            future.resolve(GoBoxFile.wrap(dir));
        }, function () {
            future.reject();
        });
        
        return future.promise;
    };

    /**
     * This function talk with the storage and remove the file
     * or directory.
     */
    this.remove = function (fileToRemove) {
        var future = $q.defer();
        
        this._ws.query('removeFile', { file: fileToRemove }).then(function() {
            future.resolve(); 
        }, function () {
            future.reject();
        });
        
        return future.promise;
    };
    
    /**
     * Return an array of files. This array is the path to the file
     * passed as argument. If the file is a directory the children field
     * will also be populated
     */
    this.getAbsolutePath = function (file) {
        var future = $q.defer();
        
        this._ws.query('getPathToFile', { file: file }).then(function(path) {
            
            var wrappedFiles = [];
            
            for(var i in path)
                wrappedFiles[i] = GoBoxFile.wrap(path);
                
            future.resolve(wrappedFiles);
            
        }, function() {
            future.reject();
        });
        
        return future.promise;
    };

});