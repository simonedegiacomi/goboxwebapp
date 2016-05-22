'use strict';

describe('Controller: SharedCtrl', function () {

  // load the controller's module
  beforeEach(module('goboxWebapp'));

  var SharedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SharedCtrl = $controller('SharedCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SharedCtrl.awesomeThings.length).toBe(3);
  });
});
