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
    
    GoBoxClient.search(search.keyword, search.kind).then(function (res) {
        $scope.res = res;
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

});
