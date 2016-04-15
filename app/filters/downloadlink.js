'use strict';

angular.module('goboxWebapp')
.filter('downloadLink', function (GoBoxClient) {
    return function (file) {
        return GoBoxClient.getDownloadLink(file);
    };
});