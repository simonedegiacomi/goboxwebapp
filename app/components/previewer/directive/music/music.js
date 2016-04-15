angular.module('goboxWebapp')

.directive('musicPreview', function($sce) {

   function musicCtrl($scope) {

      var preview = $scope.preview;



      $scope.player = {
         src: {
            src: $sce.trustAsResourceUrl(preview.link),
            type: "audio/mpeg"
         }
      };
   }

   // Return the object that described the directive
   return {
      templateUrl: 'components/previewer/directive/music/music.html',
      restrict: 'E',
      controller: musicCtrl,
      scope: {
         preview: '=preview'
      }
   };
});