'use strict';

/**
 * This object is an helper to use with the GoBoxClient, because it
 * expones simple method and the concept of 'history path' to manage easily
 * the storage structure.
 * 
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.factory('GoBoxPath', function($q, GoBoxFile) {

    /**
     * Return a new GoBoxPath in the root position
     */
    var GoBoxPath = function(client) {

        this._client = client;

        var pwd = this.pwd = [];

        pwd.last = function() {
            return this[this.length > 0 ? (this.length - 1) : 0];
        };
        
        pwd.clear = function () {
            this.length = 0;
        };

        this._listeners = [];

        var self = this;

        client.addSyncListener(function(changedFile, syncType) {
            for (var i = 0; i < pwd.length; i++)
                if (changedFile.getFatherId() == pwd[i].getId()) {
                    switch (syncType) {
                        case 'NEW_FILE':
                            pwd[i].getChildren().push(changedFile);
                            break;
                        case 'REMOVE_FILE':

                            break;
                        default:
                            break;
                    }

                    if (i == pwd.length - 1)
                        self._notifyChange();
                    return;
                }
        });
    };
    
    GoBoxPath.prototype._notifyChange = function () {
        var changedDir = this.pwd.last();
        for (var i in this._listeners)
            this._listeners[i](changedDir);
    };

    GoBoxPath.prototype.addChangeListener = function(listener) {
        this._listeners.push(listener);
    };

    /**
     * 
     */
    GoBoxPath.prototype.cd = function(folder) {
        
        if (this.pwd.last() == folder) {
            this._notifyChange();
        } else {
            var knowPath = this.pwd.length > 0 && this.pwd.last().hasChild(folder);
            var self = this;
            this._client.getInfo(folder, !knowPath, true).then(function(detailedFolder){
                self.pwd.push(detailedFolder);
                self._notifyChange();
            })
        }
    };

    /**
     * 
     */
    GoBoxPath.prototype.ls = function() {
        return this.pwd.last().children;
    };

    /**
     * This function go one step back in the history. If this directory is the root
     * anything appen. This method doesn't return anything.
     */
    GoBoxPath.prototype.back = function() {

        if (this.pwd.length <= 0)
            return;

        this.pwd.pop();
        this._notifyChange();
    };


    GoBoxPath.prototype.addListener = function(newListener) {
        this._listeners.push(newListener);
    }

    /**
     * Remove a file or a directory
     */
    GoBoxPath.prototype.rm = function(file) {
        var future = $q.defer();

        this._client.remove(file).then(function() {
            future.resolve();
        }, function() {
            future.reject();
        });

        return future.promise;
    };

    /**
     * Create a new empty directory
     */
    GoBoxPath.prototype.mkdir = function(name) {
        var file = new GoBoxFile(name);
        console.log("father", this.pwd.last());
        file.setFatherId(this.pwd.last().getId());
        file.setIsDirectory(true);
        return this._createFile(file);
    };

    /**
     * Create a new empty file
     */
    GoBoxPath.prototype.touch = function(name) {
        var file = new GoBoxFile(name);
        file.isDirectory = false;
        return this._createFile(file);
    };

    /**
     * Tell the storage to create a new file. The argument
     * need to be a GoBoxFile.
     */
    GoBoxPath.prototype._createFile = function(file) {
        var future = $q.defer();

        this._client.createFile(file).then(function(filledFile) {
            future.resolve(filledFile);
        }, function() {
            future.reject();
        });

        return future.promise;
    };

    return GoBoxPath;
});