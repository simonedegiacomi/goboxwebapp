'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.factory('GoBoxFile', function() {

    var GoBoxFile = function (name) {
        this.name = name;
    };
    
    GoBoxFile.wrap = function (json) {
        
        if (json instanceof Array) {
            var wrapped = [];
            for (var i in json)
                wrapped[i] = GoBoxFile.wrap(json[i]);
            return wrapped;
        }
        
        // Create a new GoBoxFile
        var file = new GoBoxFile();
        
        // Copy every key
        for(var key in json)
            file[key] = json[key];
            
        // Wrap the path
        if(angular.isDefined(json.path))
            for(var i in json.path)
                file.path[i] = GoBoxFile.wrap(json.path[i]);
            
        // Finally wrap also his children
        if(angular.isDefined(json.children))
            for(var i in json.children)
                file.children[i] = GoBoxFile.wrap(json.children[i]);
                
        return file;
    };
    
    GoBoxFile.prototype.getId = function () {
        return this.ID;
    };
    
    GoBoxFile.prototype.setId = function (id) {
        this.ID = id;
    };
    
    GoBoxFile.prototype.getPath = function () {
        
        if(this._cachedPath == undefined) {
            
            // Angular loop reason
            var temp = this._cachedPath = [];
            Array.prototype.push.apply(temp, this.path);
            temp.push(this);
        }
        return this._cachedPath;
    };
    
    GoBoxFile.prototype.getFatherId = function () {
        return this.fatherID;
    };
    
    GoBoxFile.prototype.setFatherId = function (id) {
        this.fatherID = id;
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
    
    GoBoxFile.prototype.hasChild = function (child) {
        for(var i in this.children)
            if(this.children[i].ID == child.ID)
                return true;
        return false;
    };
    
    GoBoxFile.prototype.setMime = function (typeOfFile) {
        this.mime = typeOfFile;
    };
    
    GoBoxFile.prototype.getMime = function () {
        return this.mime;
    };
    
    GoBoxFile.prototype.getLastUpdate = function () {
        return new Date(parseInt(this.lastUpdateDate, 10));  
    };
    
    GoBoxFile.prototype.getCreation = function () {
        return new Date(parseInt(this.creationDate, 10));
    };
    
    GoBoxFile.prototype.getSize = function () {
        return this.size;
    };

    return GoBoxFile;

});