'use strict';

describe('Controller: ImagesCtrl', function () {

  // load the controller's module
  beforeEach(module('goboxWebapp'));

  var ImagesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ImagesCtrl = $controller('ImagesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ImagesCtrl.awesomeThings.length).toBe(3);
  });
});
