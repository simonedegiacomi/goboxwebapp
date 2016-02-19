'use strict';

/**
 * This is a wrapper around the WebSocket object and introduce the concept of
 * events (like the socket.io library) and queries, events with a answers.
 * 
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.factory('MyWS', function($q) {
    
    // Constructor
    var MyWS = function (server) {
        
        var events = this._eventListeners = { };
        var queries = this._queryListeners = { };
        var queue = this._queue = [];
        
        var ws = this._ws = new WebSocket(server);
        
        var self = this;
        
        ws.onopen = function () {
            executeEvent('open', { });
            for(var i in queue)
                this.send(queue[i].event, queue[i].data, queue[i].forServer, queue[i]._queryId);
        };
        
        ws.onmessage = function (incoming) {
            var json = JSON.parse(incoming.data);
            executeEvent(json.event, json.data, json._queryId);
        };
        
        ws.onclose = function () {
            console.log('Socket Closed!');
            executeEvent('close', { });  
        };
        
        ws.onerror = function () {
            console.log('Socket Error!');
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
        this._eventListeners[event] = listener;  
    };
    
    MyWS.prototype.send = function (event, data, forServer, queryId) {
        var objToSend = { event: event, data: data , forServer: forServer, _queryId: queryId };
        try {
            this._ws.send(JSON.stringify(objToSend));
            console.log("sent", objToSend);
        } catch (e) {
            console.log("Exception", e);
            this._queue.push(objToSend);
        }
    };
    
    MyWS.prototype.query = function (query, data) {
        console.log("Query: ", query, "Data", data);
        var future = $q.defer();
        
        var id = '' + (new Date().getTime());
        this._queryListeners[id] = future;
        this.send(query, data, false, id);
        
        return future.promise;
    };
    
    return MyWS;
    
});