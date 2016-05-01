angular.module('goboxWebapp')

.directive('musicPreview', function($sce, GoBoxClient) {

   function musicCtrl($scope, $sce) {

      $scope.trustedLink = $sce.trustAsResourceUrl($scope.links.raw);
   }

   // Return the object that described the directive
   return {
      templateUrl: 'components/previewer/directive/music/music.html',
      restrict: 'E',
      controller: musicCtrl,
      scope: {
         file: '=file',
         links: '=links'
      }
   };
});