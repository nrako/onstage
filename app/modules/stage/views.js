define([
  // Libs
  'jquery',
  'lodash',
  'backbone',

  'app',

  'modules/presentation'
],

function($, _, Backbone, app, Presentation) {
  'use strict';

  var Views = {};

  Views.Canvas = Backbone.View.extend({
    id:       'canvas',
    template: 'canvas',
    events: {
      'click': 'onClick'
    },

    initialize: function() {
      var resize = _.debounce(this.resize, 400);

      $(window).bind('resize.app', _.bind(resize, this));

      app.on('resize', this.resize, this);
      app.on('expose:toggle', this.toggleExpose, this);

      this.model.get('presentations').on('add', function(pres, collection) {
        var presView = new Presentation.Views.Presentation({id: pres.cid, model: pres});
        this.insertView('#viewpoint', presView);
      }, this);

      this.model.on('change:presentation', function(model, value, options) {
        var prev = this.model.previous('presentation');
        if (prev) prev.trigger('current', false);

        value.trigger('current', true);
      }, this);
    },
    onClick: function() {
      console.log('on click on presentation');
    },
    cleanup: function() {
      $(window).unbind('resize.app');
      app.off('resize', this.resize);
      app.off('expose:toggle', this.toggleExpose);
    },
    resize: function() {
      var scale = this.calcScale();
      if (!scale)
        return;

      $('#viewpoint').css({transform: 'scale('+ scale + ')'});

      var presConfig = this.model.get('presentation').get('config');

      // doesn't need to be done on resize but should be called on each slide changes
      var pos = this.calcMargins();
      $('#stage .presentation.' + app.config.presentationClass + ' .' + presConfig.slideClasses[0]);
      $('.presentation').css({top: pos[1], left: pos[0]});
    },
    toggleExpose: function() {
      if (this.exposed) {
        this.hideExpose();
      } else {
        this.showExpose();
      }
    },
    showExpose: function() {
      this.exposed = true;
      app.trigger('expose:show');
      this.$el.addClass('expose');
    },
    hideExpose: function() {
      this.exposed = false;
      app.trigger('expose:hide');
      this.$el.removeClass('expose');
    },
    calcScale: function() {
      if (!this.model.get('presentation'))
        return;

      var stage = $('#stage'),
          presConfig = this.model.get('presentation').get('config'),
          current = $('#stage .presentation.' + app.config.presentationClass + ' .' + presConfig.slideClasses[0]);

      if (!stage || !current)
        return;

      var sH = stage.innerHeight() / current.outerHeight(true);
      var sW = stage.innerWidth() / current.outerWidth(true);

      return (sH < sW ? sH : sW);
    },
    calcMargins: function() {
      var presConfig = this.model.get('presentation').get('config'),
          current = $('#stage .presentation.' + app.config.presentationClass + ' .' + presConfig.slideClasses[0]);

      if (!current)
        return;

      return [
        (current.outerWidth(true) - current.outerWidth()) / 2 * -1,
        (current.outerHeight(true) - current.outerHeight()) / 2 * -1
      ];
    }
  });

  return Views;

});
