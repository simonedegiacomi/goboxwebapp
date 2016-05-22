angular.module('goboxWebapp')

.directive('onLongPress', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, element, $attrs) {

			var startTouchTime;
			var startY;

			// Start touch event
			element.bind('touchstart', function(event) {

				//console.log(event);

				startTouchTime = event.timeStamp;
				startY = event.touches[0].clientY;
			});

			// End touch event
			element.bind('touchend', function(event) {
				var deltaY = Math.abs(startY - event.changedTouches[0].clientY);
				//console.log(deltaY);
				if (deltaY > 10) {
					startTouchTime = 0;
					return;
				}

				if (event.timeStamp - startTouchTime > 600) {
					//alert("Long"); 
					startTouchTime = 0;
					// Yes, it's a real long touch
					$scope.$apply(function() {
						$scope.$eval($attrs.onLongPress);
					});
				}
			});
			
			
		}
	};
})