angular.module('goboxWebapp')

.directive('pdfPreview', function () {
   
   function pdfCtrl () {
       
   }
   
   // Return the object that described the directive
   return {
       templateUrl: 'components/previewer/directive/pdf/pdf.html',
       restrict: 'E',
       controller: pdfCtrl,
       scope: {
           preview: '=preview'
       }
   };
});