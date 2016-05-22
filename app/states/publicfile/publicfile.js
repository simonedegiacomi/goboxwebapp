'use strict';

angular.module('goboxWebapp')

.controller('PublicFileCtrl', function($stateParams, $http, Env, GoBoxClient, GoBoxFile) {

    this.fileState = 'loading';

    var host = this.hostName = $stateParams.hostName;
    var fileId = $stateParams.id;
    
    var PublicFileCtrl = this;
    
    $http.get('/api/info?host=' + host + '&ID=' + fileId).then(function(response) {

        if (!response.data.found) {
            PublicFileCtrl.fileState = 'notAvailable';
            return;
        }

        PublicFileCtrl.fileState = 'available';
        var file = GoBoxFile.wrap(response.data.file);

        PublicFileCtrl.file = file;
        PublicFileCtrl.links = GoBoxClient.getLinks(file, host);

    }, function() {
        PublicFileCtrl.fileState = 'notAvailable';
    });

});