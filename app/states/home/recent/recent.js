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