// somehow jshint bug on HTMLSpanElement even with browser true
/*global HTMLSpanElement */

define([
  'jquery',
  'lodash',
  'backbone',
  // Application.
  'app',
  'modules/presentation',
  'modules/slide',
  'modules/anim'
],

// Map dependencies from above array.
function($, _, Backbone, app, Presentation, Slide, Anim) {
  'use strict';

  // Create a new module.
  var Template = app.module();

  // Default model.
  Template.Model = Backbone.Model.extend({

  });

  // Default collection.
  Template.Collection = Backbone.Collection.extend({
    model: Template.Model
  });

  Template.Views.Template = Backbone.View.extend({
    manage: true,
    events: {},
    initialize: function() {

    },
    getPresentation: function(pres, def) {
      var $pres = $(pres),
          presId = $pres.attr('id');

      var presentation = new Presentation.Model(_.extend({}, def || {}, {
        id:   presId,
        name: $pres.children('h1').first().text(),
        code: presId
      }));

      var slides = [];

      $pres.children('section').each($.proxy(function(index, slideEl) {
        var slide = this.getSlide(slideEl, {
          order: index
        });
        slides.push(slide);
      }, this));

      presentation.get('slides').add(slides);

      return presentation;
    },
    getSlide: function(slideEl, def) {
      var $slide = $(slideEl),
          title = $slide.attr('title');

      var slide = new Slide.Model(_.extend({}, def || {}, {
        title:    _.isUndefined(title) ? 'Slide ' + Date.now() : title,
        code:     _.isUndefined(title) ? 'slide-' + Date.now() : title.replace(/[^a-zA-Z0-9\-_]/g, '').toLowerCase(),
        html:     $slide.html()
      }));

      var animations = [];

      // insert anim for step 0
      animations.push(this.getAnim(null, {order: 0}));

      // find all slide childs elements with data-anim attribute + slide[data-anim]
      var animateds = $slide.find('[data-anim]');
      if ($slide.attr('anim'))
          animateds.add($slide);

      animateds.each($.proxy(function (index, el) {
        var datas = _.sortBy([].concat($(el).data('anim')), 'order');
        datas = _.map(datas, function(data) {
          return _.extend({}, slide.get('animConfig'), data);
        });
        var anims = this.getAnims(el, datas);

        animations = animations.concat(anims);
      }, this));

      if (animations.length > 1)
        slide.get('animations').add(animations);

      slide.parseSteps();

      return slide;
    },
    getAnims: function(animatedEl, data,  def) {
      var $animated = $(animatedEl);

      var anims = [];

      _.each([].concat(data), function (dataAnim) {
        anims.push(this.getAnim(animatedEl, dataAnim, def));
      }, this);

      return anims;
    },
    getAnim: function(animatedEl, dataAnim, def) {
      var $animated = $(animatedEl),
          $slide = $animated.closest('section');

      var aDef = _.extend({}, Anim.Model.prototype.defaults.def, dataAnim);

      var anim = new Anim.Model(_.extend({}, def || {}, {
        def:    aDef,
        name: this.getElName(animatedEl),
        path: this.getPathUpTo(animatedEl, $slide.get(0)),
        auto:   aDef.auto,
        order:  aDef.order
      }));

      if (animatedEl !== null && $slide.find(anim.get('path')).get(0) !== animatedEl)
        console.error('Error path ' + anim.get('path') + ' is wrong', animatedEl);

      if (_.isUndefined(aDef.q) || !_.isString(aDef.q))
        return anim;

      var selectors = aDef.q.split(',');
      var fLength = selectors.length;

      // $ selector has always the priority
      selectors = _.reject(selectors, function (selector) {
        return $.trim(selector) === '$';
      });

      // if $ self selector was not in the array
      if (selectors.length > 0 && selectors.length === fLength) {
        // root element must not be animated
        anim.set('enabled', false);
      }

      if (selectors.length === 0)
          return anim;

      // proceed with childrens animations
      var subDataAnim = _.clone(dataAnim);
      subDataAnim.q = '$';

      var childrens = [];

      _.forEach(selectors, function (selector) {
        // clean selector
        selector = $.trim(selector);

        subDataAnim.q = '$';

        $animated.find(selector).each($.proxy(function (index, subel) {
          childrens = childrens.concat(this.getAnims(subel, subDataAnim));
        }, this));

        if (subDataAnim.direction === 'desc')
          childrens = childrens.reverse();

      }, this);

      anim.get('childrens').add(childrens);

      return anim;
    },

    /**
     * return the full absolute (jquery) path from an element up to an another element
     * @param  {domelement} el dom element
     * @return {string}    jquery absolute path to the slide element
     */
    getPathUpTo: function(el, stopEl) {
      var $el = $(el);

      if ($el.length === 0)
        return '';

      if ($el.is(stopEl))
        return '';

      var result = el.tagName + ':eq(' + $el.parent().find(el.tagName).index(el) + ')',
          pare   = $el.parent();

      if (pare.is(stopEl))
        return result;

      return [this.getPathUpTo(pare.get(0), stopEl), result].join(' ');
    },

    /**
     * return a human friendly automatic name from an element
     * @param  {domelement} el the dom element to call in a friendlier manner
     * @return {string}    the friendly name of the element
     */
    getElName: function(el) {
      if (!el)
        return '{empty}';

      if (el instanceof HTMLHeadingElement)
        return 'Title : ' + $(el).text();

      if (el instanceof HTMLUListElement)
        return 'Unordered list';

      if (el instanceof HTMLOListElement)
        return 'Ordered List';

      if (el instanceof HTMLLIElement)
        return 'List item : ' + $(el).text();

      if (el instanceof HTMLSpanElement ||
          el instanceof HTMLParagraphElement)
        return 'Text : ' + $(el).text();

      if (el instanceof HTMLElement) {
        if (el.tagName.toLowerCase() == 'section' && $(el).hasClass('slide'))
          return 'Slide';
      }

      if (el instanceof HTMLDivElement)
        return 'Container :' + $(el).text().substr(0, 15);

      return 'Element : ' + $(el).text();
    }
  });

  // Return the module for AMD compliance.
  return Template;

});
