angular.module('goboxWebapp')

.controller('RecentCtrl', function(GoBoxClient, $state, Toolbar) {

    this.events = [];
    
    var RecentCtrl = this;

    // Request the files
    this.getEvents = function () {
        GoBoxClient.getRecentFiles(this.events.length).then(function(events) {
            Array.prototype.push.apply(RecentCtrl.events, events);
        });
    };
    
    this.getEvents();

    // Config toolbar
    Toolbar.title.mode = 'title';
    Toolbar.title.str = 'Recent Files';
    Toolbar.buttons.switchView.visible = false;
    Toolbar.buttons.search.visible = true;

    this.show = function(file) {

        $state.go('home.files', {
            id: file.ID
        });
    };

    this.alias = {
        FILE_CREATED: {
            name: "Create",
            icon: "add_circle_outline"
        },
        FILE_OPENED: {
            name: "Open",
            icon: "mouse"
        },
        FILE_MODIFIED: {
            name: "Edit",
            icon: "border_color"
        },
        FILE_COPIED: {
            name: "Copy",
            icon: "content_copy"
        },
        FILE_MOVED: {
            name: "Cut",
            icon: "content_cut"
        },
        FILE_TRASHED: {
            name: "Trash",
            icon: "delete"
        },
        FILE_RECOVERED: {
            name: "Recover",
            icon: "undo"
        },
        FILE_DELETED: {
            name: "Remove",
            icon: "delete_forever"
        },
        FILE_SHARED: {
            name: "Share",
            icon: "screen_share"
        },
        FILE_UNSHARED: {
            name: "Unshare",
            icon: "stop_screen_share"
        }
    };

});