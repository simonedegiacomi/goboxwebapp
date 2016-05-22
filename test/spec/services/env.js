'use strict';

describe('Service: Env', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var Env;
  beforeEach(inject(function (_Env_) {
    Env = _Env_;
  }));

  it('should do something', function () {
    expect(!!Env).toBe(true);
  });

});
