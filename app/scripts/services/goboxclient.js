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

.service('GoBoxClient', function($q, $cacheFactory, MyWS, GoBoxFile, Env) {

    // Last state of the client
    this._lastState = 'notInitialized';
    // Caches of the files
    this._caches = $cacheFactory('goboxclient');
    // Listeners for the states
    this._stateListeners = [];

    this._doQueue = [];

    /**
     * Initialize the client oepning a new web socket connection to the server
     */
    this.init = function() {
        var self = this;

        // If the client is inizialize or an initialization is already
        // running, return
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
            self.notifyState('error');
        });

        ws.on('error', function() {
            self.notifyState('error');
        });


        ws.on('syncEvent', function(data) {
            var changedFile = GoBoxFile.wrap(data.file);

            // Invalidate the cache
            self._caches.remove(changedFile.getId(), changedFile);
            // Invalidate also the father
            self._caches.remove(changedFile.getFatherId(), changedFile);

            self._syncListener(changedFile, data.kind);
        });
    };

    this.reset = function() {
        this.notifyState('notInitialized');
    };

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
        this._lastState = state;
        var listeners = this._stateListeners;
        for (var i in listeners)
            listeners[i](state);
        if (state == 'ready')
            for (var i in this._doQueue)
                this._doQueue[i]();
    };

    this.getState = function() {
        return this._lastState;
    };

    this._do = function(what) {
        if (this._lastState == 'ready')
            what();
        this._doQueue.push(what);
    };

    this.getInfo = function(file) {

        var self = this;
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

    this.search = function(kind, keyword, start, size) {
        var self = this;
        var future = $q.defer();
        var req = {
            kind: kind,
            keyword: keyword,
            from: start ? 0 : start,
            size: size ? 50 : size
        };

        this._do(function() {
            self._ws.query('search', req).then(function(res) {
                future.resolve(res.files);
            });
        });

        return future.promise;
    };

    this.createFolder = function(file) {
        var future = $q.defer();

        this._ws.query('createFolder', file).then(function(res) {
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
        })

        return future.promise;
    }

    this.copy = function(file, destinationFatherID) {
        return this.copyOrCut(file, destinationFatherID, false);
    };

    this.cut = function(file, destinationFatherID) {
        return this.copyOrCut(file, destinationFatherID, true);
    };

    this.update = function(file) {
        var self = this;
        var future = $q.defer();
        self._ws.query('update', file).then(function(res) {
            if (res.success)
                future.resolve();
            else
                future.reject();
        });
        return future;
    };
});