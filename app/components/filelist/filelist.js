'use strict';

/**
 * @author Degiacomi Simone
 */
angular.module('goboxWebapp')

.directive('onLongPress', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, $elm, $attrs) {
			$elm.bind('touchstart', function(evt) {
				// Locally scoped variable that will keep track of the long press
				$scope.longPress = true;

				// We'll set a timeout for 600 ms for a long press
				$timeout(function() {
					if ($scope.longPress) {
						// If the touchend event hasn't fired,
						// apply the function given in on the element's on-long-press attribute
						$scope.$apply(function() {
							$scope.$eval($attrs.onLongPress)
						});
					}
				}, 600);
			});

			$elm.bind('touchend', function(evt) {
				// Prevent the onLongPress event from firing
				$scope.longPress = false;
				// If there is an on-touch-end function attached to this element, apply it
				if ($attrs.onTouchEnd) {
					$scope.$apply(function() {
						$scope.$eval($attrs.onTouchEnd)
					});
				}
			});
		}
	};
})

.directive('fileList', function($timeout, Clipboard, Preferences) {


    // Controller of the file list
    var ctrl = function($scope) {
        
        
        $scope.click = function (file) {
            Clipboard.singleClick(file);
        };
        
        $scope.double = function (file, $event) {
            Clipboard.doubleClick(file, $event);
        };
        
        $scope.press = function () {
            alert("PRess");
        };
        
        // attach the preferences
        $scope.Preferences = Preferences;
        
        // List order config
        $scope.order = {
            what: 'name',
            reverse: false,
            toggle: function (newWhat) {
                this.reverse = this.what == newWhat ? !this.reverse : false;
                this.what = newWhat;
            }
        };
        
        $scope.getSelectedFiles = function () {
            return Clipboard.getSelectedFiles();  
        };
    };

    // Return the object that describes the directive
    return {
        templateUrl: 'components/filelist/filelist.html',
        restrict: 'E',
        scope: {
            files: '=files'
        },
        controller: ctrl
    };
});