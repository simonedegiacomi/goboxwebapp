angular.module("goboxWebapp")

.directive('defaultThumbnail', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                attrs.$set('src', "images/default-thumbnail.png");
            });
        }
    };
});