'use strict';

describe('Directive: fileList', function () {

  // load the directive's module
  beforeEach(module('goboxWebapp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<file-list></file-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fileList directive');
  }));
});
