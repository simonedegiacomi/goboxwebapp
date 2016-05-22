'use strict';

describe('Service: mdUtils', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var mdUtils;
  beforeEach(inject(function (_mdUtils_) {
    mdUtils = _mdUtils_;
  }));

  it('should do something', function () {
    expect(!!mdUtils).toBe(true);
  });

});
