'use strict';

/**
 * @ngdoc service
 * @name goboxWebapp.clipboard
 * @description
 * # clipboard
 * Service in the goboxWebapp.
 */
angular.module('goboxWebapp')

.factory('Clipboard', function($q, GoBoxFile) {
    
    var Clipboard = function() {
        this._files = [];
        this._holdFiles = [];
    };

    Clipboard.prototype.singleClick = function(file, ctrl) {
        if (!ctrl)
            this.clear();
        this._files.push(file);
        file.selected = true;
    };

    Clipboard.prototype.doubleClick = function(file) {
        this._open(file);
    };
    
    Clipboard.prototype.setOpenAction = function (action) {
        this._open = action;
    };
    
    Clipboard.prototype.getSelectedFiles = function () {
        return this._files;
    };
    
    Clipboard.prototype.clear = function () {
        var self = this;
        for(var i in self._files)
            self._files[i].selected = false;
        self._files = [];  
    };
    
    Clipboard.prototype.holdState = function (state) {
        this._state = state;
        for(var i in this._files)
            this._files[i].selected = false;
        this._holdFiles = this._files;
        this._files = [];
    };
    
    Clipboard.prototype.getState = function () {
        return this._state;
    };
    
    Clipboard.prototype.clearState = function () {
        this._holdFiles = [];
        this._state = null;
    };
    
    Clipboard.prototype.getHoldFiles = function () {
        return this._holdFiles;
    };

    return Clipboard;
});