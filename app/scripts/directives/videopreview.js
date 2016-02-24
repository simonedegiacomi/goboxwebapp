'use strict';

/**
 * @ngdoc directive
 * @name goboxWebapp.directive:videoPreview
 * @description
 * # videoPreview
 */
angular.module('goboxWebapp')

.directive('videoPreview', function($sce, Env) {

    var player = {
        theme: "bower_components/videogular-themes-default/videogular.css",
    };

    function videoPreviewCtrl($scope) {
        var preview = $scope.preview;
        player.sources = [{
            src: $sce.trustAsResourceUrl(preview.link),
            type: preview.file.getMime
        }];
        $scope.player = player;
    }

    return {
        templateUrl: 'views/video.preview.html',
        restrict: 'E',
        scope: {
            preview: '=preview'
        },
        controller: videoPreviewCtrl
    };
});