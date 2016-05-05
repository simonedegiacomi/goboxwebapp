'use strict';

angular.module('goboxWebapp')

/**
 * @ngdoc filter
 * @ngname thumbnail
 * @description This filter return the link of the thumbnail image
 */
.filter('thumbnail', function (GoBoxClient) {
    return function (file) {
        return GoBoxClient.getLinks(file).thumbnail;
    };
});