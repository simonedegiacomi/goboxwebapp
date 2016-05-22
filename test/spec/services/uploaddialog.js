'use strict';

describe('Service: UploadDialog', function () {

  // load the service's module
  beforeEach(module('goboxWebapp'));

  // instantiate service
  var UploadDialog;
  beforeEach(inject(function (_UploadDialog_) {
    UploadDialog = _UploadDialog_;
  }));

  it('should do something', function () {
    expect(!!UploadDialog).toBe(true);
  });

});
