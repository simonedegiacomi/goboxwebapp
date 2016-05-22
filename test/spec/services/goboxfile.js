'use strict';

describe('Service: GoBoxFile', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var GoBoxFile;
  beforeEach(inject(function (_GoBoxFile_) {
    GoBoxFile = _GoBoxFile_;
  }));

  it('should do something', function () {
    expect(!!GoBoxFile).toBe(true);
  });

});
