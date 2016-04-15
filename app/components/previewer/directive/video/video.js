angular.module('goboxWebapp')

.directive('videoPreview', function() {

   function videoCtrl($scope, $sce) {

      var preview = $scope.preview;

      $scope.player = {
         src: {
            src: $sce.trustAsResourceUrl(preview.link),
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
         preview: '=preview'
      }
   };
});