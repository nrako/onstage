define([
  // Application.
  'app',

  // Views
  'modules/debug/views'
],

// Map dependencies from above array.
function(app, Views) {
  'use strict';

  // Create a new module.
  var Debug = app.module();
  /*
  // Default model.
  Debug.Model = Backbone.Model.extend({

  });

  // Default collection.
  Debug.Collection = Backbone.Model.extend({
    model: Debug.Model
  });
   */

  Debug.Views = Views;

  // Return the module for AMD compliance.
  return Debug;

});
