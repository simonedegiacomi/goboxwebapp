'use strict';

angular.module('goboxWebapp')
.filter('preview', function (GoBoxClient) {
    return function (file) {
        if (file.isDirectory)
            return 
        return GoBoxClient.getPreviewLink(file);
    };
});