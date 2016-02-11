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
    };

    Clipboard.prototype.singleClick = function(file, ctrl) {
        if (!ctrl)
            this._files = [];
        this._files.push(file);
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
        this._files = [];  
    };

    return Clipboard;
});