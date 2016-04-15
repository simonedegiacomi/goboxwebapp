'use strict';

angular.module('goboxWebapp')

.controller('PublicFileCtrl', function ($scope, $stateParams, $http, Env, GoBoxClient) {
    
    $scope.fileState = 'loading';
    
    var host = $scope.hostName = $stateParams.hostName;
    var fileId = $stateParams.id;
    
    $http.get(Env.Base + '/api/info?host=' + host + '&ID=' + fileId).then(function (response) {
        
        if(!response.data.found) {
            
            $scope.fileState = 'notAvailable';
            return;
        }
        
        $scope.fileState = 'available';
        var file = response.data.file;
        
        $scope.file = file;
        $scope.preview = {
            file: file,
            link: GoBoxClient.getDownloadLink(file)
        };
        
    }, function () {
        
        $scope.fileState = 'notAvailable';
    });
    
});