//variable...................................
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    gulpminify = require('gulp-minify'),
    gulpminifycss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    minifyJSON = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush')
    ;

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    imageSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded'
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}


//source folder....................
coffeeSources = ['components/coffee/*.coffee'];
jsSources = [
    'components/scripts/classie.js',
    'components/scripts/main*.js'
];
sassSources = ['components/sass/*.scss'];
htmlSources = ['builds/development/*.html'];
jsonSources = ['builds/development/js/*.json'];
imageSources = ['builds/development/images/*.*'];


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
        //.pipe(gulpif(env != 'development', uglify()))
        .pipe(gulpminify())
        .pipe(gulp.dest('builds/development/' + 'js'))
        .pipe(gulp.dest('builds/production/' + 'js'))
        .pipe(connect.reload());

    gulp.src('components/scripts/modernizr-custom.js')
        .pipe(gulp.dest('builds/development/' + 'js'))
        .pipe(gulp.dest('builds/production/' + 'js'))

});

gulp.task('compass', function () {

    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'images',
            style: sassStyle,
            css: 'components/css'
        }).on('error', gutil.log))
        .pipe(concat('style.css'))
        .pipe(gulpminifycss())
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())

});


gulp.task('html', function () {
    gulp.src(htmlSources)
        .pipe(gulpif(env != 'development', minifyHTML()))
        .pipe(gulpif(env != 'development', gulp.dest(outputDir)))
        .pipe(connect.reload())
});


gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(gulpif(env != 'development', minifyJSON()))
        .pipe(gulpif(env != 'development', gulp.dest(outputDir + 'js')))
        .pipe(connect.reload())
});

gulp.task('image', function () {
    gulp.src(imageSources)
        .pipe(gulpif(env != 'development', imagemin({
            progressive: true,
            svgoPlugins: [ { removeViewBox: false } ],
            use:[pngcrush()]
        })))
        .pipe(gulpif(env != 'development', gulp.dest(outputDir + 'images')))
        .pipe(connect.reload())
});


gulp.task('connect', function () {
    connect.server({
        port: 3000,
        root: outputDir,
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
    gulp.watch(imageSources, ['image']);

});


//gulp.task('browser', ['connect'], function () {
//    gulp.src(__filename)
//        .pipe(open({
//            uri: 'http://localhost:3000',
//            app: 'chrome'
//        }));
//});


gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'image', 'connect', 'watch']);
