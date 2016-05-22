'use strict';

describe('Filter: preview', function () {

  // load the filter's module
  beforeEach(module('goboxWebapp'));

  // initialize a new instance of the filter before each test
  var preview;
  beforeEach(inject(function ($filter) {
    preview = $filter('preview');
  }));

  it('should return the input prefixed with "preview filter:"', function () {
    var text = 'angularjs';
    expect(preview(text)).toBe('preview filter: ' + text);
  });

});
