angular.module('goboxWebapp')

.directive('preview', function () {
   
   // Return the object that described the directive
   return {
       templateUrl: 'components/previewer/directive/preview.html',
       restrict: 'E',
       controller: function () {},
       scope: {
           preview: '=preview'
       }
   };
});