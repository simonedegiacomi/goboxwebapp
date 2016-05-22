'use strict';

describe('Service: Kind', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var Kind;
  beforeEach(inject(function (_Kind_) {
    Kind = _Kind_;
  }));

  it('should do something', function () {
    expect(!!Kind).toBe(true);
  });

});
