'use strict';

describe('Service: GoBoxPath', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var GoBoxPath;
  beforeEach(inject(function (_GoBoxPath_) {
    GoBoxPath = _GoBoxPath_;
  }));

  it('should do something', function () {
    expect(!!GoBoxPath).toBe(true);
  });

});
