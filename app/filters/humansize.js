angular.module('goboxWebapp')
.filter('humanSize', function() {
	return function(bytes) {
		if (bytes <= 0)
			return
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) +  ' ' + units[number];
	};
});