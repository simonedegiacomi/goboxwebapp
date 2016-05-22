'use strict';

describe('Controller: MusicCtrl', function () {

  // load the controller's module
  beforeEach(module('goboxWebapp'));

  var MusicCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MusicCtrl = $controller('MusicCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MusicCtrl.awesomeThings.length).toBe(3);
  });
});
