/* global describe, expect, it, beforeEach, afterEach, waitsFor */

define(['modules/slide'], function(Slide) {
  'use strict';

  describe('Slide Model', function() {

    it('default code should be "slide0"', function() {
      var slide = new Slide.Model();
      expect(slide.get('code')).toBe('slide0');
    });
  });
});
