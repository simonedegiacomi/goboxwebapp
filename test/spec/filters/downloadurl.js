'use strict';

describe('Filter: DownloadUrl', function () {

  // load the filter's module
  beforeEach(module('goboxWebapp'));

  // initialize a new instance of the filter before each test
  var DownloadUrl;
  beforeEach(inject(function ($filter) {
    DownloadUrl = $filter('DownloadUrl');
  }));

  it('should return the input prefixed with "DownloadUrl filter:"', function () {
    var text = 'angularjs';
    expect(DownloadUrl(text)).toBe('DownloadUrl filter: ' + text);
  });

});
