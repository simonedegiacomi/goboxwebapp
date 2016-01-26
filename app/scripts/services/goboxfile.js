'use strict';

/**
 * 
 * Created by Degiacomi Simone on 27/01/2016
 */
angular.module('goboxWebapp')

.factory('GoBoxFile', function() {

    var GoBoxFile = function (json) {
        
    };
    
    GoBoxFile.prototype.getName = function () {
        return this._name;
    };
    
    GoBoxFile.prototype.getId = function () {
        return this._id;
    };
    
    GoBoxFile.prototype.setId = function (id) {
        this._id = id;
    };
    
    GoBoxFile.prototype.isDummy = function () {
        return this._dummy;
    };
    
    return GoBoxFile;

});