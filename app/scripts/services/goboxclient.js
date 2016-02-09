'use strict';

/**
 * This is the official GoBox API Client. It offers some basic method that
 * allows you to get and upload files from/to the storage.
 * 
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.service('GoBoxClient', function($q, MyWS, GoBoxPath, GoBoxFile, Env) {
    
    this._syncListeners = [];
    this._stateListeners = [];
    this._lastState = 'notInitialized';
    
    /**
     * Initialize the client oepning a new web socket connection to the server
     */
    this.init = function() {
        
        if(this._lastState == 'pending')
            return;
        
        // Now is in pending state
        this.notifyState('pending');
        
        // Save the auth object
        var auth = this._auth;
        
        // Open the socket connection
        var ws = this._ws = new MyWS(Env.ws);
        
        var self = this;
        
        // Add on 'open' listener
        ws.on('open', function () {
            
            // Now in authentication state
            self.notifyState('authenticating');
            
            // Prepare the auth result listener
            ws.on('authentication', function(data) {
                if(data.result)
                    self.notifyState('authorized');
                else {
                    self._auth = null;
                    self.notifyState('unauthorized');
                }
            });
            
            // Prepare the storag info listener
            ws.on('storageInfo', function(info) {
                self.notifyState(info.connected ? 'ready' : 'noStorage');
            });
            
            // Send auth informations
            ws.send('authentication', { token: auth.getToken() });
        });
        
        ws.on('close', function() {
            self.notifyState('close');
            self.notifyState('notInitialized');
        });
        
        ws.on('error', function() {
            self.notifyState('error');
            self.notifyState('notInitialized');
        });
        
        var syncListeners = this._syncListeners;
        
        ws.on('syncEvent', function(data) {
            var changedFile = GoBoxFile.wrap(data.file);
            for(var i in syncListeners)
                syncListeners[i](changedFile, data.kind);
        });
    };
    
    this.addSyncListener = function (listener) {
        this._syncListeners.push(listener);
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
    
    this.setAuth = function (newAuth) {
        this._auth = newAuth;
    };
    
    this.logout = function () {
        this._auth.logout();
        delete this._auth;
        this._ws.send('goodbye', { invalidate: true });
    };
    
    /**
     * Add a listener for the incoming event from the storage
     */
    this.onStateChange = function (listener) {
        this._stateListeners.push(listener);
    };
    
    this.notifyState = function (state) {
        
        this.lastState = state;
        var listeners = this._stateListeners;
        for(var i in listeners)
            listeners[i](state);
    };
    
    this.getState = function () {
        return this._lastState;
    };
    
    this.addConnectionStateListener = function (callback) {
        this._stateListeners.push(callback);
    };
    
    
    this.getInfo = function (file, path, children) {
        
        var future = $q.defer();
        
        // Prepare the request object
        var req = {
            file: file,
            findPath: path,
            findChildren: children
        }
        
        this._ws.query('info', req).then( function(detailedFile) {
            
            // From the server i receive only a simple json, so let's wrap it
            // in a new GoBoxFile
            future.resolve(GoBoxFile.wrap(detailedFile));
        }, function () {
            future.reject();
        });
        
        return future.promise;
    };
    
    this.createFile = function(file) {
        var future = $q.defer();
        
        this._ws.query('createFolder', file).then(function(res) {
            if(res.created)
                future.resolve();
            else
                future.reject();
        }, function() {
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
});