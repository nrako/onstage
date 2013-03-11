define([
  // Libraries.
  'jquery',
  'lodash',
  'backbone',

  // Plugins.
  'layoutmanager',
  'shortcuts'
],
function($, _, Backbone) {
  'use strict';
  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application through.

    IS_TOUCH_DEVICE: !!( 'ontouchstart' in window ),

    root: '/',
    config: {
      debug: true,
      // Display pogress bar
      progress: true,
      // Enable keyboard navigation
      //keyboard: true, (we dont want the user to be able to remove this feature)
      // Enable mouseWheel navigation
      mouseWheel: true,
      // Automatically hide menu and show on hover
      autoHideMenu: false,
      // Enable geolocation
      enableGeolocation: false,
      // Enable sharing option
      enableSharing: true,
      // Enable transform auto scale
      enableAutoScale: true,

      presentationClass: 'current',
      // If defined this override the default configuration for all presentations _.extend(defaultPresConfig || defaultConf, presConfig)
      // defaultPresConfig: null,
      backgroundClass: 'background'
    }
  };

  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {};

  // Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.LayoutManager.configure({
    // Allow LayoutManager to augment Backbone.View.prototype.
    manage: true,

    prefix: 'app/templates/',

    fetch: function(path) {
      // Concatenate the file extension.
      path = path + '.html';

      // If cached, use the compiled template.
      if (JST[path]) {
        return JST[path];
      }

      // Put fetch into `async-mode`.
      var done = this.async();

      // Seek out the template asynchronously.
      $.get(app.root + path, function(contents) {
        done(JST[path] = _.template(contents));
      });
    }
  });

  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {
    // Create a custom object with a nested Views object.
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Helper for using layouts.
    useLayout: function(options) {
      // Create a new Layout with options.
      var layout = new Backbone.Layout(_.extend({
        el: 'body'
      }, options));

      // Cache the refererence.
      this.layout = layout;
      return layout;
    }
  }, Backbone.Events);

});
