define([
  'lodash',
  'backbone',
  // Application.
  'app',

  'modules/step',
  'modules/anim',

  // Views
  'modules/slide/views'
],

// Map dependencies from above array.
function(_, Backbone, app, Step, Anim, Views) {
  'use strict';

  // Create a new module.
  var Slide = app.module();

  // Default model.
  Slide.Model = Backbone.Model.extend({
    defaults: {
      html:         '',
      code:         'slide0',
      order:        0,
      title:        'Slide 0',
      steps:        null,
      dataAnim:     null,
      animations:   null,
      backgrounds:  [],
      animConfig: {
        defaultClass: 'transparent',
        classes: {
          'in': 'fadein',
          'out': 'fadeout'
        }
      }
    },

    // this property wouldn't be synched but would be available as a state client-side property
    _currentStep: null,

    initialize: function() {
      this.set('steps', new Step.Collection());
      this.set('animations', new Anim.Collection());

      app.on('slide-' + this.cid + ':step', function(stepIndex, to, from) {
        this._currentStep = to;
      }, this);
    },

    getAnimsAt: function(index) {
      return this.get('steps').at(index).get('anims').toArray();
    },
    getAllFlattenAnims: function() {
      return this.get('animations').toArray()
        .concat(_.flatten(_.pluck(this.get('animations').pluck('childrens'), 'models')));
    },
    /* is it still needed if yes it requires corrections
    getAnimsRange: function(start, end) {
      var steps = this.get('steps').toArray().slice(start || 0, end);

      var anims = _.map(steps, function(step) {
        return step.get('anims').toArray();
      });

      return anims;
    },
     */

    // TODO get ride of getCurrentStep and _currentStep go trough stage instead
    getCurrentStep: function() {
      if (this._currentStep === null && this.get('steps').length) {
        this._currentStep = this.get('steps').at(0);
      }
      return this._currentStep;
    },

    parseSteps: function() {
      var steps = [],
          order = 0;

      this.get('animations').each(function (anim, index) {
        var key = index + '';

        if (index === 0)
          return steps.push(new Step.Model({order: order++}));

        if (anim.get('enabled')) {
          if (anim.get('auto') === false || anim.get('childrens').length) {
            var step = new Step.Model({
              order: order++,
              keys: [key]
            });
            step.get('anims').add(anim);
            steps.push(step);
          } else {
            _.last(steps).get('keys').push(key);
            _.last(steps).get('anims').add(anim);
          }
        }

        anim.get('childrens').each(function(childAnim, childIndex) {
          if (!childAnim.get('enabled'))
            return;

          var childKey = key + '|' + childIndex + '';

          if (childAnim.get('auto') === false) {
            var step = new Step.Model({
              order: order++,
              keys: [childKey]
            });
            step.get('anims').push(childAnim);
            steps.push(step);
          } else {
            _.last(steps).get('keys').push(childKey);
            _.last(steps).get('anims').add(childAnim);
          }
        });
      });

      this.get('steps').add(steps);

      return this;
    }
  });

  // Default collection.
  Slide.Collection = Backbone.Collection.extend({
    model: Slide.Model,
    comparator: function(slide) {
      return slide.get('order');
    },

    // TODO indexCodeOrId argument
    getSlide: function(codeOrId) {

      // if argument is a finite number
      if (_.isFinite(parseInt(codeOrId, 10)))
        // get slide by index order
        return this.at(codeOrId);

      // get slide by codename
      return this.find(function(slide) {return slide.get('code') === codeOrId;});
    }
  });

  Slide.Views = Views;

  // Return the module for AMD compliance.
  return Slide;

});
