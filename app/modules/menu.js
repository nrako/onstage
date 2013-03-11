define([
  // Application.
  'app',

  // Views
  'modules/menu/views'
],

// Map dependencies from above array.
function(app, Views) {
  'use strict';

  // Create a new module.
  var Menu = app.module();
  /*
  // Default model.
  Menu.Model = Backbone.Model.extend({

  });

  // Default collection.
  Menu.Collection = Backbone.Model.extend({
    model: Menu.Model
  });
   */

  Menu.Views = Views;

  // Return the module for AMD compliance.
  return Menu;

});
