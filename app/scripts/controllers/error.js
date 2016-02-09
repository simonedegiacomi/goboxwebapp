'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.controller:ErrorCtrl
 * @description
 * # ErrorCtrl
 * Controller of the goboxWebapp
 */
angular.module('goboxWebapp')

.controller('ErrorCtrl', function($state, GoBoxClient) {
    if(GoBoxClient.getState() == 'ready')
        $state.go('home.files');
});
