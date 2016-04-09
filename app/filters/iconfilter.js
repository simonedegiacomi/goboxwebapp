'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.filter('iconFilter', function(Kind) {
    var icons = {
        "unkown": "insert_drive_file",
        "folder": "folder",
        "audio": "library_music",
        "image": "collections",
        "video": "video_library",
        "pdf": "picture_as_pdf"
    };
    
    return function(file) {
        var probeKind = Kind.fromFile(file);
        
        if(angular.isDefined(icons[probeKind]))
            return icons[probeKind];
        
        return icons['unkown'];
    };
});