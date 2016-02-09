'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('pathPwd', function($state) {
    
    var ctrl = function ($scope) {
        $scope.getLink = function (file) {
            return $state.href('home.files', { id: file.getId() });
        };
    };
    
    return {
        templateUrl: 'views/pathpwd.tmpl.html',
        restrict: 'E',
        scope: {
            path: '=path'
        },
        controller: ctrl
    };
});
