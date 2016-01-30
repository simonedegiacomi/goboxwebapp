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
     * Return a new GoBoxPath in the root position
     */
    var GoBoxPath = function(client) {
        
        this._client = client;
        
        var root = new GoBoxFile('Root');
        root.setId(0);
        
        this._history = [ root ];

        this._history.last = function() {
            if (this.length > 0)
                return this[this.length - 1];
        };

        this._listeners = [];
    };

    /**
     * Change the folder passing the id of the next folder.
     * If the next directory is not a son of this directory, the 'reach' method
     * will be called. When the directory is changed the event histsory changed
     * will be fired
     */
    GoBoxPath.prototype.cd = function(folder) {
        if(this._history.length > 0 && this._history.last().hasChild(folder)) {
            this._history.push(folder);
            this._historyChanged();
            return ;
        }
        
        this.reach(folder).then(function () {
            this._historyChanged();
        });
    };
    
    /**
     * Change the position without firing the history change event.
     * You should call this method when the directory you want to enter
     * is not a direct son of this directory, otherwise just call the 'cd'
     * method to have better performance
     */
    GoBoxPath.prototype.reach = function (folder) {
        var future = $q.defer();
        var self = this;
        this._client.getAbsolutePath(folder).then(function(filesArray){
            self._history = filesArray;
            future.resolve();
        }, function () {
            future.reject();
        });
        return future.promise;
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

            this._client.listFile(history.last()).then(function(dir) {
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

    /**
     * This method calls the listeners of the path
     * 
     */
    GoBoxPath.prototype._historyChanged = function() {
        for (var i in this._listeners)
            this._listeners[i]();
    };

    GoBoxPath.prototype.addListener = function(newListener) {
        this._listeners.push(newListener);
    }
    
    /**
     * Remove a file or a directory
     */
    GoBoxPath.prototype.rm = function(file) {
        var future = $q.defer();
        
        this._client.remove(file).then(function(){
            future.resolve();
        }, function() {
            future.reject();
        });

        return future.promise;
    };

    /**
     * Create a new empty directory
     */
    GoBoxPath.prototype.mkDir = function(name) {
        var file = new GoBoxFile(name);
        file.isDirectory = true;
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
    GoBoxPath.prototype._createFile = function (file) {
        var future = $q.defer();
        
        this._client.createFile(file).then(function(filledFile) {
            future.resolve(filledFile);
        }, function () {
            future.reject();
        });

        return future.promise;
    };

    return GoBoxPath;
});