'use strict';

angular.module('goboxWebapp')

.controller('LoadingCtrl', function($scope, $stateParams, $timeout) {

    $scope.firstTime = $stateParams.first == 'true';
    
    if (!$scope.firstTime) {
        $scope.error = false;
        $timeout(function () {
            $scope.error = true;
        }, 5000);
    }
});