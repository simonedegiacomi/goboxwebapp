'use strict';

angular.module('goboxWebapp')

.service('ToolbarManager', function() {
    
    // Listener for the toolbar config changes
    var listeners = [];
    
    // Dafult show the toolbar
    this._visibility = true;
    
    // Call all the listeners
    function notify () {
        for(var i in listeners)
            listeners[i]();
    }
    
    // Set the type of title
    this.setTitle = function (titleConfig) {
        this._titleconfig = titleConfig;
    };
    
    // Show the search icon
    this.showSearch = function (show) {
        this._search = show;
    };
    
    this.getShowSearch = function () {
        return this._search;
    };
    
    // Show the tools icon
    this.showTools = function (show) {
        this._tools = show;
    };
    
    this.getShowTools = function () {
        return this._tools;
    };
    
    this.getTitle = function () {
        
        return this._titleconfig;
    };
    
    // Call all the listener. IT should be called only when all the configurations
    // are updated
    this.apply = function () {
        
        // Call al the listeners
        notify();
    };
    
    // Register a new listener for the changes
    this.onChange = function (callback) {
        listeners.push(callback);
    };
    
    this.setVisibility = function (visibility) {
        this._visibility = visibility;
    };
    
    this.getVisibility = function () {
        return this._visibility;
    };
});