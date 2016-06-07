'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:FilterCtrl
 * @description
 * # FilterCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('FilterCtrl', function($state, $stateParams, GoBoxClient, Toolbar) {

    //$scope.closeSidenav();

    this.search = {
        kind: $stateParams.kind,
        keyword: $stateParams.keyword
    };

    this.go = function() {
        $state.go('home.filter', this.search);
    };

    var result = {
        start: 0,
        end: 0
    };

    var FilterCtrl = this;
    
    this.res = [];

    GoBoxClient.search(this.search.keyword, this.search.kind, 0, 50).then(function(res) {
        Array.prototype.push.apply(FilterCtrl.res, res);
        result.end = res.length;
        result.start = 0;
    });

     // Config toolbar
    Toolbar.title.mode = 'title';
    Toolbar.title.str = 'Search';
    Toolbar.buttons.switchView.visible = true;
    Toolbar.buttons.search.visible = false;

    this.fullScroll = function() {
        GoBoxClient.search(this.search.keyword, this.search.kind, result.end, 50).then(function(res) {
            Array.prototype.push.apply(FilterCtrl.res, res);
            result.end += res.length;
        });
    };
    
    this.fileListConfig = {
        mode: 'grid'
    };

});