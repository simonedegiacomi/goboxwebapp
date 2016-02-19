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
    switch(GoBoxClient.getState()) {
        case 'ready':
            $state.go('home.files', { id: 1 }, { reload: true });
            break;
        default:
            break;
    }
        
});