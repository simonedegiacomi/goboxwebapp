angular.module('goboxWebapp')

.controller('TrashCtrl', function ($scope, GoBoxClient, $mdToast, $mdDialog, ToolbarManager) {
    
    // Request the files
    GoBoxClient.getTrashedFiles().then(function(files) {
        
        $scope.files = files;
    });
    
    $scope.recover = function (fileToRecover) {
        
        // Call the method of the client
        GoBoxClient.recover(fileToRecover).then(function () {
            
            $mdToast.showSimple("File " + fileToRecover.name + " recovered");
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
            }, function () {
                
                $mdToast.showSimple("The file cannot be removed from the trash");
            });
        });
    };
    
    $scope.emptyTrash = function () {
        
        var dialog = $mdDialog.prompt()
            .title("Empty trash")
            .textContent("You can't undo this action")
            .ok("Empty trash")
            .cancel("Keep the Trash");
            
        $mdDialog.show(dialog).then(function () {
            
            GoBoxClient.emptyTrash();
        });
    };
    
    ToolbarManager.setTitle({
        mode: 'title',
        str: 'trashed Files'
    });
    ToolbarManager.showSearch(true);
    ToolbarManager.showTools(false);
    ToolbarManager.apply();
});