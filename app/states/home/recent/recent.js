angular.module('goboxWebapp')

.controller('RecentCtrl', function ($scope, GoBoxClient, $state, Toolbar) {
    
    // Request the files
    GoBoxClient.getRecentFiles().then(function(events) {
        $scope.events = events;
    });
    
    $scope.show = function (file) {
        $state.go('home.files', {
            id: file.getId()
        });
    };
    
     // Config toolbar
    Toolbar.title.mode = 'title';
    Toolbar.title.str = 'Recent Files';
    Toolbar.buttons.switchView.visible = false;
    Toolbar.buttons.search.visible = true;
    
    $scope.show = function(file) {
        
        $state.go('home.files', {
            id: file.getId()
        });
    };
    
    $scope.alias = {
        NEW_FILE: {
            name: "Create",
            icon: "add_circle_outline"
        },
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
    
});