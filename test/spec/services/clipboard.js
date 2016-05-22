'use strict';

describe('Service: clipboard', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var clipboard;
  beforeEach(inject(function (_clipboard_) {
    clipboard = _clipboard_;
  }));

  it('should do something', function () {
    expect(!!clipboard).toBe(true);
  });

});
