/* global describe, expect, it, beforeEach, afterEach, waitsFor */

define(['modules/presentation'], function(Presentation) {
  'use strict';

  describe('Presentation Local', function() {

    it('username should be "local"', function() {
      var presentation = new Presentation.Model();
      expect(presentation.get('username')).toBe('local');
    });
  });
});
