define([
  'backbone',
  // Application.
  'app',

  'modules/anim'
],

// Map dependencies from above array.
function(Backbone, app, Anim) {
  'use strict';

  // Create a new module.
  var Step = app.module();

  // Default model.
  Step.Model = Backbone.Model.extend({
    defaults: {
      order: 0,
      keys: [],
      anims: null
    },

    anim: false,

    initialize: function() {
      this.set('anims', new Anim.Collection());
    },
    playIn: function() {
      if (!this.get('anims').length)
        return;

      this.get('anims').first().playIn();
    },
    playOut: function() {
      if (!this.get('anims').length)
        return;

      this.get('anims').last().playOut();
    },
    prepare: function(stepIndex) {
      this.get('anims').each(function (anim) {
        anim.prepare(stepIndex);
      });
    }
  });

  // Default collection.
  Step.Collection = Backbone.Collection.extend({
    model: Step.Model
  });

  // Return the module for AMD compliance.
  return Step;

});
