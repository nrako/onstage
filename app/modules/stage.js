define([
  'lodash',
  'backbone',
  // Application.
  'app',

  // Views
  'modules/stage/views',
  'modules/presentation'
],

// http://andyet.net/blog/2011/feb/15/re-using-backbonejs-models-on-the-server-with-node/

// Map dependencies from above array.
function(_, Backbone, app, Views, Presentation) {
  'use strict';
  // Create a new module.
  var Stage = app.module();

  Stage.Views = Views;

  // TODO the stage should provides the complete states details of every presentations
  // which are in the stage, including which step on each slides has been left on or
  // which slide on each presentations has been left on
  // Slide.Model.prototype.getCurrentStep shouldn't exists and this information should
  // be available trough the Stage.Model
  Stage.Model = Backbone.Model.extend({
    defaults: {
      step:           null,
      slide:          null,
      presentation:   null,
      presentations:  null,
      // state Tree
      state: {},
      history: [
        'presId1/slideId1/0',
        'presId1/slideId1/1',
        'presId2/slideIda/0'
      ]
    },

    initialize: function() {
      this.set('presentations', new Presentation.Collection());

      this.on('change:presentation', function(stage, presentation) {
        var state = this.get('state');

        if (_.isUndefined(state[presentation.id || presentation.cid]))
          state[presentation.id || presentation.cid] = {};

        this.set('state', state);

        app.trigger('stage:presentation', presentation.get('code'), presentation, this.previous('presentation'));

        var stateSlide = _.first(_.where(state[presentation.id], {'current': true}));

        if (!stateSlide)
          return;

        var slideId = _.keys(stateSlide)[0],
            slide = null;

        if (slideId.substr(0, 1) === 'c')
          slide = presentation.get('slides').getByCid(slideId);

        if (!slide)
          slide = presentation.get('slides').get(slideId);

        if (slide)
          this.set('slide', slide);
      });

      this.on('change:slide', function(stage, slide) {
        var state     = this.get('state'),
            pres      = this.get('presentation'),
            presState = state[pres.id || pres.cid];

        _.each(presState, function (slide, slideId) {
          slide.current = false;
        });

        if (_.isUndefined(presState[slide.id || slide.cid]))
          presState[slide.id || slide.cid] = {current: true, step: null};
        else
          presState[slide.id || slide.cid].current = true;

        this.set('state', state);

        app.trigger('presentation-' + this.get('presentation').cid + ':slide', slide.get('code'), slide, this.previous('slide'));
      });

      this.on('change:step', function (stage, step) {
        var state = this.get('state'),
            pres  = this.get('presentation'),
            slide = this.get('slide');

        state[pres.id || pres.cid][slide.id || slide.cid].step = step.id || step.cid;

        this.set('state', state);

        app.trigger('slide-' + this.get('slide').cid + ':step', step.get('order'), step, this.previous('step'));
      });
    },

    getStates: function() {
      return _.pick(this.attributes, 'presentation', 'slide', 'step');
    },
    getCurrentStep: function() {
      var currentSlide = this.getCurrentSlide();
      return currentSlide ? currentSlide.step : null;
    },
    getCurrentSlide: function() {
      var state = this.get('state'),
          pres  = this.get('presentation');

      return _.find(state[pres.id || pres.cid], function (value) {
        return value.current === true;
      });
    }
  });

  // Return the module for AMD compliance.
  return Stage;
});
