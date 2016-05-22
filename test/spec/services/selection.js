'use strict';

describe('Service: Selection', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var Selection;
  beforeEach(inject(function (_Selection_) {
    Selection = _Selection_;
  }));

  it('should do something', function () {
    expect(!!Selection).toBe(true);
  });

});
