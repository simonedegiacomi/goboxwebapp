'use strict';

describe('Filter: iconFilter', function () {

  // load the filter's module
  beforeEach(module('goboxWebapp'));

  // initialize a new instance of the filter before each test
  var iconFilter;
  beforeEach(inject(function ($filter) {
    iconFilter = $filter('iconFilter');
  }));

  it('should return the input prefixed with "iconFilter filter:"', function () {
    var text = 'angularjs';
    expect(iconFilter(text)).toBe('iconFilter filter: ' + text);
  });

});
