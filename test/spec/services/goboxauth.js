'use strict';

describe('Service: GoBoxAuth', function () {

  // load the service's module
  beforeEach(module('goboxWebappApp'));

  // instantiate service
  var GoBoxAuth;
  beforeEach(inject(function (_GoBoxAuth_) {
    GoBoxAuth = _GoBoxAuth_;
  }));

  it('should do something', function () {
    expect(!!GoBoxAuth).toBe(true);
  });

});
