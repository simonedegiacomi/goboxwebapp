'use strict';

angular.module('goboxWebapp')
.filter('preview', function (GoBoxClient) {
    return function (file) {
        return GoBoxClient.getPreviewLink(file);
    };
});