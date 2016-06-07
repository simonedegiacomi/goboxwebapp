angular.module('goboxWebapp')
.filter('fileExtension', function() {
	return function(name) {
	    var index =  name.lastIndexOf('.');
	    if (index <= 0)
	        return name;
		return name.substr(0, index) + "<span class=\"extension\">" + name.substr(index) + "</span>";
	};
});