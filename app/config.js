// Set the require.js configuration for your application.
require.config({
  useStrict: true,

  // Initialize the application with the main application file.
  deps: ['main'],

  paths: {
    // JavaScript folders.
    //bower: '../components',
    //vendor: "../assets/vendor",

    // Libraries.
    jquery: '../components/jquery/jquery',
    lodash: '../components/lodash/lodash',
    keymaster: '../components/keymaster/keymaster',
    backbone: '../components/backbone/backbone',
    layoutmanager: '../components/layoutmanager/backbone.layoutmanager',
    shortcuts: '../components/backbone-shortcuts/backbone.shortcuts'
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

});
