angular.module('goboxWebapp')

.directive('imagePreview', function () {
   
   function imageCtrl () {
       
   }
   
   // Return the object that described the directive
   return {
       templateUrl: 'components/previewer/directive/image/image.html',
       restrict: 'E',
       controller: imageCtrl,
       scope: {
           preview: '=preview'
       }
   };
});