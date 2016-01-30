'use strict';

/**
 * 
 * Created by Degiacomi Simone on 27/01/2016
 */
angular.module('goboxWebapp')

.factory('GoBoxFile', function() {

    var GoBoxFile = function (name) {
        this.name = name;
        this._dummy = true;
    };
    
    GoBoxFile.wrap = function (json) {
        json.prototype = GoBoxFile.prototype;
        return json;
    };
    
    GoBoxFile.prototype.isDummy = function () {
        return this._dummy;
    };
    
    GoBoxFile.prototype.getId = function () {
        return this.id;
    };
    
    GoBoxFile.prototype.setId = function (id) {
        this._id = id;
    };
    
    GoBoxFile.prototype.getName = function () {
        return this.name;
    };
    
    GoBoxFile.prototype.setName = function (name) {
        this.name = name;
    };
    
    GoBoxFile.prototype.getChildren = function () {
        return this.children;  
    };
    
    GoBoxFile.prototype.setChildren = function (children) {
        this.children = children;  
    };
    
    GoBoxFile.prototype.setIsDirectory = function (value) {
        this.isDirectory = value;  
    };
    
    GoBoxFile.prototype.isDirectory = function () {
        if(!angular.isDefined(this.isDirectory))
            return false;
        return this.isDirectory;  
    };
    
    GoBoxFile.prototype.hasChild = function (child) {
        for(var i in this.children)
            if(this.children[i].id == child.id)
                return true;
        return false
    };
    
    return GoBoxFile;

});