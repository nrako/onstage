
define([
  'lodash',
  'app',

  // Libs
  'backbone'
],

function(_, app, Backbone) {
  'use strict';

  var Views = {};

  Views.Element = Backbone.View.extend({
    events: {
      'webkitAnimationStart': 'animationStart',
      'webkitAnimationIteration': 'animationIteration',
      'webkitAnimationEnd': 'animationEnd',
      'webkitTransitionEnd': 'transitionEnd'
    },
    animationsCls: [],
    initialize: function() {
      this.$el.data('direction', 'in');

      this.model.on('prepare', this.prepare, this);
      this.model.on('play', this.play, this);
    },
    animationStart: function() {
      this.model.trigger('animationStart', this);
      console.log('animation Start');
    },
    animationIteration: function() {
      console.log('animation Iteration');
    },
    animationEnd: function() {
      this.model.trigger('animationEnd', this);
      //this.$el.css('-webkit-animation-play-state', 'paused');
    },
    transitionEnd: function() {
      this.model.trigger('animationEnd', this);
      console.log('transition End');
    },
    prepare: function(stepIndex) {
      switch (this.model.get('type')) {
        case 'animation':
          console.warn('NOT IMPLEMENTED');
          this.$el.css('-webkit-animation-play-state', 'paused');
          this.$el.addClass('fadein');
          break;

        case 'transition':
          var def = this.model.get('def');

          this.$el.addClass(def.defaultClass);

          var cls = this._getClass('in');

          //this.animationsCls = this.animationsCls.concat(cls);

          //this.$el.addClass(this.animationsCls.join(' '));
          break;

        default:

          break;
      }
    },
    play: function(direction) {
      if (direction !== 'out') direction = 'in';

      this._clear();

      switch (this.model.get('type')) {
        case 'animation':
          console.warn('NOT IMPLEMENTED');
          this.$el.css('-webkit-animation-direction', this.$el.data('direction') === 'in' ? 'reverse': 'normal');
          this.$el.removeClass('pfff').width();
          this.$el.addClass('pfff');

          this.$el.data('direction', this.$el.data('direction') === 'in' ? 'out' : 'in');
          this.$el.css('-webkit-animation-play-state', 'running');
          break;

        case 'transition':
          var cls = this._getClass(direction);

          this.animationsCls = this.animationsCls.concat(cls);

          this.$el.addClass(this.animationsCls.join(' '));

          break;

        default:

          break;
      }
    },
    _clear: function() {
      _.each(this.animationsCls, function(cls) {
        this.$el.removeClass(cls);
      }, this);
      this.animationsCls = [];
    },
    _getClass: function(directionOrPos) {
      var classes = this.model.get('def').classes;
      if (_.isObject(classes)) {
        if (!_.isUndefined(classes[directionOrPos]))
          return classes[directionOrPos];

        return '';
      }

      if (_.isString(classes))
        return classes[directionOrPos];

      return '';
    }
  });

  return Views;

});
