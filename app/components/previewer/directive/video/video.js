angular.module('goboxWebapp')

.directive('videoPreview', function(GoBoxClient) {

   function videoCtrl($scope, $sce) {

      $scope.links = $scope.links || GoBoxClient.getLinks($scope.file);

      $scope.trustedLink = $sce.trustAsResourceUrl($scope.links.raw);

      $scope.player = {
         src: {
            src: $sce.trustAsResourceUrl($scope.links.raw),
            type: "video/mp4"
         }
      };

   }

   // Return the object that described the directive
   return {
      templateUrl: 'components/previewer/directive/video/video.html',
      restrict: 'E',
      controller: videoCtrl,
      scope: {
         file: '=file',
         links: '=links'
      }
   };
});