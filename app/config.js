/* global module */
(function() {
  'use strict';
  var globalRequire = require;

  // this clojure only avoid jshint warning: 'require' is already defined
  (function() {
    // use of config object literal declaration to make it compatible with node, browser and build (r.js)
    // https://github.com/jrburke/r.js/commit/90de41458355b326a304ad21d0c3589327d01540
    var require = {
      useStrict: true,

      // Initialize the application with the main application file.
      deps: ['main'],

      paths: {
        // JavaScript folders.
        //bower: '../components',
        //vendor: "../assets/vendor",

        // Libraries.
        jquery: '../components/jquery/jquery',
        lodash: '../components/lodash/dist/lodash.underscore',
        keymaster: '../components/keymaster/keymaster',
        backbone: '../components/backbone/backbone',
        layoutmanager: '../components/layoutmanager/backbone.layoutmanager',
        shortcuts: '../components/backbone-shortcuts/backbone.shortcuts',
        underscore: '../components/underscore/underscore'
      },

      shim: {
        // Backbone library depends on lodash and jQuery.
        backbone: {
          deps: ['lodash', 'jquery'],
          exports: 'Backbone'
        },

        layoutmanager: ['backbone'],
        shortcuts: ['backbone', 'keymaster']
      }

    };

    // exports requirejs config for node (e.g for grunt jasmine)
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      // remove config.dependencies
      delete require.deps;
      require.baseUrl = './app/';
      module.exports = require;
    } else {
      // run require.config for browsers
      globalRequire.config(require);
    }
  })();
})();
