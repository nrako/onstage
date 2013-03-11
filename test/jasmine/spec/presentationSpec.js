/* global describe, expect, it, beforeEach, afterEach, waitsFor */

define(['modules/presentation'], function(Presentation) {
  'use strict';

  describe('Presentation Model', function() {

    it('default lang should be "en"', function() {
      var presentation = new Presentation.Model();
      expect(presentation.get('lang')).toBe('en');
    });
  });
});
