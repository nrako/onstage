define([
  // Libs
  'lodash',
  'backbone',
  // Application.
  'app',

  'modules/slide',
  'modules/background'
],

// Map dependencies from above array.
function(_, Backbone, app, Slide, Background) {
  'use strict';

  // Create a new module.
  var Presentation = app.module();

  // Default model.
  Presentation.Model = Backbone.Model.extend({
    defaults: {
      name: 'Presentation X',
      lang: 'en',
      code: 'X',
      slides: null,
      username: 'local',
      config: {
        slideClasses: {
          '-2': 'farprev',
          '-1': 'prev',
          0:    'current',
          1:    'next',
          2:    'farnext'
        },
        // If defined this override the default configuration for all slides _.extend(defaultSlideConfig || defaultConfig, slideConfig)
        // defaultSlideConfig: null,
        backgroundClass: 'background'
      },
      backgrounds: null
    },

    initialize: function() {
      this.set('slides', new Slide.Collection());
      this.set('backgrounds', new Background.Collection());

      this.get('slides').on('add', function(slide) {
        //console.log('slide added to presentation', slide, arguments, this);
      });

      this.get('slides').on('remove', function(slide) {
        //console.log('slide removed from presentation', slide, arguments, this);
      });

      this.get('slides').on('change:order', function() {
        //console.log('slides order should be rearranged', arguments);
      });
    }
  });

  // Default collection.
  Presentation.Collection = Backbone.Collection.extend({
    model: Presentation.Model
  });

  Presentation.Views.Presentation = Backbone.View.extend({
    className:  'presentation',
    template:   'presentation',

    initialize: function() {
      this.model.get('slides').on('add', this.addSlide, this);
      this.model.get('slides').each(this.addSlide, this);

      app.on('presentation-' + this.model.cid + ':slide', function (slideRef, slide) {
        this.showSlide(slide);
      }, this);

      this.model.on('current', function (isCurrent) {
        if (isCurrent)
          this.$el.addClass(app.config.presentationClass);
        else
          this.$el.removeClass(app.config.presentationClass);
      }, this);
    },
    serialize: function() {
      return {
        pres: this.model.toJSON()
      };
    },

    afterRender: function() {
      app.trigger('resize');
    },

    addSlide: function (slide) {
        var slideview = new Slide.Views.Slide({
          id:     slide.cid,
          model:  slide
        });

        this.insertView(slideview);

        if (arguments.length !== 3)
          slideview.render();
    },

    /**
     * Show a slide
     * @param  {mixed(Slide|id|index)} slideRef A reference to a slide could be an index, a slide id or
     *                                          slide object
     * @return {[type]}          [description]
     */
    showSlide: function(slideRef) {
      var slide = slideRef;

      if (!(slide instanceof Slide.Model))
        // TODO user this.model.get('slides').getSlide() (need argument indexCodeOrId)
        slide = _.isFinite(slideRef) ? this.model.get('slides').at(slideRef) : this.model.get('slides').getById(slideRef);

      if (!(slide instanceof Slide.Model))
        return this;

      var config = this.model.get('config');

      var keys = _.sortBy(
        _.keys(config.slideClasses),
        function(num){ return Math.sin(parseInt(num, 10)); });

      var curIndex = this.model.get('slides').indexOf(slide);

      keys.forEach(function (key) {
        var s   = this.model.get('slides').at(curIndex + parseInt(key, 10)),
            cls = config.slideClasses[key];

        this.$el.find('.' + cls).removeClass(cls);

        if (!s)
          return;

        s.trigger('view:class', cls);
      }, this);

      app.trigger('resize');

      return this;
    }
  });

  // Return the module for AMD compliance.
  return Presentation;

});
