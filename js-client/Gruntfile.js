module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            basic: {
                src: ['src/main.js'],
                dest: 'jtstream.js',
                options: {
                    standalone: 'JTStream'
                }
            }
        },

        uglify: {
            options: {

            },
            dist: {
                files: {
                    'jtstream.min.js': ['jtstream.js']
                }
            }
        },

        banner: [
            '/*',
            ' * This file is part of the jtstream package.',
            ' *',
            ' * (c) <%= grunt.template.today("yyyy") %> Jan Thomas <jan.thomas@rwth-aachen.de>',
            ' *',
            ' * For the full copyright and license information, please view the LICENSE',
            ' * file that was distributed with this source code (licensed MIT).',
            ' */',
        ].join('\n'),

        usebanner: {
            options: {
                position: 'top',
                banner: '<%= banner %>'
            },
            files: {
                src: [
                    'jtstream.js',
                    'jtstream.min.js'
                ]
            }
        },

        watch: {
            files: [ "src/**/*.js"],
            tasks: [ 'browserify', 'uglify', 'usebanner' ]
        }

    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
}