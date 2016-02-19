'use strict';

/**
 * @ngdoc directive
 * @name goboxWebapp.directive:pdfPreview
 * @description
 * # pdfPreview
 */
angular.module('goboxWebapp')

.directive('pdfPreview', function() {
    return {
        templateUrl: 'views/pdf.preview.html'
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            element.text('this is the pdfPreview directive');
        }
    };
});
