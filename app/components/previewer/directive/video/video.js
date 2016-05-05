angular.module('goboxWebapp')

.directive('videoPreview', function(GoBoxClient) {

   function videoCtrl($scope, $sce) {

      $scope.links = $scope.links || GoBoxClient.getLinks($scope.file);
      var videoUrl = $scope.links.raw;

      $scope.player = {
         sources: [
            {
               src: $sce.trustAsResourceUrl(videoUrl),
               type: 'video/mp4'
            }
         ],
         theme: "bower_components/videogular-themes-default/videogular.css"
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