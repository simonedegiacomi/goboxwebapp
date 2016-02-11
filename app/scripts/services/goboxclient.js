'use strict';

/**
 * This is the official GoBox API Client. It offers some basic method that
 * allows you to get and upload files from/to the storage.
 * 
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.service('GoBoxClient', function($q, $cacheFactory, MyWS, GoBoxFile, Env) {

    this._lastState = 'notInitialized';
    this._caches = $cacheFactory('goboxclient');
    this._syncListeners = [];
    this._stateListeners = [];

    /**
     * Initialize the client oepning a new web socket connection to the server
     */
    this.init = function() {
        
        var self = this;

        if (self._lastState != 'notInitialized')
            return;

        // Now is in pending state
        self.notifyState('pending');

        // Save the auth object
        var auth = self._auth;

        // Open the socket connection
        var ws = self._ws = new MyWS(Env.ws);

        // Add on 'open' listener
        ws.on('open', function() {

            // Now in authentication state
            self.notifyState('authenticating');

            // Prepare the auth result listener
            ws.on('authentication', function(data) {
                if (data.result)
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
            ws.send('authentication', {
                token: auth.getToken()
            });
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
            
            // Update the cache
            self._caches.put(changedFile.getId(), changedFile);
            
            for (var i in syncListeners)
                syncListeners[i](changedFile, data.kind);
        });
    };

    this.addSyncListener = function(listener) {
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

    this.getAuth = function() {
        return this._auth;
    };

    this.setAuth = function(newAuth) {
        this._auth = newAuth;
    };

    this.logout = function() {
        this._auth.logout();
        delete this._auth;
        this._ws.send('goodbye', {
            invalidate: true
        });
    };

    /**
     * Add a listener for the incoming event from the storage
     */
    this.onStateChange = function(listener) {
        this._stateListeners.push(listener);
    };

    this.notifyState = function(state) {

        this.lastState = state;
        var listeners = this._stateListeners;
        for (var i in listeners)
            listeners[i](state);
    };

    this.getState = function() {
        return this._lastState;
    };

    this.getInfo = function(file) {

        var self = this;
        var future = $q.defer();
        var cacheVal = self._caches.get(file.getId());

        if (cacheVal != null) {
            future.resolve(cacheVal);
        } else {
            // Prepare the request object
            var req = {
                file: file,
                findPath: true,
                findChildren: true
            };
            
            self._ws.query('info', req).then(function(detailedFile) {

                // From the server i receive only a simple json, so let's wrap it
                // in a new GoBoxFile
                var wrappedFile = GoBoxFile.wrap(detailedFile);
                
                // Update the cache
                self._caches.put(wrappedFile.getId(), wrappedFile);
                
                future.resolve(wrappedFile);
            });
        }

        return future.promise;
    };

    this.search = function (kind, keyword) {
        var self = this;
        var future = $q.defer();
        self._ws.query('search', req).then(function(res) {
            
        });
        return future.promise;
    };

    this.createFolder = function(file) {
        var future = $q.defer();

        this._ws.query('createFolder', file).then(function(res) {
            if (res.created) {
                future.resolve();
            } else {
                future.reject();
            }
        });

        return future.promise;
    };

    /**
     * This function talk with the storage and remove the file
     * or directory.
     */
    this.remove = function(fileToRemove) {
        var self = this;
        var future = $q.defer();

        self._ws.query('removeFile', {
            file: fileToRemove
        }).then(function() {
            // Update the cache
            self._caches.remove(fileToRemove.getId());
            future.resolve();
        });

        return future.promise;
    };
    
    this.copy = function (file, destinationFather) {
        
    };
    
    this.cut = function (file, destinationFather) {
        
    };
    
    this.update = function () {
        
    };
});