'use strict';

angular.module('goboxWebapp')

.service('$utils', function($mdToast, $mdMedia, $mdDialog, $timeout, $interval, ToolbarManager) {
    this.Toolbar = ToolbarManager;
    this.$mdToast = $mdToast;
    this.$mdMedia = $mdMedia;
    this.$mdDialog = $mdDialog;
    this.$timeout = $timeout;
    this.$interval = $interval;
});