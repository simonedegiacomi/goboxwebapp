'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('SettingsCtrl', function ($scope, $mdToast, GoBoxClient) {
    $scope.password = {
        change: function () {
            GoBoxClient.getAuth().changePassword($scope.password.old, $scope.password.new).then(function(){
                $mdToast.showSimple("Password changed");
                this.loading = false;
            }, function () {
                $mdToast.showSimple("Sorry, can't change the password");
                this.loading = false;
            });
            this.loading = true;
        }
    };
});