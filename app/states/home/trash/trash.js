angular.module('goboxWebapp')

.controller('TrashCtrl', function(GoBoxClient, $mdToast, $mdDialog, Toolbar) {

    var TrashCtrl = this;

    // Request the files
    GoBoxClient.getTrashedFiles().then(function(files) {
        TrashCtrl.files = files;
    });

    this.recover = function(fileToRecover) {

        // Call the method of the client
        GoBoxClient.trash(fileToRecover, true).then(function() {
            $mdToast.showSimple("File " + fileToRecover.name + " recovered");
            GoBoxClient.getTrashedFiles().then(function(files) {
                TrashCtrl.files = files;
            });
        }, function() {
            $mdToast.showSimple("Sorry, cannot recover " + fileToRecover.name);
        });
    };

    this.delete = function(filetoDelete) {

        var dialog = $mdDialog.confirm()
            .title("Remove file")
            .textContent("You can't undo this action")
            .ok("DELETE")
            .cancel("Keep in Trash");

        $mdDialog.show(dialog).then(function() {

            GoBoxClient.delete(filetoDelete).then(function() {
                $mdToast.showSimple("File removed from the trash");
                GoBoxClient.getTrashedFiles().then(function(files) {
                    TrashCtrl.files = files;
                });
            }, function() {
                $mdToast.showSimple("The file cannot be removed from the trash");
            });
        });
    };

    this.emptyTrash = function() {
        var dialog = $mdDialog.confirm()
            .title("Empty trash")
            .textContent("You can't undo this action")
            .ok("Empty trash")
            .cancel("Keep the Trash");

        $mdDialog.show(dialog).then(function() {
            GoBoxClient.emptyTrash().then(function() {
                $mdToast.showSimple("Done");
            }, function() {
                $mdToast.showSimple("Cannot empty the trash");
            });
        });
    };

     // Config toolbar
    Toolbar.title.mode = 'title';
    Toolbar.title.str = 'Trash';
    Toolbar.buttons.switchView.visible = false;
    Toolbar.buttons.search.visible = false;
    
});