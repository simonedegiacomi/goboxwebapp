'use strict';

/**
 * This object is an helper to use with the GoBoxClient, because it
 * expones simple method and the concept of 'history path' to manage easily
 * the storage structure.
 * 
 * Created by Degiacomi Simone in 26/01/2016
 */
angular.module('goboxWebapp')

.factory('GoBoxPath', function($q, GoBoxFile) {

    /**
     * Returna  new GoBoxPath in the root position
     */
    var GoBoxPath = function(client) {
        
        this._client = client;
        this._history = [];

        this._history.last = function() {
            if (this.length > 0)
                return this[this.length - 1];
        };

        this._listeners = [];
    };

    /**
     * Change the folder passing the id of the next folder.
     * This method doesn't return anything and doesn't make any query to the server
     */
    GoBoxPath.prototype.cd = function(folder) {

        this._history.push(folder);
        this._historyChanged();
    };

    /**
     * Return a new promise that will be resolved with the GoBoxFile[]
     * of this folder. The children of this folder are on the resolved file.
     * If the method was called before, a cached value will be returned.
     */
    GoBoxPath.prototype.ls = function() {
        var future = $q.defer();

        var history = this._history;
        
        if (!history.last().isDummy()) {
            
            future.resolve(history.last());
        } else {

            this._client.listFile(history.last().getId()).then(function(dir) {
                history[history.length - 1] = dir;
                
                future.resolve(dir);
                
            }, function (error) {
                future.resolve([]);
            });
        }

        return future.promise;
    };

    /**
     * This function go one step back in the history. If this directory is the root
     * anything appen. This method doesn't return anything.
     */ 
    GoBoxPath.prototype.back = function() {

        if (this._history.length <= 0)
            return;
        
        this._history.pop();
        this._historyChanged();
    };

    GoBoxPath.prototype._historyChanged = function() {
        for (var i in this._listeners)
            this._listeners[i]();
    };

    GoBoxPath.prototype.addListener = function(newListener) {
        this._listeners.push(newListener);
    }

    GoBoxPath.prototype.rename = function() {
        var future = $q.defer();

        return future.promise;
    };

    GoBoxPath.prototype.rm = function() {
        var future = $q.defer();

        return future.promise;
    };

    GoBoxPath.prototype.mkDir = function() {
        var future = $q.defer();

        return future.promise;
    };

    GoBoxPath.prototype.touch = function() {
        var future = $q.defer();

        return future.promise;
    };

    return GoBoxPath;

});