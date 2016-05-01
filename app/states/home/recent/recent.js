angular.module('goboxWebapp')

.controller('RecentCtrl', function ($scope, GoBoxClient, $state, ToolbarManager) {
    
    // Request the files
    GoBoxClient.getRecentFiles().then(function(events) {
        $scope.events = events;
    });
    
    $scope.show = function (file) {
        $state.go('home.files', {
            id: file.getId()
        });
    };
    
    ToolbarManager.setTitle({
        mode: 'title',
        str: 'Recent Files'
    });
    ToolbarManager.showSearch(true);
    ToolbarManager.showTools(false);
    ToolbarManager.setVisibility(true)
    ToolbarManager.apply();
    
});