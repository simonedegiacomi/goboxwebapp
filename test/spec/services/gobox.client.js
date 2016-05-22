'use strict';

describe('Service: gobox.client', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var gobox.client;
  beforeEach(inject(function (_gobox.client_) {
    gobox.client = _gobox.client_;
  }));

  it('should do something', function () {
    expect(!!gobox.client).toBe(true);
  });

});
