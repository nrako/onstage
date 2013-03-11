

Onstage (WIP)
====================

(Work In Progress) HTML5 presentation for the real world (wide web)

## Introduction

*Again this is a work in progress, and it's not ready for prime-time and I don't advise anyone to use it. Refactoring in progress!*

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

A lot, and FYI a lot of refactoring and stripping is planified.

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

There is plenty of useful HTML presentation library already:

* [impress.js](https://github.com/bartaz/impress.js/) — HTML Prezy like
* [io-2002-slides](https://code.google.com/p/io-2012-slides/) — Google IO slide deck
* [Reveal.js](https://github.com/hakimel/reveal.js) — Nested slid
* [CSSS](https://github.com/LeaVerou/CSSS) — CSS-based SlideShow System
* [Flowtime.js](https://github.com/marcolago/flowtime.js)

So you may want to use one of them, or you might be interested in this tool if you want
a tool that aim to suppor the two simple following statements :

*HTML5 is ready and it's the best solution for presentation content. And a presentation support a
story which follow a simple timeline and doesn't really have any meaning* **only by itself**.

So this library will not have complicate navigation, or allows presentation with sub-chapter,
nested slides or any other fancy navigation. But more importantly this tool is build in a way
that a presentation can cohexist with something else, it may be a real human presenter, or
a media.

Presentation without a voice or a video is utterly rubbish!

In the future, features may look like that:

* HTML/CSS based presentation with support for preprocessor.
* Provide full ability to shape and style the slides and backgrounds.
* Doesn't force any animation, none, opacity transition, transform matrix3d... whatever you like.
* Cool friendly URL
* Fragments support for step by step navigation inside a slide.
* Simple navigation following a timeline, no sub-chapter or nested slides.
* Keyboard shortcuts for navigation.
* Overview mode.
* Responsive, it scale to any screen size, with or without the use of media queries.
* Grunt tasks providing a server with livereload to edit the presentation, watch task to preprocess
your markdown content etc.
* an API.
* Provide a real timeline!
* ...

This library will most definitevly make use of cool new HTML5 features such as Shadow DOM, WebRTC etc.
— So yes I don't care of IE or older browsers, I don't have time to handle this.
I keep this kind of boring headach for the paying job.

And of course in the end, a lot of motivation came from the opportunity to play with new technologies,
putting togethers the best frontend tools to build a cool project and have fun by testing the new
incoming HTML5/CSS3 stuff.
