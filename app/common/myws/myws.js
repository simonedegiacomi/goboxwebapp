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
        //var queue = this._queue = [];
        
        var ws = this._ws = new WebSocket(server);
        
        ws.onopen = function () {
            executeEvent('open', { });
            //for(var i in queue)
            //    this.send(queue[i].event, queue[i].data, queue[i].forServer, queue[i]._queryId);
        };
        
        ws.onmessage = function (incoming) {
            var json = JSON.parse(incoming.data);
            executeEvent(json.event, json.data, json._queryId);
        };
        
        ws.onclose = function () {
            executeEvent('close', { });  
        };
        
        ws.onerror = function () {
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
    
    // Register a new listener for a event
    MyWS.prototype.on = function (event, listener) {
        this._eventListeners[event] = listener;  
    };
    
    // Send a new event or a new query (if the query id params is specified)
    MyWS.prototype.send = function (event, data, forServer, queryId) {
        var objToSend = { event: event, data: data , _queryId: queryId };
        this._ws.send(JSON.stringify(objToSend));
    };
    
    // Create a new query and auto generate the relative id
    MyWS.prototype.query = function (query, data) {
        var future = $q.defer();
        
        var id = '' + Math.floor(Math.random() * 10000);
        this._queryListeners[id] = future;
        this.send(query, data, false, id);
        
        return future.promise;
    };
    
    MyWS.prototype.close = function () {
        
        this._ws.close();
    };
    
    return MyWS;
});