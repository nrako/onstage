

Onstage (WIP)
====================

(Work In Progress) HTML5 presentation for the real world (wide web)

## Introduction

*Again this is a work in progress, and it's not ready for prime-time and I don't advise anyone to
use it. Refactoring in progress!*

HTML5 presentation framework with emphasis on modern browser.

Built with:

* Grunt v0.4
* Backbone + lodash
* Bower
* RequireJS (AMD) + AlmondJS
* Stylus — css preprocessor
* Jade — html preprocessor
* Jasmine
* Testacular
* ...

The most usefull javascript frontend state-of-the-arts tools!

## TODO

A lot, FYI a lot of refactoring and stripping is planified.

* Implement Testacular
* Code some Jasmine tests before the refactoring phase
* Refactor animations to switch for a requestAnimationFrame based aniamtion library
* Get ride of jQuery
* ... (on and on)
* ...
* Docs

## Installation

    npm install

## Test

(WIP)

    grunt test  // run jshint and jasmine

## Documentions

    $ grunt docs // generate /docs folder content

## Motivation

Yet an another presentation library?

* [impress.js](https://github.com/bartaz/impress.js/) — HTML Prezy like
* [io-2002-slides](https://code.google.com/p/io-2012-slides/) — Google IO slide deck
* [Reveal.js](https://github.com/hakimel/reveal.js) — Nested slides, markdown etc.
* [CSSS](https://github.com/LeaVerou/CSSS) — CSS-based SlideShow System
* [Flowtime.js](https://github.com/marcolago/flowtime.js) — HTML5/CSS3/JS Presentation Framework
* [Deck.js](https://github.com/imakewebthings/deck.js) — Modern HTML Presentations

You may want to use one of them, at least for now, or you might be interested in this tool if you want
a tool that aim to support the following statements :

*Life is too short and Web technologies advances too fast to care for older browsers.*

HTML5 is ready and is the best solution for presentation content not Flash, Canvas, or html4 with
polyfills. Cross-old-browser compability is not a priority.

*A presentation without a voice, a video or a soundtrack is utterly rubbish!*

A presentation support a story which follow a simple timeline, a presentation doesn't have any
meaning only by itself.

This library will not provide complicate navigation, or allows presentation with sub-chapter,
nested slides or any other fancy navigation.

This tool aim to allow a presentation cohexist with something else, it may be a real human
presenter, or a media.

In the future, features may look like that:

* HTML/CSS based presentation content with support for preprocessor.
* Provide full ability to shape and style the slides and backgrounds.
* Doesn't force any animation, none, opacity transition, transform matrix3d... whatever you like.
* Cool friendly URL with pushState history API
* Fragments support for step by step navigation inside a slide — with normal behaviour.
* Simple navigation following a timeline, no sub-chapter or nested slides.
* Keyboard shortcuts for navigation.
* Overview mode.
* Responsive, it scale to any screen size, with or without the use of media queries.
* Grunt tasks providing a server with livereload to edit the presentation, watch task to preprocess
your markdown content etc.
* an API.
* Provide a real timeline!
* Work on mobile pad (with webkit updated)
* ... and more that I can't disclose now ;)

This library will most definitevly make use of cool new HTML5 features such as Shadow DOM, WebRTC etc.
— So yes I don't care of IE or older browsers, I don't have time to handle this.
I keep this kind of boring headach for the paying job.

And of course in the end, a lot of motivation came from the opportunity to play with new technologies,
putting togethers the best frontend tools to build a cool project and have fun by testing the new
incoming HTML5/CSS3 stuff.
