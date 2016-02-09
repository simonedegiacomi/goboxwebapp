'use strict';

/**
 * @author Degiacomi Simone
 * @name goboxWebapp.filter:DownloadUrl
 * @function
 * @description
 * # DownloadUrl
 * Filter in the goboxWebapp.
 */
angular.module('goboxWebapp')

.filter('DownloadUrl', function(Env) {
    return function(file) {
        return Env.base + '/api/transfer/fromClient?id=' + file.getId();
    };
});