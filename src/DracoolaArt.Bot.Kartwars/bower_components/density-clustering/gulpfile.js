(function () {
    'use strict';
    // dependencies
    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');
    var resolveDependencies = require('gulp-resolve-dependencies');
    // source
    var sources = './lib/*.js';
    gulp.task('build', function () {
        return gulp.src(sources)
            .pipe(resolveDependencies())
            .pipe(concat('clustering.js'))
            .pipe(gulp.dest('./dist'));
    });
    gulp.task('build-min', ['build'], function () {
        return gulp.src('./dist/clustering.js')
            .pipe(uglify())
            .pipe(concat('clustering.min.js'))
            .pipe(gulp.dest('./dist'));
    });
    gulp.task('default', ['build-min']);
})();
