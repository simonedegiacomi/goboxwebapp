'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.Selection
 * @description
 * # Selection
 * Service in the goboxWebapp.
 */
angular.module('goboxWebapp')

.factory('Selection', function() {
    
    var Selection = function (path) {
        this._path = path;
    };
    
    Selection.prototype.setOpenFunction = function (func) {
        this._open = func;  
    };
    
    Selection.prototype.isSomethingSelected = function () {
        return this._selected != undefined;
    };
    
    Selection.prototype.select = function (file) {
        this._selected = file;
    };
    
    Selection.prototype.open = function (file) {
        this._open(file);
    };
    
    Selection.prototype.getSelectedFile = function () {
        return this._selected;
    };
    
    return Selection;
});