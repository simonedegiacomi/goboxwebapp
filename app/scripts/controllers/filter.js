'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:FilterCtrl
 * @description
 * # FilterCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('FilterCtrl', function($scope) {
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
