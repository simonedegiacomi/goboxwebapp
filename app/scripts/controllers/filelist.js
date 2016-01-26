'use strict';

/**
 * @ngdoc function
 * @name goboxWebapp.controller:FilelistCtrl
 * @description
 * # FilelistCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('FileListCtrl', function($scope, GoBoxClient, GoBoxPath) {
    var path = $scope.path = new GoBoxPath(GoBoxClient);
    
    $scope.files = path.ls().getChildren();
    
    $scope.position = path.ls()
});
