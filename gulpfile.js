'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber'); // Вешает обработчик на поток
const notify = require('gulp-notify'); // Уведомитель ошибок
const concat = require('gulp-concat');

const isDev = true;

// Компиляция из .pug в .html
gulp.task('compilePug', function() {
    return gulp.src('development/pug/**/*.pug')
    .pipe(plumber({ // Обработчик ошибок на весь поток
        errorHandler: notify.onError(function(err) {
            return {
                title: 'Danger',
                message: err.message
            };
        })
    }))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(pug({pretty: true}))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(gulp.dest('public'));
});

// Компиляция из .scss в .css
gulp.task('compileSass', function() {
    return gulp.src('development/sass/**/*.sass')
    .pipe(plumber({
        errorHandler: notify.onError(function(err) {
            return {
                title: 'Danger',
                message: err.message
            };
        })
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public'));
});

// Следить за всеми файлами
gulp.task('watch', function(e) {
    gulp.watch('development/pug/**/*.*', gulp.series('compilePug')); // Путь и функция которая выполняется когда файлы меняются
    gulp.watch('development/sass/**/*.*', gulp.series('compileSass')); // Путь и функция которая выполняется когда файлы меняются
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


