'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:FilterCtrl
 * @description
 * # FilterCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('FilterCtrl', function($state, $scope, $stateParams, GoBoxClient) {
    
    var search = $scope.search = {
        kind: $stateParams.kind,
        keyword: $stateParams.keyword
    };
    
    $scope.go = function () {
        $state.go('home.filter', search);
    };
    
    var result = { 
        start: 0,
        end: 0
    };
    
    GoBoxClient.search(search.keyword, search.kind, 0, 50).then(function (res) {
        $scope.res = res;
        result.end = res.length;
        result.start = 0;
    });
    
    /**
     * Configure the toolbar
     */
    $scope.toolbar = {
        title: {
            mode: 'search'
        },
        showSearchLink: false,
        tools: [{
            tooltip: 'Copy',
            icon: 'content_copy'
        }, {
            tooltip: 'Cut',
            icon: 'content_cut'
        }, {
            tooltip: 'Delete',
            icon: 'delete'
        }, {
            tooltip: 'Share',
            icon: 'share'
        }]
    };

    $scope.fullScroll = function () {
        console.log(result.end);
        GoBoxClient.search(search.keyword, search.kind, result.end, 50).then(function(res) {
          Array.prototype.push.apply($scope.res, res);
          result.end += res.length; 
        });
    };

});
