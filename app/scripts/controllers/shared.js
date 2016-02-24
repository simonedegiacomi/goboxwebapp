'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:SharedCtrl
 * @description
 * # SharedCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('ShareCtrl', function($scope, GoBoxClient) {

    $scope.share = {};

    GoBoxClient.getSharedFiles().then(function (files) {
        $scope.share.files = files; 
    });

});
