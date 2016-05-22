'use strict';

describe('Service: GoBoxClient', function () {

  // load the service's module
  beforeEach(module('goboxWebappApp'));

  // instantiate service
  var GoBoxClient;
  beforeEach(inject(function (_GoBoxClient_) {
    GoBoxClient = _GoBoxClient_;
  }));

  it('should do something', function () {
    expect(!!GoBoxClient).toBe(true);
  });

});
