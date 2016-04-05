/// <reference path="./typings/main.d.ts" />
var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var eventStream = require('event-stream');
var watch = require('gulp-watch');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

var ngSort = require('gulp-angular-filesort');
var ngAnnotate = require('gulp-ng-annotate');
var ngCache = require('gulp-angular-templatecache');

var less = require('gulp-less');
var less_cleancss_plugin = require('less-plugin-clean-css'),
    less_cleancss = new less_cleancss_plugin({advanced: true});

var ts = require("gulp-typescript");
var tsProject = ts.createProject('tsconfig.json');

var browserSync = require('browser-sync').create();

gulp.task('default', ['build:all'], function () {
    
});

gulp.task('build:all', function (cb) {
    runSequence(
        'clean',            // clean dist folder
        [
            'build:less',       // build and clean less -> css
            'build:angular',    // build angular application
            'build:static'      // build static content
        ],
        cb
    );
});

gulp.task('clean', function () {
    return gulp.src('./dist') 
        .pipe(rimraf());
});

gulp.task('build:less', function () {
    return gulp.src(paths.in.less)
        .pipe(less({
            paths: [paths.in.lessIncludes],
            plugins: [less_cleancss]
        }))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(paths.out.css))
        .pipe(browserSync.stream())
        .on('error', gutil.log);
});

gulp.task('build:angular', ['clean'], function () {
    
    var tsStream = tsProject.src()
        .pipe(ts(tsProject)).js;
    
    var templateStream = gulp.src(paths.in.ngHtml)
        .pipe(ngCache({
            standalone: true,
            module: 'app.templateCache',
            transformUrl: function (url) {
                return 'app/' + url;
            }
        }));
    
    return eventStream.merge(tsStream, templateStream)
        .pipe(sourcemaps.init())
        .pipe(ngSort())
        .pipe(ngAnnotate({
            remove: false,
            add: true,
            single_quotes: true
        }))
        .pipe(concat('app.js'))
        .pipe(rename('app.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.out.js));
});

gulp.task('build:static', function () {
    
    gulp.src(paths.in.index)
        .pipe(gulp.dest(paths.out.index));
        
    gulp.src(paths.in.content)
        .pipe(gulp.dest(paths.out.index));
});

gulp.task('watch', ['default'], function() {
    
    browserSync.init({
        server: './dist'
    });
    
    gulp.watch(paths.in.index, ['build:static']);
    gulp.watch(['./src/**/*.ts'], ['default']);
    gulp.watch(paths.in.less, ['build:less']);
    
    gulp.watch(paths.out.js).on('change', browserSync.reload);
    gulp.watch('./dist/**/*.html').on('change', browserSync.reload);
});

var paths = {
    in: {
        less: './src/**/*.less',
        lessIncludes: './src/less-includes',
        ngHtml: ['!./src/index.html', './src/**/*.html'],
        index: './src/index.html',
        content: ['./src/**/*.{ico,png,gif,jpg,ttf,otf,woff,eot,svg}']
    },
    out: {
        index: './dist',
        css: './dist/css',
        js: './dist/js'
    }
};