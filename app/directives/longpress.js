angular.module('goboxWebapp')

.directive('onLongPress', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {
		    
		    // Start touch event
			$element.bind('touchstart', function() {
				// This seems like a long touch...
				$scope.longPress = true;

				// Check if is a real long touch soon
				$timeout(function() {
					if ($scope.longPress) {
					    
						// Yes, is a real long touch
						$scope.$apply(function() {
							$scope.$eval($attrs.onLongPress)
						});
					}
				}, 600);
			});

            // End touch event
			$element.bind('touchend', function() {
				
				// Nope, it's not so long
				$scope.longPress = false;
			});
		}
	};
})