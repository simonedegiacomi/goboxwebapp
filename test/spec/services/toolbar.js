'use strict';

describe('Service: toolbar', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var toolbar;
  beforeEach(inject(function (_toolbar_) {
    toolbar = _toolbar_;
  }));

  it('should do something', function () {
    expect(!!toolbar).toBe(true);
  });

});
