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
        // Create a new GoBoxFile
        var file = new GoBoxFile();
        
        // Copy every key
        for(var key in json)
            file[key] = json[key];
            
        // Finally wrap also his children
        if(json.children)
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
    
    GoBoxFile.prototype.isDirectory = function () {
        if(!angular.isDefined(this.isDirectory))
            return false;
        return this.isDirectory;  
    };
    
    GoBoxFile.prototype.hasChild = function (child) {
        for(var i in this.children)
            if(this.children[i].ID == child.ID)
                return true;
        return false
    };
    
    return GoBoxFile;

});