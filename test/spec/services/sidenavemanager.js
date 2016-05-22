'use strict';

describe('Service: sidenaveManager', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var sidenaveManager;
  beforeEach(inject(function (_sidenaveManager_) {
    sidenaveManager = _sidenaveManager_;
  }));

  it('should do something', function () {
    expect(!!sidenaveManager).toBe(true);
  });

});
