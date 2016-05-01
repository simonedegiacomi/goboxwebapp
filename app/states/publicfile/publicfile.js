'use strict';

angular.module('goboxWebapp')

.controller('PublicFileCtrl', function ($scope, $stateParams, $http, Env, GoBoxClient, GoBoxFile) {
    
    $scope.fileState = 'loading';
    
    var host = $scope.hostName = $stateParams.hostName;
    var fileId = $stateParams.id;
    
    $http.get('/api/info?host=' + host + '&ID=' + fileId).then(function (response) {
        
        if(!response.data.found) {
            $scope.fileState = 'notAvailable';
            return;
        }
        
        $scope.fileState = 'available';
        var file = GoBoxFile.wrap(response.data.file);
        
        $scope.file = file;
        $scope.links = GoBoxClient.getLinks(file, host);
        
    }, function () {
        $scope.fileState = 'notAvailable';
    });
    
});