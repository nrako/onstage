define([
  'lodash',
  'jquery',
  'backbone',
  // Application.
  'app',

  'modules/stage',
  'modules/menu',
  'modules/presentation',
  'modules/slide',
  'modules/background',
  'modules/template',
  'modules/debug'
],

function(_, $, Backbone, app, Stage, Menu, Presentation, Slide, Background, Template, Debug) {
  'use strict';
  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      '':                                 'index',
      'notfound/:url':                    'notfound',
      'local/:presentation':              'local',
      'local/:presentation/:slide':       'local',
      'local/:presentation/:slide/:step': 'local',
      ':user':                            'list',
      ':user/:presentation':              'show',
      ':user/:presentation/:slide':       'show',
      ':user/:presentation/:slide/:step': 'show',
      //'session/:sessioncode':             'index',
      '*other':                           'index'
    },

    initialize: function() {
      this.stage = new Stage.Model();

      app.on('nav:nextslide', function() {
        var slide = this.stage.get('presentation').get('slides').at(this.stage.get('slide').get('order') + 1);

        if (slide)
          this.navigateTo({slide: slide, step: null});
      }, this);

      app.on('nav:prevslide', function() {
        var slide = this.stage.get('presentation').get('slides').at(this.stage.get('slide').get('order') - 1);

        if (slide)
          this.navigateTo({slide: slide, step: null});
      }, this);

      app.on('nav:next', function() {
        var slide = this.stage.get('slide'),
            step  = slide.get('steps').at(this.stage.get('step').get('order') + 1);

        if (step)
          this.navigateTo({step: step});
        else
          app.trigger('nav:nextslide');
      }, this);

      app.on('nav:prev', function() {
        var slide = this.stage.get('slide'),
            step  = slide.get('steps').at(this.stage.get('step').get('order') - 1);

        if (step)
          this.navigateTo({step: step});
        else
          app.trigger('nav:prevslide');
      }, this);
    },

    index: function() {
      console.log('INDEX ROUTE', arguments);
    },

    local: function(presId, slideRef, stepIndex) {

      this.renderPlayer();

      var presentation = this.stage.get('presentations').get(presId);

      if (!presentation)
        // or try to get presentation from localstore?
        presentation = this._getPresentationFromSource(presId);

      this._validateRoute(presId, slideRef, stepIndex);
    },

    show: function(user, presId, slideRef, stepIndex) {

      this.renderPlayer();

      var presentation = this.stage.get('presentations').get(presId);

      // temp
      if (!presentation) {
        presentation = new Presentation.Model({
          id:       presId,
          name:     'Name ' + presId,
          code:     presId,
          username: user
        });

        this.stage.get('presentations').add(presentation);

        presentation.get('slides').add([{
          title:  'slide 1',
          html:   '<h1>First slide</h1>',
          order:  0
        },{
          title:  'slide 2',
          html:   '<h1>Second slide</h1>',
          order:  1
        }]);
      }

      this._validateRoute(presId, slideRef, stepIndex);
    },

    notfound: function() {
      console.log('404 NOT FOUND!', arguments);
    },

    renderPlayer: function() {
      var layout = app.useLayout({
        id: 'layout',
        template: 'layouts/player',
        className: 'layout player',
        el: null
      });

      if (app.layoutRendered != 'player') {
        layout.setViews({
          '#stage': [new Background.Views.BgStage(), new Stage.Views.Canvas({model: this.stage})],
          '.bottomui': new Menu.Views.Menu({model: this.stage})
        });

        if (app.config.debug) {
          layout.setViews({
            '.topui': new Debug.Views.Menu({model: this.stage})
          });
        }

        $('#main').empty().append(layout.el);

        layout.render().then(function() {
          app.layoutRendered = 'player';
        });
      }
    },

    _getPresentationFromSource: function(presId) {
      var $template = $('#template'),
          pres = $template.find('#' + presId);

      if ($template.length === 0 || pres.length === 0)
        return null;

      var template = new Template.Views.Template();
      template.setElement($template.get(0));

      var presentation =  template.getPresentation(pres);

      this.stage.get('presentations').add(presentation);

      return presentation;
    },

    navigateTo: function(def, trigger) {
      def       = _.extend({}, this.stage.getStates(), def);
      trigger   = trigger !== false;

      if (_.isNull(def.step))
        this.navigate('/' + def.presentation.get('username') +
            '/' + def.presentation.get('code') +
            '/' + def.slide.get('code') +
            (def.slide.get('steps').length ? '/' + def.slide.getCurrentStep().get('order') : ''),
          {trigger: trigger});
      else
        this.navigate('/' + def.presentation.get('username') +
            '/' + def.presentation.get('code') +
            '/' + def.slide.get('code') +
            '/' + def.step.get('order'),
          {trigger: trigger});
    },

    // TODO could add trusted arguments which would indicate that _validateRoute has been called by a trusted sources
    // for e.g. from the menu, from the peer sync websockets etc.
    // In trusted mode instead of /notfound or /error the scripts would try to refresh data from the server
    _validateRoute: function(presId, slideRef, stepIndex) {
      var presentation  = this.stage.get('presentations').get(presId),
          slide         = null,
          step          = null;

      stepIndex = parseInt(stepIndex, 10);

      // TODO try to get presentation from server if user is not === 'local'
      if (!presentation)
        return this.navigate('/notfound', {trigger: true});

      slide = presentation.get('slides').getSlide(slideRef);

      // slide not found, redirect to first slide and print a message
      if (!slide) {
        var firstslide = presentation.get('slides').at(0);

        if (!firstslide)
          return this.navigate('/error/emptypresentation', {trigger: true});

        return this.navigateTo({presentation: presentation, slide: firstslide}, false);
      }

      step = slide.get('steps').at(stepIndex);

      // if stepIndex is out of range
      if (!step && slide.get('steps').length && stepIndex !== 0)
        return this.navigateTo({
            presentation: presentation,
            slide: slide,
            step: slide.get('steps').at(0)
          },
          false);

      // if stepIndex is defined where no steps exists
      if (!slide.get('steps').length && !_.isEmpty(stepIndex))
        return this.navigateTo({presentation: presentation, slide: slide, step: null}, false);

      this.stage.set('presentation', presentation);
      this.stage.set('slide', slide);
      if (step)
        this.stage.set('step', step);
    }
  });

  return Router;
});
