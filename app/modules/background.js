define([
  'backbone',
  // Application.
  'app'
],

// Map dependencies from above array.
function(Backbone, app) {
  'use strict';

  // Create a new module.
  var Background = app.module();

  // Default model.
  Background.Model = Backbone.Model.extend({
    defaults: {
      html:   '',
      hidden: true
    }
  });

  // Default collection.
  Background.Collection = Backbone.Collection.extend({
    model: Background.Model
  });

  Background.Views.BgStage = Backbone.View.extend({
    className:  'bgstage',
    template:   'bgstage'
  });

  // Return the module for AMD compliance.
  return Background;

});
