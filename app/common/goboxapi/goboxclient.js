'use strict';

/**
 * This is the official GoBox API Client. It offers some basic method that
 * allows you to get and upload files from/to the storage.
 * 
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.service('GoBoxClient', function($http, $q, $cacheFactory, MyWS, GoBoxState, GoBoxFile, Env, GoBoxAuth, GoBoxMode, Upload) {

    // Last state of the client
    this._lastState = GoBoxState.NOT_INITIALIZED;

    // Listeners for the states
    this._stateListeners = [];

    // Queue of ws messages to send
    this._doQueue = [];

    // Caches of the files
    this._caches = $cacheFactory('goboxclient');

    // Uploads queue
    this._uploads = [];

    // The default mode is the bridge
    this._mode = GoBoxMode.BRIDGE;

    // When the client start, the base is the main server
    this._base = Env.base;

    var self = this;

    /**
     * Initialize the client oepning a new web socket connection to the server
     */
    this.init = function() {

        // If the client is inizialize or an initialization is already
        // running, return
        if (this._lastState == GoBoxState.READY || this._lastState == GoBoxState.PENDING)
            return;

        // Now is in pending state
        this.notifyState(GoBoxState.PENDING);

        // Open the socket connection
        var ws = self._ws = new MyWS(Env.ws);

        // Add on 'open' listener
        ws.on('open', function() {

            // Prepare the storag info listener
            ws.on('storageInfo', function(info) {
                self.notifyState(info.connected ? GoBoxState.READY : GoBoxState.NO_STORAGE);
            });
        });

        // Websocket closed
        ws.on('close', function() {
            self.notifyState('error');
        });

        // Websocket error
        ws.on('error', function() {
            self.notifyState('error');
        });

        // New storage event
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

        // Close the websocket
        this._ws.close();

        // Change the state of the client
        this.notifyState(GoBoxState.NOT_INITIALIZED);
    };

    // Switch to the direct connection.
    this.switch = function(mode) {
        
        // Prepare the promise
        var future = $q.defer();
        
        if (mode == GoBoxMode.BRIDGE) {
            
            // Set the default base url
            this._base = Env.Base;
            
            // And change the flag
            this._mode = mode;
            
            future.resolve();
            return future;
        }

        // Make the request to get the token and the address
        $http.get(Env.base + 'api/directConnection').then(function(response) {
            var data = response.data;
            
            // Create the address
            var finalAddress = mode == GoBoxMode.LOCAL ? data.localIP : data.publicIP;
            var finalPort = data.port;

            // Create the url
            var directBaseUrl = 'https://' + finalAddress + ':' + finalPort;

            // Prepare the request
            var req = {
                temporaryToken: data.temporaryToken
            };

            self._do(function() {
                
                // Make the requst
                $http({
                    url: directBaseUrl + '/directLogin',
                    data: req,
                    method: 'POST'
                }).then(function() {

                    // Wow, it works! change the flag
                    self._mode = mode;
                    
                    // And the download base url
                    self._base = directBaseUrl;

                    future.resolve(directBaseUrl);
                }, function(error) {

                    // Ops...
                    future.reject(directBaseUrl);
                });

            }, function() {

                future.reject('not found');
            });
        });
        return future.promise;
    };
    
    this.getConnectionMode = function () {
        if (this._lastState != GoBoxState.READY)
            return;
        return this._mode;
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

        if (!angular.isDefined(this._auth))
            this._auth = new GoBoxAuth();
        return this._auth;
    };

    this.setAuth = function(newAuth) {
        this._auth = newAuth;
    };

    /**
     * Close the ws connection and invalidate the session calling
     * the GoBoxAuth logout method
     */
    this.logout = function() {

        // Close the ws connection
        self._ws.close();

        // Invalidate the session
        self._auth.logout();

        // Delete the auth object
        delete self._auth;

        // Change the state of the client
        self.notifyState(GoBoxState.NOT_INITIALIZED);
    };

    /**
     * Disable a specific client session.
     * If you want to disable this session you should call the disconnect
     * method that also close the ws connection and change the state on the client
     */
    this.disableSession = function(sessionToDisable) {

        // Prepare the promise
        var future = $q.defer();

        // Make the request
        $http.post(Env.base + "api/user/delete_session", sessionToDisable).then(function() {

            future.resolve();
        }, function() {

            future.reject();
        });

        return future.promise;
    };

    /**
     * Get the list of active sessions
     */
    this.getSessions = function(sessionToDisable) {

        // Prepare the promise
        var future = $q.defer();

        // Make the request
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

        // Change the flag
        this._lastState = state;

        // Call all the listeners
        var listeners = this._stateListeners;
        for (var i in listeners)
            listeners[i](state);

        // If now the client is ready, send all the queued messages
        if (state == GoBoxState.READY)
            for (var i in this._doQueue)
                this._doQueue[i]();

        // Then empty the queue        
        this._doQueue.splice(0, this._doQueue.length);
    };

    /**
     * Return the state of this client
     */
    this.getState = function() {
        return this._lastState;
    };

    /**
     * Call the spicified function when the ws connection is estabilished.
     * If the client is not ready, the function will be queued
     */
    this._do = function(what) {

        // If the client is ready
        if (this._lastState == GoBoxState.READY) {

            // Call the function
            what();
            return;
        }

        // Otherwise queue the function
        this._doQueue.push(what);
    };

    /**
     * Get the information about the specified file. The parameter id the
     * id of the file
     */
    this.getInfo = function(fileId) {

        // Prepare the promise
        var future = $q.defer();

        // Get the cached value
        var cacheVal = self._caches.get(fileId);

        // If the cached value is present
        if (cacheVal != null) {

            // Return it
            future.resolve(cacheVal);
        }
        else {

            // Otherwise Prepare the request object
            var req = {
                file: {
                    ID: fileId
                },
                findPath: true,
                findChildren: true
            };

            // Queue or do the request
            self._do(function() {

                // Make the query
                self._ws.query('info', req).then(function(detailedFile) {

                    // Check if the storage has found the file
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

        // Prepare the promise
        var future = $q.defer();

        // Prepare the request
        var req = {
            kind: kind,
            keyword: keyword,
            from: start || 0,
            size: size || 50
        };

        self._do(function() {

            // Make the query
            self._ws.query('search', req).then(function(res) {

                if (res.error)
                    future.reject();
                else {

                    // Wrap all the found files
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
     * Get the list of the recent files
     */
    this.getRecentFiles = function(start, size) {

        // Prepare the promise
        var future = $q.defer();

        var req = {
            from: start || 0,
            size: size || 50
        };

        self._do(function() {

            self._ws.query('recent', req).then(function(res) {
                if (res.error)
                    future.reject();
                else {

                    // Wrap the files
                    return GoBoxFile.wrap(res.files);
                }
            });
        });
        return future.promise;
    };

    /**
     * Get the list of the deleted files
     */
    this.getTrashedFiles = function(start, size) {

        // Prepare the promise
        var future = $q.defer();

        var req = {
            from: start || 0,
            size: size || 50
        };

        self._ws.query('trashedFiles', req).then(function(res) {
            if (res.error)
                future.reject();
            else {

                // Wrap the files
                return GoBoxFile.wrap(res.files);
            }
        });

        return future.promise;
    };

    /**
     * Create a new folder. The file passed as argument must have
     * set the id of the father and the name of the new folder
     */
    this.createFolder = function(file) {
        var future = $q.defer();

        self._do(function() {
            
            var req = {
                father: {
                    ID: file.getFatherId()
                },
                name: file.getName()
            };

            // Make the query
            self._ws.query('createFolder', req).then(function(res) {
                if (res.created) {

                    // Invalidate the query of the father
                    self._caches.remove(file.getFatherID);

                    future.resolve();
                }
                else {
                    future.reject();
                }
            });
        });

        return future.promise;
    };

    /**
     * This function talk with the storage and remove the file
     * or directory. If it's a directory also all the children are removed
     */
    this.trash = function(fileToTrash) {

        // Prepare the promise
        var future = $q.defer();

        this._do(function() {

            // Make the query
            self._ws.query('trashFile', fileToTrash).then(function(res) {

                if (res.success) {

                    // Update the cache
                    self._caches.remove(fileToTrash.getId());

                    future.resolve();
                }
                else {

                    future.reject();
                }
            });
        });

        return future.promise;
    };

    /**
     * Delete thespecified file. If the file was in the trash, the file will be removed.
     * If the file wasn't in the trash the file is removed anyway, and cennot be recovered
     */
    this.delete = function(fileToDelete) {

        // Preprare the promise
        var future = $q.defer();

        self._do(function() {

            self._ws.query('delete', fileToDelete).then(function(response) {

                if (response.deleted) {

                    future.resolve();
                }
                else {

                    future.reject();
                }
            });
        });

        return future.promise;
    };

    /**
     * Empty the trash
     */
    this.emptyTrash = function() {

        // Prepare the promise
        var future = $q.defer();

        self._do(function() {

            // Make the query
            self._ws.query('emptyTrash').then(function(response) {

                if (response.success) {

                    future.resolve();
                }
                else {

                    future.reject();
                }
            });
        });

        return future.promise;
    };

    /**
     * Recover a trashed file
     */
    this.recover = function(fileToRecover) {

        // Prepare the promise
        var future = $q.defer();

        self._do(function() {

            self._ws.query('recover', fileToRecover).then(function(response) {

                if (response.success) {

                    future.resolve();
                }
                else {
                    future.reject();
                }
            });
        });

        return future.promise;
    };

    /**
     * Copy or cut the specified file.
     * If it's a directory this is applied also to his children
     */
    this.copyOrCut = function(file, newFather, cut) {

        // Prepare the promise
        var future = $q.defer();

        self._do(function() {

            // Make the query
            self._ws.query('copyOrCutFile', {

                // TODO: change in the storage
                file: file,
                newFather: newFather,
                cut: cut
            }).then(function(result) {

                if (result.success) {

                    // Update cache
                    self._caches.remove(newFather.id);

                    if (cut)
                        self._caches.remove(file.getFatherID());

                    future.resolve();
                }
                else {

                    future.reject();
                }
            });
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
     * Rename the specified file. Don't use this
     * to update the 'real' file.
     */
    this.rename = function(file, newName) {

        // Prepare the promise
        var future = $q.defer();

        // Prepare the query
        var query = {
            file: file,
            newName: newName
        };

        self._do(function() {
            self._ws.query('rename', query).then(function(res) {

                if (res.success) {

                    // Invalidate the caches
                    self._caches.remove(file.getId());

                    // And also the cache of the file
                    self._caches.remove(file.getFatherId());

                    future.resolve();
                }
                else
                    future.reject();
            });
        });

        return future.promise;
    };

    /**
     * Get the list of the shared files
     */
    this.getSharedFiles = function() {

        var future = $q.defer();

        self._do(function() {

            // Make the query
            self._ws.query('getSharedFiles').then(function(share) {

                future.resolve(GoBoxFile.wrap(share.files));
            });
        });

        return future.promise;
    };

    /**
     * Estimates the ping of the connection to the storage
     */
    this.ping = function() {

        // Prepare the promise
        var future = $q.defer();

        // Date whem the ping query was made
        var sentDate = new Date();

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

        return self._base + "api/transfer/fromStorage?ID=" + file.getId();
    };

    this.getPreviewLink = function(file) {

        return self.getDownloadLink(file) + "&preview=true";
    };

    /**
     * Share and return the public url of the file
     */
    this.share = function(file, unShare) {
        var future = $q.defer();

        var req = {
            share: angular.isDefined(unShare) ? unShare : true,
            id: file.getId()
        };

        self._do(function() {

            self._ws.query('share', req).then(function(res) {
                if (res.success)
                    future.resolve(res.link);
                else
                    future.reject();
            });
        });

        return future.promise;
    };

    this.unshare = function(file) {

        return this.share(file, false);
    };

    this.uploadFile = function(file, fatherId) {

        // Prepare the promise
        var future = $q.defer();

        // Create the logic representation of the new file
        var gbFile = new GoBoxFile(file.name);

        // Set his father id
        gbFile.setFatherId(fatherId);

        // And the other informations
        gbFile.setIsDirectory(false);
        gbFile.setMime(file.type);

        // Make the request
        Upload.http({

            // TODO: absoluty find a better way. Maybe chage the request to a multipart reuqest
            url: Env.base + 'api/transfer/toStorage?json=' + encodeURI(JSON.stringify(gbFile)),
            data: file
        }).then(function(response) {

            future.resolve();
        }, function(response) {

            future.reject();
        }, function(evt) {

            // Calculate the progress percentage
            var percentage = Math.min(100, parseInt(100.0 * evt.loaded / evt.total, 10));

            future.notify(percentage);
        });
        return future.promise;
    };
});