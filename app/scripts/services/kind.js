'use strict';

/**
 * @ngdoc service
 * @name goboxWebapp.Kind
 * @description
 * # Kind
 * Service in the goboxWebapp.
 */
angular.module('goboxWebapp')

.constant('Kind', {
    
    specifiedTypes: {
        "application/pdf": "pdf"
    },
    
    fromMime: function(mime) {
        if(!angular.isDefined(mime))
                return 'unkown';
        if(angular.isDefined(this.specifiedTypes[mime]))
            return this.specifiedTypes[mime];
        return mime.substring(0, mime.indexOf('/'));
    },

    fromFile: function(file) {
        if(file.isDirectory)
            return 'folder';
        return this.fromMime(file.getMime());
    }

});