'use strict';

module.exports = function(grunt) {

  console.log('process.env', process.env);
  grunt.initConfig({
    copy: {
      main: {
        files: [
          { expand: false , src: ['./src/index.html' ], dest: './build/index.html' },
          { expand: true  , cwd: 'src/', src: ['./templates/*'], dest: './build/' },
          { expand: true,
            cwd: 'src/',
            src: [
              'assets/**/*',
            ] ,
            dest: './build/'
          },
        ]
      },
    },


    aws: {
      'accessKeyId' : process.env.AWS_ACCESS_KEY_ID,
      'secretKey'   : process.env.AWS_SECRET_KEY,
      'bucket'      : process.env.AWS_BUCKET,
    },

    aws_s3: {
      options: {
        accessKeyId         : '<%= aws.accessKeyId %>',
        secretAccessKey     : '<%= aws.secretKey %>',
        region              : 'sa-east-1',
        uploadConcurrency   : 5,
        downloadConcurrency : 5,
        bucket              : '<%= aws.bucket %>'
      },

      deployIndex: {
        options: {
          gzip: true,
          differential: true,
          params: {
            ContentEncoding: 'gzip'
          }
        },
        files: [{
          expand: true,
          cwd: './build/',
          src: ['index.html'],
        }],
      },

      deployAssets: {
        options: {
          gzip: true,
          differential: true,
          params: {
            ContentEncoding: 'gzip',
            CacheControl: 'max-age=630720000, public',
            Expires: (new Date(Date.now() + 63072000000)) // 2 years
          }
        },
        files: [{
          expand: true,
          cwd: './build/',
          src: ['assets/**/*'],
        }],
      },

      deleteAll: {
        dest: '/',
        'action': 'delete'
      }
    },

    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          // { expand: false , src: ['./build/index.html' ], dest: './deploy/index.html' },
          { expand: true  , cwd: './build/', src: ['./**/*'], dest: './deploy/' },
          // { expand: true,
          //   cwd: 'src/',
          //   src: [
          //     'assets/**/*',
          //   ] ,
          //   dest: './deploy/'
          // },
        ]
      }
    },

    watch: {
      options: {
        nospawn: true,
        livereload: false,
      },
      build: {
        options: {
          atBegin: true,
        },
        files: [
          'Gruntfile.js',
          'src/**/*',
        ],
        tasks: ['clear', 'uglifier', 'newer:copy' ]
      }
    },

    clean: {
      build  : [ 'build/*'  ],
      deploy : [ 'deploy/*' ],
    },

    uglify: {
      javascripts: {
        files: {
          'build/assets/js/all.min.js': [
            'src/assets/js/jquery.js',
            'src/assets/js/html5shiv.js',
            'src/assets/js/bootstrap.js',
            'src/assets/js/app.js',
          ]
        }
      },

      prismJs: {
        files: {
          'build/assets/js/prism.min.js': [
            'src/assets/js/prism.js',
            'src/assets/js/prism-okaidia.js',
            'src/assets/js/prism_azkfile.js',
          ]
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          'build/assets/css/all.min.css': [
            'src/assets/css/bootstrap.css',
            'src/assets/css/font-awesome.css',
            'src/assets/css/colors.css',
            'src/assets/css/prism-okaidia.css',
            'src/assets/css/prism-line-numbers.css',
            'src/assets/css/responsive.css',
            'src/assets/css/app.css',
          ]
        }
      }
    },
  });

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Clear terminal task
  grunt.registerTask('clear', function() {
    process.stdout.write('\u001B[2J\u001B[0;0f');
  });

  grunt.registerTask('uglifier', [
    'clean:build',
    'uglify:javascripts',
    'uglify:prismJs',
    'cssmin:combine'
  ]);

  grunt.registerTask('compile', 'watch:build');

  grunt.registerTask('deploy', [
    'clean:deploy',
    'uglifier',
    'newer:copy',
    'newer:compress:main',
    'aws_s3:deployIndex',
    'aws_s3:deployAssets'
  ]);
};
