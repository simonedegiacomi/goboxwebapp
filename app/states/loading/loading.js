'use strict';

angular.module('goboxWebapp')

.controller('LoadingCtrl', function($scope, $timeout) {

    $timeout(function () {
        $scope.error = true;
    }, 5000);
});