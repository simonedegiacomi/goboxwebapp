'use strict';

describe('Controller: FilelistCtrl', function () {

  // load the controller's module
  beforeEach(module('goboxWebapp'));

  var FilelistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FilelistCtrl = $controller('FilelistCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FilelistCtrl.awesomeThings.length).toBe(3);
  });
});
