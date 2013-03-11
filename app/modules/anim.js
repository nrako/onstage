define([
  'backbone',
  // Application.
  'app',

  // Views
  'modules/anim/views'
],

// Map dependencies from above array.
function(Backbone, app, Views) {
  'use strict';

  // Create a new module.
  var Anim = app.module();

  // Default model.
  Anim.Model = Backbone.Model.extend({
    view: null,

    defaults: {
      // on def change others properties must be updated
      def: {
        q:            '$',   // default anim selector query is self $
        auto:         false, // auto start with previous element (withprevious|afterprevious|bool)
        order:        Infinity,
        delay:        null,
        duration:     null,
        triggers:     null,
        direction:    'asc',

        classes:      null,
        defaultClass: null
      },
      // TODO in docs type can receive either animation, transition or sound
      type:       'transition',
      name:       '',
      path:       '',
      // have a look at http://www.html5rocks.com/en/tutorials/async/deferred/
      auto:       false, // auto start with previous element (withprevious|afterprevious|bool)
      order:      Infinity,
      delay:      null,
      enabled:    true,
      triggers:   null,
      duration:   null,
      direction:  'asc',
      childrens:  null
    },

    initialize: function() {
      this.set('childrens', new Anim.Collection());
      this.on('change:path', function () {
        console.log('use new path to rettrieve element and reattach view', arguments);
        // TODO update name this.getElName(el)
      });
    },
    validate: function() {
      // TODO
      //console.log('validate', arguments, this);
    },
    playIn: function() {
      this.trigger('play', 'in');
    },
    playOut: function() {
      this.trigger('play', 'out');
    },
    prepare: function(stepIndex) {
      this.trigger('prepare', stepIndex);
    }
  });

  // Default collection.
  Anim.Collection = Backbone.Collection.extend({
    model: Anim.Model,
    comparator: function(anim) {
      return anim.get('order');
    }
  });

  Anim.Views = Views;

  // Return the module for AMD compliance.
  return Anim;

});
