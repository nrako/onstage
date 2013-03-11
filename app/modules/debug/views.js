
define([
  'app',

  // Libs
  'backbone'
],

function(app, Backbone) {
  'use strict';

  var Views = {};

  Views.Menu = Backbone.View.extend({
    template: 'debug',
    className:  'debug-menu',
    events: {},
    initialize: function() {
      this.model.on('change:slide', function (model, slide, options) {
        slide.get('steps').each(function (step, index) {
          this.insertView('.debugsteps', new Views.StepDebug({
            model: step,
            keep: true
          }));
        }, this);
        this.render();
      }, this);

    }
  });

  Views.StepDebug = Backbone.View.extend({
    tagName: 'li',
    template:   'debugstep',
    className:  'debug-step',
    events: {},
    initialize: function() {

    },
    serialize: function() {
      return this.model.toJSON();
    }
  });

  return Views;

});
