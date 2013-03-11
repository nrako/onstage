
define([
  // Libs
  'lodash',
  'backbone',

  'app',

  'modules/anim',
  'modules/step'
],

function(_, Backbone, app, Anim, Step) {
  'use strict';

  var Views = {};

  Views.Slide = Backbone.View.extend({
    className:  'slide',
    tagName:    'section',
    template:   'slide',
    events: {
      'webkitTransitionEnd':    'transitionEnd'
    },

    initialize: function() {
      app.on('slide-' + this.model.cid + ':step', this.showStep, this);

      this.model.on('view:class', function (cls) {
        this.$el.addClass(cls);
      }, this);
    },

    afterRender: function() {
      _.each(this.model.getAllFlattenAnims(), function(anim) {
        var viewAnim = new Anim.Views.Element({model: anim});
        var el = this.$el.find(anim.get('path')).get(0);
        if (el)
          viewAnim.setElement(el);

        anim.on('change:path', function(model, path) {
          var el = this.$el.find(path).get(0);
          if (el)
            viewAnim.setElement(el);
        }, this);
      }, this);
      this.prepare(this.model.getCurrentStep());
    },

    serialize: function() {
      return {
        slide: this.model.toJSON()
      };
    },

    showStep: function(toIndex, to, from) {
      // TODO think of a way to abort showStep? if (app.trigger('beforeShopStep:id', ...) === false) return;?
      if (to instanceof Step.Model)
        to.playIn();

      if (from instanceof Step.Model && from.get('order') > toIndex)
        from.playOut();
    },

    /**
     * prepare is called for each slide on render to hide or show
     * animated elements depending on current step
     *
     * prepare will not execute animations with delay as showStep does
     *
     * @param  {Number} step index reference for current step
     * @return {Object} this for chainability
     */
    prepare: function(stepIndex) {
      var step = stepIndex;

      if (_.isFinite(stepIndex))
        step = this.model.get('steps').at(stepIndex);

      if (!(step instanceof Step.Model))
        return;

      this.model.get('steps').each(function(step) {
        step.prepare(step.get('order'));
      });
    },

    transitionEnd: function() {
      //console.log('trans end');
    }
  });

  return Views;

});
