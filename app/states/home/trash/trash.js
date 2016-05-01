angular.module('goboxWebapp')

.controller('TrashCtrl', function ($scope, GoBoxClient, $mdToast, $mdDialog, ToolbarManager) {
    
    // Request the files
    function updateTrashList() {
        GoBoxClient.getTrashedFiles().then(function(files) {
            $scope.files = files;
        });
    }
    
    updateTrashList();
    
    $scope.recover = function (fileToRecover) {
        
        // Call the method of the client
        GoBoxClient.trash(fileToRecover, true).then(function () {
            $mdToast.showSimple("File " + fileToRecover.name + " recovered");
            updateTrashList();
        }, function () {
            $mdToast.showSimple("Sorry, cannot recover " + fileToRecover.name);
        });
    };
    
    $scope.delete = function (filetoDelete) {

        var dialog = $mdDialog.prompt()
            .title("Remove file")
            .textContent("You can't undo this action")
            .ok("DELETE")
            .cancel("Keep in Trash");
            
        $mdDialog(dialog).then(function () {
            
            GoBoxClient.delete(filetoDelete).then(function () {
                $mdToast.showSimple("File removed from the trash");
                updateTrashList();
            }, function () {
                $mdToast.showSimple("The file cannot be removed from the trash");
            });
        });
    };
    
    $scope.emptyTrash = function () {
        var dialog = $mdDialog.confirm()
            .title("Empty trash")
            .textContent("You can't undo this action")
            .ok("Empty trash")
            .cancel("Keep the Trash");
            
        $mdDialog.show(dialog).then(function () {
            GoBoxClient.emptyTrash().then(function () {
                $mdToast.showSimple("Done");
                updateTrashList();
            }, function () {
                $mdToast.showSimple("Cannot empty the trash");
                updateTrashList();
            });
        });
    };
    
    ToolbarManager.setTitle({
        mode: 'title',
        str: 'Trashed Files'
    });
    ToolbarManager.showSearch(true);
    ToolbarManager.showTools(false);
    ToolbarManager.setVisibility(true);
    ToolbarManager.apply();
});