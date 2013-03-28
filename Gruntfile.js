/*jshint browser: false, node: true */

var path = require('path'),
    fs = require('fs'),
    requireJsConfig = require('./app/config'),
    jade = require('jade');

// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: ['app/**/*.js'],
        tasks: ['jasmine', 'empty']
      }
    },

    // The watch task can be used to monitor the filesystem and execute
    // specific tasks when files are modified.  By default, the watch task is
    // available to compile CSS if you are unable to use the runtime compiler
    // (use if you have a custom server, PhoneGap, Adobe Air, etc.)
    regarde: {
      gruntjs: {
        files: ['Gruntfile.js'],
        tasks: ['notify:gruntConfig']
      },
      stylus: {
        files: ['app/assets/styl/**/*'],
        tasks: 'stylus:debug'
      },
      jade: {
        files: ['views/**/*.jade'],
        tasks: 'jade:debug'
      },
      // live reload for inline css/images requires grunt 0.4(in dev) and live reload browser extension
      livereload: {
        files: ['*.html', 'app/assets/css/**/*', 'app/**/*.js'],
        tasks: ['livereload']
      }
      // todo tests
      // todo transifex
    },

    // The jshint option
    jshint: {
      all: ['app/**/*.js', 'Gruntfile.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // compile html jst templates into templates.js
    jst: {
      compile: {
        options: {
          prettify: true
        },
        files: {
          'dist/debug/templates.js': [
            'app/templates/**/*.html'
          ]
        }
      }
    },

    // RequireJS AMD config task
    requirejs: {
      compile: {
        options: {
          mainConfigFile: 'app/config.js',
          out: 'dist/debug/require.js',
          name: 'main',
          optimize: 'none',
          preserveLicenseComments: true,
          // locale: 'en-us',
          generateSourceMaps: false
        }
      }
    },

    // The concatenate task is used here to merge the almond require/define
    // shim and the templates into the application code.  It's named
    // dist/debug/require.js, because we want to only load one script file in
    // index.html.
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'components/almond/almond.js',
          'dist/debug/templates.js',
          'dist/debug/require.js'
        ],
        dest: 'dist/debug/require.js'
      }
    },

    // This task uses the MinCSS Node.js project to take all your CSS files in
    // order and concatenate them into a single CSS file named index.css.  It
    // also minifies all the CSS as well.  This is named index.css, because we
    // only want to load one stylesheet in index.html.
    mincss: {
      compress: {
        files: {
          'dist/release/index.css': [
            'dist/debug/index.css'
          ]
        }
      }
    },

    // connect server for development
    connect: {
      server: {
        options: {
          port: 8000,
          base: 'app',
          middleware: function(connect, options) {
            // Return array of whatever middlewares you want
            return [
              // TODO change to serve stylus files directly
              // used for css files
              connect['static'](__dirname + '/app/assets'),
              // used for /app/config.js
              connect['static'](__dirname),

              // used for require.js
              function(req, res, next) {
                if (req.url !== '/require.js')
                  return next();

                fs.readFile(__dirname + '/components/requirejs' +  req.url, function (err, data) {
                  if (err) {
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                  }
                  res.writeHead(200, {'Content-Type': 'text/javascript'});
                  res.end(data);
                });
              },
              function(req, res, next) {
                // at this point all static files should be served else 404
                if ((/\.(css|jpg|js|png|gif|ico|html)+$/i).test(req.url))
                  return next();

                fs.readFile('views/player.jade', function(err, data) {
                  var tpl = jade.compile(data, {pretty: true, filename: 'views/player.jade'});
                  res.end(tpl({
                    debug: true,
                    title: 'OnStage - DEV'
                  }));
                });
              }
            ];
          }
        }
      }
    },

    // The headless Jasmine testing is provided by grunt-jasmine-task. Simply
    // point the configuration to your test directory.
    jasmine: {
      src: 'app/modules/presentation.js',
      options: {
        specs: 'test/jasmine/spec/**/*Spec.js',
        helpers: 'test/jasmine/spec/**/*Helper.js',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfig: requireJsConfig
        }
      }
    },

    clean: {
      dist: ['dist/'],
      docs: ['docs/'],
      githooks: ['.git/hooks/pre-commit']
    },

    // This task will copy assets into your build directory,
    // automatically.  This makes an entirely encapsulated build into
    // each directory.
    copy: {
      debug: {
        files: {
          'dist/debug/css/h5bp.css': 'app/assets/css/h5bp.css'
        }
      },
      release: {
        files: {
          'dist/release/app/': 'app/**',
          'dist/release/vendor/': 'vendor/**'
        }
      },
      githooks: {
        files: {
          '.git/hooks/pre-commit': 'git-hooks/pre-commit'
        }
      }
    },

    jade: {
      debug: {
        options: {
          pretty: true,
          data: {
            debug: true,
            title: 'OnStage'
          }
        },
        files: {
          'dist/debug/index.html': ['views/player.jade']
        }
      }
    },

    stylus: {
      debug: {
        options: {
          compress: false
        },
        files: {
          'dist/debug/css/index.css': 'app/assets/styl/index.styl', // 1:1 compile
          'dist/debug/css/style.css': 'app/assets/styl/style.styl' // 1:1 compile
          //'path/to/another.css': ['path/to/sources/*.styl', 'path/to/more/*.style'], // compile and concat into single file
          //'path/to/*.css': ['path/to/sources/*.styl', 'path/to/more/*.styl'] // compile individually into dest, maintaining folder structure
        }
      },
      compile: {
        options: {
          compress: true,
          paths: ['app/assets/css']
        },
        files: {
          'app/assets/css/index.css': 'app/assets/styl/index.styl' // 1:1 compile
          //'path/to/another.css': ['path/to/sources/*.styl', 'path/to/more/*.style'], // compile and concat into single file
          //'path/to/*.css': ['path/to/sources/*.styl', 'path/to/more/*.styl'] // compile individually into dest, maintaining folder structure
        }
      }
    },

    // TODO
    /*
    imagemin: {                          // Task
      dist: {                            // Target
        options: {                       // Target options
          optimizationLevel: 3
        },
        files: {                         // Dictionary of files
          'dist/img.png': 'src/img.png', // 'destination': 'source'
          'dist/img.jpg': 'src/img.jpg'
        }
      },
      dev: {                             // Another target
        options: {                       // Target options
          optimizationLevel: 0
        },
        files: {
          'dev/img.png': 'src/img.png',
          'dev/img.jpg': 'src/img.jpg'
        }
      }
    },
    */

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'app/',
          outdir: 'docs/api/'
        }
      }
    },

    groc: {
      javascript: [
        'app/**/*.js', 'README.md'
      ],
      options: {
        'out': 'docs/groc'
      }
    },

    symlink: {
      components: {
        target: __dirname + 'components',
        link: 'dist/debug/components',
        options: {
          overwrite: true,
          force: true
        }
      },
      h5bp: {
        target: __dirname + '/app/assets/css/h5bp.css',
        link: 'dist/debug/h5bp.css',
        options: {
          overwrite: true,
          force: true
        }
      }
    },

    notify: {
      compileStylus: {
        options:{
          title: '<%= pkg.name %> - Stylus',
          message: 'Stylus compiled'
        }
      },
      compileJade: {
        options: {
          title: '<%= pkg.name %> - Jade',
          message: 'Jade compiled'
        }
      },
      gruntConfig: {
        options: {
          title: '<%= pkg.name %> - Gruntfile.js',
          message: 'reload grunt!'
        }
      },
      livereload: {
        options: {
          title: '<%= pkg.name %> - LiveReload',
          message: '---'
        }
      }
    },

    shell: {
      githooks: {
        command: 'cp git-hooks/pre-commit .git/hooks/'
      }
    }

  });

  // use wait until issues with watch are solved
  grunt.loadNpmTasks('grunt-regarde');
  // https://github.com/gruntjs/grunt-contrib-livereload/pull/9
  // https://github.com/gruntjs/grunt-contrib-watch/issues/45
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-symbolic-link');

  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-groc');

  // add grunt npm package
  // compress
  // testacular
  // grunt.loadNpmTasks('grunt-testacular');
  // https://npmjs.org/package/grunt-template-jasmine-istanbul


  // grunt task for development
  grunt.registerTask('default', ['jshint', 'livereload-start', 'connect', 'regarde']);

  // task to run after a clone of the repository - add jshint git hook on commit
  grunt.registerTask('init', ['clean:githooks', 'shell:githooks']);

  // The debug task will remove all contents inside the dist/ folder, lint
  // all your code, precompile all the underscore templates into
  // dist/debug/templates.js, compile all the application code into
  // dist/debug/require.js, and then concatenate the require/define shim
  // almond.js and dist/debug/templates.js into the require.js file.
  // generate the css files with stylus
  grunt.registerTask('debug', ['clean:dist', 'jshint', 'jst', 'requirejs', 'concat', 'stylus', 'jade:debug', 'copy:debug']);

  // The release task will run the debug tasks and then minify the
  // dist/debug/require.js file and CSS files.
  grunt.registerTask('release', ['jshint', 'stylus', 'debug', 'min', 'mincss']);

  // Run tests
  grunt.registerTask('test', ['jshint', 'jasmine']);

  // Generates the docs api (yuidoc) and inline docs (groc)
  grunt.registerTask('docs', ['clean:docs', 'groc', 'yuidoc']);

  grunt.registerTask('empty', 'do nothing task', function() {});

  // Listen for events when files are modified
  grunt.event.on('watch', function(action, filepath) {
    //grunt.log.writeln(filepath + ' has ' + action);
  });
};
