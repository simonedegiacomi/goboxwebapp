'use strict';

/**
 * @ngdoc service
 * @name goboxWebapp.servicee:GoBoxClient
 * @description
 * This is the official GoBox API Client. It offers some basic method that
 * allows you to get and upload files from/to the storage.
 * 
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.service('GoBoxClient', function($http, $q, $cacheFactory, MyWS, GoBoxFile, Env, GoBoxAuth) {

    // Last state of the client
    this._lastState = 'notInitialized';
    
    // Listeners for the states
    this._stateListeners = [];

    // Queue of ws messages to send
    this._doQueue = [];

    // Caches of the files
    this._caches = $cacheFactory('goboxclient');
    
    var self = this;

    /**
     * Initialize the client oepning a new web socket connection to the server
     */
    this.init = function() {
        // If the client is inizialize or an initialization is already
        // running, return
        if (this._lastState == 'ready' || this._lastState == 'pending')
            return;

        // Now is in pending state
        this.notifyState('pending');

        // Open the socket connection
        var ws = self._ws = new MyWS(Env.ws);

        // Add on 'open' listener
        ws.on('open', function() {

            // Prepare the auth result listener
            ws.on('authentication', function(data) {

                if (!data.result) {
                    // The connection is not authorized, so remove auth
                    self._auth = null;
                    // And change state
                    self.notifyState('error');
                }
            });

            // Prepare the storag info listener
            ws.on('storageInfo', function(info) {
                self.notifyState(info.connected ? 'ready' : 'noStorage');
            });
        });

        ws.on('close', function() {
            self.notifyState('error');
        });

        ws.on('error', function() {
            self.notifyState('error');
        });

        ws.on('syncEvent', function(data) {
            // Wrap the changed file
            var changedFile = GoBoxFile.wrap(data.file);

            // Invalidate the cache
            self._caches.remove(changedFile.getId(), changedFile);
            
            // Invalidate also the cache of the father
            self._caches.remove(changedFile.getFatherId(), changedFile);

            // Call the sync listener
            self._syncListener(changedFile, data.kind);
        });
    };

    /**
     * Reinitialize the client object
     */
    this.reset = function() {
        self.ws.close();
        self.notifyState('notInitialized');
    };

    /**
     * Set the sync event listener
     */
    this.setSyncListener = function(listener) {
        this._syncListener = listener;
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
        if(!angular.isDefined(this._auth))
            this._auth = new GoBoxAuth();
        return this._auth;
    };

    this.setAuth = function(newAuth) {
        this._auth = newAuth;
    };

    /**
     * Close the ws connection
     */
    this.logout = function() {
        self._auth.logout();
        delete self._auth;
        self._ws.close();
    };

    /**
     * Disable a specific client session
     */
    this.disableSession = function(sessionToDisable) {
        return $http.delete(Env.base + "api/user/session", sessionToDisable);
    };

    /**
     * Get the list of active sessions
     */
    this.getSessions = function(sessionToDisable) {
        var future = $q.defer();

        $http.get(Env.base + "api/user/sessions", sessionToDisable).then(function(response) {
            future.resolve(response.data);
        }, function() {
            future.reject();
        });

        return future.promise;
    };

    /**
     * Add a listener for the incoming event from the storage
     */
    this.onStateChange = function(listener) {
        this._stateListeners.push(listener);
    };

    /**
     * Notify a new state of this client
     */
    this.notifyState = function(state) {
        this._lastState = state;
        var listeners = this._stateListeners;
        for (var i in listeners)
            listeners[i](state);
        if (state == 'ready')
            for (var i in this._doQueue)
                this._doQueue[i]();
    };

    /**
     * Return the state of this client
     */
    this.getState = function() {
        return this._lastState;
    };

    /**
     * Call the spicified function when the ws connection is estabilishedt
     */
    this._do = function(what) {
        if (this._lastState == 'ready')
            what();
        this._doQueue.push(what);
    };

    /**
     * Get the information about the specified file
     */
    this.getInfo = function(file) {

        var future = $q.defer();
        var cacheVal = self._caches.get(file.getId());

        if (cacheVal != null) {
            future.resolve(cacheVal);
        }
        else {
            // Prepare the request object
            var req = {
                file: file,
                findPath: true,
                findChildren: true
            };
            self._do(function() {
                self._ws.query('info', req).then(function(detailedFile) {

                    if (!detailedFile.found) {
                        future.reject();
                        return;
                    }

                    // From the server i receive only a simple json, so let's wrap it
                    // in a new GoBoxFile
                    var wrappedFile = GoBoxFile.wrap(detailedFile.file);

                    // Update the cache
                    self._caches.put(wrappedFile.getId(), wrappedFile);

                    future.resolve(wrappedFile);
                });
            });
        }

        return future.promise;
    };

    /**
     * Return a list of file, searching by name and filtering by kind
     */
    this.search = function(keyword, kind, start, size) {
        var future = $q.defer();
        var req = {
            kind: kind,
            keyword: keyword,
            from: start ? start : 0,
            size: size ? size : 0
        };

        self._do(function() {
            self._ws.query('search', req).then(function(res) {
                if (res.error)
                    future.reject();
                else {
                    var wrapped = [];
                    for (var i in res.result)
                        wrapped[i] = GoBoxFile.wrap(res.result[i]);
                    future.resolve(wrapped);
                }
            });
        });

        return future.promise;
    };

    /**
     * Create a new folder. The file passed as argument must have
     * set the id of the father and the name of the new folder
     */
    this.createFolder = function(file) {
        var future = $q.defer();

        self._ws.query('createFolder', file).then(function(res) {
            if (res.created) {
                future.resolve();
            }
            else {
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

        self._ws.query('removeFile', fileToRemove).then(function(res) {
            if (res.success) {
                // Update the cache
                self._caches.remove(fileToRemove.getId());
                future.resolve();
            }
            else {
                future.reject();
            }
        });

        return future.promise;
    };

    /**
     * Copy or cut the specified file
     */
    this.copyOrCut = function(file, destinationFile, cut) {
        var self = this;
        var future = $q.defer();

        self._ws.query('copyOrCutFile', {
            file: file,
            destination: destinationFile,
            cut: cut
        }).then(function(result) {
            if (result.success) {
                // Update cache
                self._caches.remove(destinationFile.getId());
                if (cut)
                    self._caches.remove(file.getFatherID());
                future.resolve();
            }
            else {
                future.reject();
            }
        });

        return future.promise;
    };

    /**
     * Copy the file in the specified destination. This function call
     * the copyOrCut method
     */
    this.copy = function(file, destinationFatherID) {
        return this.copyOrCut(file, destinationFatherID, false);
    };

    /**
     * Cut the file in the specified destination. This function call
     * the copyOrCut method
     */
    this.cut = function(file, destinationFatherID) {
        return this.copyOrCut(file, destinationFatherID, true);
    };

    /**
     * Update the information of the specified file. Don't use this
     * to update the 'real' file.
    this.update = function(file) {
        var future = $q.defer();
        self._ws.query('update', file).then(function(res) {
            if (res.success)
                future.resolve();
            else
                future.reject();
        });
        return future;
    };

    /**
     * Get the list of the shared files
     */
    this.getSharedFiles = function() {
        var future = $q.defer();
        self._do(function() {
            self._ws.query('getSharedFiles').then(function(share) {
                future.resolve(share.files);
            });
        });
        return future.promise;
    };
    
    /**
     * Estimates the ping of the connection to the storage
     */
    this.ping = function() {
        var sentDate = new Date();
        var future = $q.defer();
        self._do(function() {
            self._ws.query('ping').then(function() {
                future.resolve(new Date().getTime() - sentDate.getTime());
            });
        });
        return future.promise;
    };
    
    /**
     * Get the private download link
     */
    this.getDownloadLink = function(file) {
        return Env.base + "api/transfer/fromStorage?ID=" + file.getId();
    };

    /**
     * Share and return the public url of the file
     */
    this.share = function(file, unShare) {
        var future = $q.defer();

        var req = {
            share: angular.isDefined(unShare) ? unShare : true,
            file: file
        };

        self._do(function() {
            self._ws.query('share', req).then(function(res) {
                if(res.success)
                    future.resolve(res.link);
                else
                    future.reject();
            });
        });

        return future.promise;
    };
});