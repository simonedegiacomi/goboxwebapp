'use strict';

describe('Controller: FilterCtrl', function () {

  // load the controller's module
  beforeEach(module('goboxWebapp'));

  var FilterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FilterCtrl = $controller('FilterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FilterCtrl.awesomeThings.length).toBe(3);
  });
});
