'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

// Компиляция из .pug в .html
gulp.task('compilePug', function() {
    return gulp.src('development/pug/**/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('public'));

});

// Компиляция из .scss в .css
gulp.task('compileSass', function() {
    return gulp.src('development/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public'))
});

// Следить за всеми файлами
gulp.task('watch', function(e) {
    gulp.watch('development/pug/**/*.*', gulp.series('compilePug')); // Путь и функция которая выполняется когда файлы меняются
    gulp.watch('development/scss/**/*.*', gulp.series('compileSass')); // Путь и функция которая выполняется когда файлы меняются
    e();
});

// Показывать в браузере без перезагрузки
gulp.task('serve', function() {
    browsersync.init({
        server: "public",
        index: "landing.html"
    });
    browsersync.watch('public/**/*.*').on('change', browsersync.reload);
});

// Режим разработки
gulp.task('dev', gulp.series('compilePug', 'compileSass', gulp.parallel('watch', 'serve')));


