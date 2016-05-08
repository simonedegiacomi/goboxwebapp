'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:FilterCtrl
 * @description
 * # FilterCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('FilterCtrl', function($state, $scope, $stateParams, GoBoxClient, Toolbar) {

    $scope.closeSidenav();

    var search = $scope.search = {
        kind: $stateParams.kind,
        keyword: $stateParams.keyword
    };

    $scope.go = function() {
        $state.go('home.filter', search);
    };

    var result = {
        start: 0,
        end: 0
    };

    GoBoxClient.search(search.keyword, search.kind, 0, 50).then(function(res) {
        $scope.res = res;
        result.end = res.length;
        result.start = 0;
    });

     // Config toolbar
    Toolbar.title.mode = 'title';
    Toolbar.title.str = 'Search';
    Toolbar.buttons.switchView.visible = true;
    Toolbar.buttons.search.visible = false;

    $scope.fullScroll = function() {
        console.log(result.end);
        GoBoxClient.search(search.keyword, search.kind, result.end, 50).then(function(res) {
            Array.prototype.push.apply($scope.res, res);
            result.end += res.length;
        });
    };
    
    $scope.fileListConfig = {
        mode: 'grid'
    };

});