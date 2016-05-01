angular.module('goboxWebapp')

.directive('imagePreview', function (GoBoxClient) {
   
   function imageCtrl ($scope) {
       $scope.links = $scope.links || GoBoxClient.getLinks($scope.file);
   }
   
   // Return the object that described the directive
   return {
       templateUrl: 'components/previewer/directive/image/image.html',
       restrict: 'E',
       controller: imageCtrl,
       scope: {
           file: '=file',
           links: '=links'
       }
   };
});