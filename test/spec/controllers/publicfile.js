'use strict';

describe('Controller: PublicfileCtrl', function () {

  // load the controller's module
  beforeEach(module('goboxWebapp'));

  var PublicfileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PublicfileCtrl = $controller('PublicfileCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PublicfileCtrl.awesomeThings.length).toBe(3);
  });
});
