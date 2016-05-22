'use strict';

describe('Service: Previewer', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var Previewer;
  beforeEach(inject(function (_Previewer_) {
    Previewer = _Previewer_;
  }));

  it('should do something', function () {
    expect(!!Previewer).toBe(true);
  });

});
