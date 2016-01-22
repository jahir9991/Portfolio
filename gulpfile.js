//variable...................................
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    open = require('gulp-open');


//source folder......................
var coffeeSources = ['components/coffee/*.coffee'];
var jsSources = ['components/scripts/*.js'];
var sassSources = ['components/sass/*.scss'];
var htmlSources = ['builds/development/*.html'];
var jsonSources = ['builds/development/*.json'];


//tasks.............................
gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({bare: true})
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))

});

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        //.pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))
        .pipe(connect.reload())

});

gulp.task('compass', function () {

    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded',
            css: 'components/css'
        }).on('error', gutil.log))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload())

});


gulp.task('html', function () {
    gulp.src(htmlSources)
        .pipe(connect.reload())
});


gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(connect.reload())
});


gulp.task('connect', function () {
    connect.server({
        port: 3000,
        root: 'builds/development/',
        livereload: true
    });
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3000',
            app: 'chrome'
        }));

});

gulp.task('watch', function () {

    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch(sassSources, ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);

});


//gulp.task('browser', ['connect'], function () {
//    gulp.src(__filename)
//        .pipe(open({
//            uri: 'http://localhost:3000',
//            app: 'chrome'
//        }));
//});


gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
