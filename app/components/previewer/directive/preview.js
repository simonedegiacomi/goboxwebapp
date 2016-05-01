angular.module('goboxWebapp')

.directive('preview', function (GoBoxClient, Kind) {
   
   // Return the object that described the directive
   return {
       templateUrl: 'components/previewer/directive/preview.html',
       restrict: 'E',
       controller: previewCtrl,
       scope: {
           file: '=file',
           links: '=links'
       }
   };
   
   function previewCtrl ($scope) {
        $scope.links = $scope.links || GoBoxClient.getLinks($scope.file);  
        $scope.kind = Kind.fromFile($scope.file);
   };
});