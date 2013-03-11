/*global key */
define([
  // Libs
  'jquery',
  'lodash',
  'backbone',

  'app'
],

function($, _, Backbone, app) {
  'use strict';

  var Views = {};

  Views.Menu = Backbone.View.extend({
    id:       'menu',
    template: 'menu',
    //className: 'hover',
    events: {
      'mousedown .btn':             'addDown',
      'mouseup .btn':               'removeDown',
      'mouseleave .btn':            'removeDown',
      'click .disabled':            'onPreventDefault',
      'click .btn':                 'onPreventDefault',
      'click .btn.icon-th':         'expose',
      'click .btn.prev':            'navPrev',
      'click .btn.next':            'navNext',
      'click .btn.icon-time':       'watchlater',
      'click .btn.icon-fullscreen': 'fullscreen'
    },
    shortcuts: {
      'left':         'navPrev',
      'right':        'navNext',
      'space':        'navNext',
      'shift+left':   'navPrevSlide',
      'shift+right':  'navNextSlide',
      // TODO make it works
      '?':            'help'
    },
    initialize: function() {
      _.extend(this, new Backbone.Shortcuts());
      this.delegateShortcuts();
      /*
      var tr = _.throttle(function () {
        console.log('hide', arguments);
      }, 2000);

      var sh = _.throttle(function () {
        console.log('show', arguments);
      }, 50);

      $(document).on('mousemove', function () {
        sh.apply(this, arguments);
        tr.apply(this, arguments);
      });
       */

      app.on('expose:show', this.exposeOn, this);
      app.on('expose:hide', this.exposeOff, this);
    },
    cleanup: function() {
      app.off('expose');
    },
    addDown: function(e) {
      $(e.currentTarget).addClass('down');
    },
    removeDown: function(e) {
      $(e.currentTarget).removeClass('down');
    },
    onPreventDefault: function(e) {
      e.preventDefault();
    },
    // http://tympanus.net/codrops/2012/09/13/button-switches-with-checkboxes-and-css3-fanciness/
    exposeOn: function() {
      $('.btn.icon-th').addClass('toggleon');
    },
    exposeOff: function() {
      $('.btn.icon-th').removeClass('toggleon');
    },
    expose: function(e) {
      app.trigger('expose:toggle');
    },
    navNext: function(e) {
      app.trigger(key.shift ? 'nav:nextslide' : 'nav:next');
    },
    navPrev: function(e) {
      app.trigger(key.shift ? 'nav:prevslide' : 'nav:prev');
    },
    navNextSlide: function(e) {
      app.trigger('nav:nextslide');
    },
    navPrevSlide: function(e) {
      app.trigger('nav:prevslide');
    },
    fullscreen: function(e) {
      app.trigger('view:fullscreen');

      if (document.webkitIsFullScreen)
        document.webkitCancelFullScreen();
      else
        $('#main').get(0).webkitRequestFullScreen();
    },
    watchlater: function(e) {
      // TODO
      $(e.currentTarget).toggleClass('on');
    },
    help: function() {
      console.log('help');
    }
  });

  return Views;

});
