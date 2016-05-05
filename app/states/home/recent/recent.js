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
    
    $scope.show = function(file) {
        
        $state.go('home.files', {
            id: file.getId()
        });
    };
    
    
    
    $scope.alias = {
        OPEN_FILE: {
            name: "Open",
            icon: "mouse"
        },
        EDIT_FILE: {
            name: "Edit",
            icon: "border_color"
        },
        COPY_FILE: {
            name: "Copy",
            icon: "content_copy"
        },
        CUT_FILE: {
            name: "Cut",
            icon: "content_cut"
        },
        TRASH_FILE: {
            name: "Trash",
            icon: "delete"
        },
        RECOVER_FILE: {
            name: "Recover",
            icon: "undo"
        },
        REMOVE_FILE: {
            name: "Remove",
            icon: "delete_forever"
        },
        SHARE_FILE: {
            name: "Share",
            icon: "screen_share"
        },
        UNSHARE_FILE: {
            name: "Unshare",
            icon: "stop_screen_share"
        }
    };
    
    $scope.onPageEnd = function () {
        console.log("End page");
    };
    
});