'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.filter('iconFilter', function() {
    var types = {
        "application/pdf": "picture_as_pdf",
        "default": "insert_drive_file",
        "audio/mp3": "library_music",
        "audio/mpeg": "library_music",
        "image/png": "collections"
    };
    
    return function(file) {
        if (file.isDirectory)
            return 'folder';
        else if(!angular.isDefined(file.getMime()) || ! angular.isDefined(types[file.getMime()]))
            return types.default;
        
        return types[file.getMime()];
    };
});
