'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('SettingsCtrl', function($scope, $utils, GoBoxClient) {
    $scope.password = {
        change: function() {
            GoBoxClient.getAuth().changePassword($scope.password.old, $scope.password.new).then(function() {
                $utils.$mdToast.showSimple("Password changed");
                $scope.password.loading = false;
            }, function() {
                $utils.$mdToast.showSimple("Sorry, can't change the password");
                $scope.password.loading = false;
            });
            this.loading = true;
        }
    };

    $scope.account = {};

    GoBoxClient.getSessions().then(function(sessions) {
        $scope.account.sessions = sessions;
    });

    $scope.disableSession = function(session) {
        GoBoxClient.disableSession(session).then(function() {
            GoBoxClient.getSessions().then(function(sessions) {
                $scope.account.sessions = sessions;
            });
            $utils.$mdToast.showSimple("Session deleted");
        });
    };
});