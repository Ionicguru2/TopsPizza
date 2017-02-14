// Generated on 2016-01-05 using generator-ionic 0.8.0
'use strict';
/*jshint -W106 */
/*jshint -W098 */
var _ = require('lodash');
var path = require('path');

var cordovaCli = require('cordova');
var spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;
// jsonServer
//var jsonServer = require('json-server'),
//  request = require('superagent'),
//  path = require('path');
var apiData = function() {
  var data = {
    tasks: []
  };
  // Create 21 task
  for (var i = 10; i < 32; i++) {
    data.tasks.push({
      task_id: i,
      task_title: 'Title ' + i,
      task_date: '2015-12-' + i,
      task_time: '23:' + i,
      task_desc: 'Lorem ipsum Labore exercitation ea ut reprehenderit.',
    });
  }
  return data;
};

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: 'app',
      scripts: 'js',
      styles: 'css',
      images: 'images',
      test: 'test',
      dist: 'www',
      lib:'lib'

    },

    // Environment Variables for Angular App
    // This creates an Angular Module that can be injected via ENV
    // Add any desired constants to the ENV objects below.
    // https://github.com/diegonetto/generator-ionic/blob/master/docs/FAQ.md#how-do-i-add-constants
    ngconstant: {
      options: {
        space: '  ',
        wrap: '\'use strict\';\n\n{%= __ngModule %}',
        name: 'smt.config',
        dest: '<%= yeoman.app %>/<%= yeoman.scripts %>/app.constants.js'
      },
      development: {
        constants: {
          ENV: {
            name: 'development',
            apiEndpoint: '/server'
          }
        }
      },
      production: {
        constants: {
          ENV: {
            name: 'production',
            apiEndpoint: 'baseUrl'
          }
        }
      }
    },

    //include src
    includeSource: {
      options: {
        basePath: 'app',
        //baseUrl: './',
        templates: {
          html: {
            js: '<script src="{filePath}"></script>',
            css: '<link rel="stylesheet" href="{filePath}" />'
          }
        }
      },
      serve: {
        files: {
          '<%= yeoman.dist %>/index.html': '<%= yeoman.app %>/index.tmpl.html'
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep', 'newer:copy:app']
      },
      html: {
        files: ['<%= yeoman.app %>/**/*.html'],
        tasks: ['newer:copy:app']
      },
      js: {
        files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'],
        tasks: ['newer:copy:app', 'newer:jshint:all']
      },
      styles: {
        files: ['<%= yeoman.app %>/<%= yeoman.styles %>/**/*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      includeSource: {
        files: ['<%= yeoman.src %>/index.tmpl.html'],
        tasks: ['includeSource']
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.temp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*',
            '<%= yeoman.dist %>/!(README.md)'
          ]
        }]
      },
      server: '.temp'
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.temp/<%= yeoman.styles %>/',
          src: '*.css',
          dest: '.temp/<%= yeoman.styles %>/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        //directory:'.bowerrc',
        //bowerJson:'bower.json',
        src: ['<%= yeoman.dist %>/index.html'],
        onError: function(err) {
          // If not overridden, an error will throw.

          // err = Error object.
          // err.code can be:
          //   - "PKG_NOT_INSTALLED" (a Bower package was not found)
          //   - "BOWER_COMPONENTS_MISSING" (cannot find the `bower_components` directory)
          console.log(err);
        },

        onFileUpdated: function(filePath) {
          // filePath = 'name-of-file-that-was-updated'
          console.log(filePath);
        },

        onPathInjected: function(fileObject) {
          // fileObject.block = 'type-of-wiredep-block' ('js', 'css', etc)
          // fileObject.file = 'name-of-file-that-was-updated'
          // fileObject.path = 'path-to-file-that-was-injected'
          console.log('+',fileObject.path);
        },

        onMainNotFound: function(pkg) {
          // pkg = 'name-of-bower-package-without-main'
          console.log(pkg);
        },
        ignorePath: '../app/'
        //exclude: ['<%= yeoman.bowercomp %>/ionic-material-design-lite/']
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.dist %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        root: '<%= yeoman.app %>',
        staging: '.temp',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/<%= yeoman.styles %>/*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },
    concat:{
      options: {
        nonull: true
      }
    },
    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        //root: '<%= yeoman.app %>',
        noRebase: true
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'templates/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // https://www.npmjs.com/package/grunt-angular-templates
    ngtemplates: {
      dist: {
        cwd: '<%= yeoman.app %>',
        src: 'js/**/{,*/}*.html',
        dest: '<%= yeoman.dist %>/template.js',
        options: {
          module: 'app',
          append: '<%= yeoman.dist %>',
          usemin: 'js/app.js',
          htmlmin: {
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeScriptTypeAttributes: true,
            removeEmptyAttributes: true,
            removeComments: true
          }
        }
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          nonull: true,
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            'img/**/*',
            //'fonts/*'
          ]
        }
          /*, {
          nonull: true,
          expand: true,
          cwd: '.temp/<%= yeoman.images %>',
          dest: '<%= yeoman.dist %>/<%= yeoman.images %>',
          src: ['generated/!*']
        }*/]
      },
      styles: {
        nonull: true,
        expand: true,
        cwd: '<%= yeoman.app %>/<%= yeoman.styles %>',
        dest: '<%= yeoman.dist %>/<%= yeoman.styles %>/',
        src: '*.css'
      },
      fonts: {
        nonull: true,
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/<%= yeoman.lib %>/ionic/release/fonts/',
          dest: '<%= yeoman.dist %>/css/fonts/',
          src: '*'
        }]
      },
      templates: {
        nonull: true,
        expand: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>',
        src: 'js/**/*.html'
      },
      app: {
        nonull: true,
        expand: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>/',
        src: [
          '**/*',
          //'!**/*.(scss,sass,css)',
        ]
      },
      tmp: {
        nonull: true,
        expand: true,
        cwd: '.temp',
        dest: '<%= yeoman.dist %>/',
        src: '**/*'
      }
    },

    concurrent: {
      ionic: {
        tasks: [],
        options: {
          logConcurrentOutput: true
        }
      },
      server: [
        'copy:app',
        'copy:fonts'
      ],
      test: [
        'copy:styles',
        'copy:vendor',
        'copy:fonts'
      ],
      dist: [
        'copy:dist',
        'copy:fonts'
      ]
    },

    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection.
    ngAnnotate: {
      options: {
        singleQuotes: true
        //,regexp: '^(rome){0}'
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.temp/concat',
          src: '{,*/}*.js',
          dest: '.temp/concat'
        }]
      }
    }

  });

  // Register tasks for all Cordova commands
  _.functions(cordovaCli).forEach(function(name) {
    if (name.indexOf('clean') < 0) {
      grunt.registerTask(name, function() {
        this.args.unshift(name.replace('cordova:', ''));
        // Handle URL's being split up by Grunt because of `:` characters
        if (_.contains(this.args, 'http') || _.contains(this.args, 'https')) {
          this.args = this.args.slice(0, -2).concat(_.last(this.args, 2).join(':'));
        }
        var done = this.async();
        var exec = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
        var cmd = path.resolve('./node_modules/cordova/bin', exec);
        var flags = process.argv.splice(3);
        var child = spawn(cmd, this.args.concat(flags));
        child.stdout.on('data', function(data) {
          grunt.log.writeln(data);
        });
        child.stderr.on('data', function(data) {
          grunt.log.error(data);
        });
        child.on('close', function(code) {
          code = code ? false : true;
          done(code);
        });
      });
    }
  });

  // Since Apache Ripple serves assets directly out of their respective platform
  // directories, we watch all registered files and then copy all un-built assets
  // over to <%= yeoman.dist %>/. Last step is running cordova prepare so we can refresh the ripple
  // browser tab to see the changes. Technically ripple runs `cordova prepare` on browser
  // refreshes, but at this time you would need to re-run the emulator to see changes.

  // Wrap ionic-cli commands
  grunt.registerTask('ionic', function() {
    var done = this.async();
    var script = path.resolve('./node_modules/ionic/bin/', 'ionic');
    var flags = process.argv.splice(3);
    var child = spawn(script, this.args.concat(flags), {
      stdio: 'inherit'
    });
    child.on('close', function(code) {
      code = code ? false : true;
      done(code);
    });
  });

  grunt.registerTask('serve', function(target) {
    if (target === 'compress') {
      return grunt.task.run(['compress', 'ionic:serve']);
    } else if (target === 'json') {
      grunt.config('concurrent.ionic.tasks', ['ionic:serve', 'json_server', 'watch']);
    } else {
      grunt.config('concurrent.ionic.tasks', ['ionic:serve', 'watch']);
    }
    grunt.task.run(['wiredep', 'init', 'concurrent:ionic']);
  });
  grunt.registerTask('emulate', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:emulate:' + this.args.join(), 'watch']);
    return grunt.task.run(['init', 'concurrent:ionic']);
  });
  grunt.registerTask('run', function() {
    grunt.config('concurrent.ionic.tasks', ['ionic:run:' + this.args.join(), 'watch']);
    return grunt.task.run(['init', 'concurrent:ionic']);
  });
  grunt.registerTask('build', function() {
    return grunt.task.run(['init', 'ionic:build:' + this.args.join()]);
  });
  grunt.registerTask('build-compress', function() {
    return grunt.task.run(['compress', 'ionic:build:' + this.args.join()]);
  });

  grunt.registerTask('init', [
    'clean',
    //'ngconstant:development',
    'includeSource',
    'wiredep',
    'concurrent:server',
    //'autoprefixer',
    'newer:copy:app',
    //'newer:copy:tmp'
  ]);


  grunt.registerTask('compress', [
    'clean',
    //'ngconstant:production',
    'includeSource',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    //'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    //'copy:templates',
    'cssmin',
    'uglify',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'includeSource',
    'wiredep',
    'newer:jshint',
    'compress'
  ]);
};
