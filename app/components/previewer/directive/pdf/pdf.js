angular.module('goboxWebapp')

.directive('pdfPreview', function (GoBoxClient) {
   
   function pdfCtrl ($scope, $sce) {
       $scope.trustedLink = $sce.trustAsResourceUrl($scope.links.raw);
   }
   
   // Return the object that described the directive
   return {
       templateUrl: 'components/previewer/directive/pdf/pdf.html',
       restrict: 'E',
       controller: pdfCtrl,
       scope: {
           file: '=file',
           links: '=links'
       }
   };
});