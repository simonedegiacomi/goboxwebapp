'use strict';

/**
 * This is a wrapper around the WebSocket object and introduce the concept of
 * events (like the socket.io library) and queries, events with a answers.
 * 
 * Created by Degiacomi Simone on 26/01/2016
 */
angular.module('goboxWebapp')

.factory('MyWS', function($q) {
    
    // Constructor
    var MyWS = function (server) {
        
        var events = this._eventisteners = { };
        var queries = this._queryListeners = { };
        
        var ws = this._ws = new WebSocket(server);
        
        ws.onopen = function () {
              executeEvent('open', { });
        };
        
        ws.onmessage = function (incoming) {
            var json = JSON.parse(incoming);
            executeEvent(json.event, json.data, json._queryId);
        };
        
        ws.onclose = function () {
            executeEvent('close', { });  
        };
        
        ws.onerro = function () {
            executeEvent('error', { });
        };
        
        function executeEvent (event, data, queryId) {
            if(event == 'queryResponse') {
                queries[queryId](data);
                queries[queryId] = undefined;
                return ;
            }
            
            var listener = events[event];
            if(angular.isDefined(listener))
                listener(data);
        }
        
    };
    
    MyWS.prototype.on = function (event, listener) {
        this._eventisteners[event] = listener;  
    };
    
    MyWS.prototype.send = function (event, data) {
        this._ws.send(JSON.stringify({ event: event, data: data }));
    };
    
    MyWS.prototype.query = function (query, data) {
        var future = $q();
        
        return future.promise;
    };
    
    return MyWS;
    
});