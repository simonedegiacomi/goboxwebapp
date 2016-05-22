'use strict';

describe('Service: toolbarManager', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var toolbarManager;
  beforeEach(inject(function (_toolbarManager_) {
    toolbarManager = _toolbarManager_;
  }));

  it('should do something', function () {
    expect(!!toolbarManager).toBe(true);
  });

});
