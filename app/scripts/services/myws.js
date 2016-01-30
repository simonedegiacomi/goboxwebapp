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
        var queue = this._queue = [];
        
        var ws = this._ws = new WebSocket(server);
        
        var self = this;
        
        ws.onopen = function () {
            executeEvent('open', { });
            for(var i in queue)
                this.send(queue[i].event, queue[i].data);
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
                queries[queryId].resolve(data);
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
        try {
            this._ws.send(JSON.stringify({ event: event, data: data }));
        } catch (e) {
            this._queue.push({ event: event, data: data });
        }
    };
    
    MyWS.prototype.query = function (query, data) {
        var future = $q.defer();
        
        var id = '' + (new Date().getTime());
        this._queryListeners[id] = future;
        this.send(event, { 'data': data, '_queryId': id, 'forServer': false});
        
        return future.promise;
    };
    
    return MyWS;
    
});