'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('pathPwd', function($state) {
    
    var ctrl = function ($scope) {
        $scope.getLink = function (file) {
            return $state.href('home.files', { id: file.ID });
        };
    };
    
    return {
        templateUrl: 'components/pwd/pwd.html',
        restrict: 'E',
        scope: {
            path: '=path'
        },
        controller: ctrl
    };
});
