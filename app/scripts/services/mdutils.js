'use strict';

/**
 * @ngdoc service
 * @name goboxWebapp.mdUtils
 * @description
 * # mdUtils
 * Service in the goboxWebapp.
 */
angular.module('goboxWebapp')

.service('$utils', function($mdToast, $mdMedia, $mdDialog, $timeout) {
    this.$mdToast = $mdToast;
    this.$mdMedia = $mdMedia;
    this.$mdDialog = $mdDialog;
    this.$timeout = $timeout;
});
