'use strict';

describe('Service: MyWS', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var MyWS;
  beforeEach(inject(function (_MyWS_) {
    MyWS = _MyWS_;
  }));

  it('should do something', function () {
    expect(!!MyWS).toBe(true);
  });

});
