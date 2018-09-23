'use strict';
const gulp = require('gulp');
const lazyRequireTask = function(taskName, path, options = {}) {
  gulp.task(taskName, function() {
    let task = require(path).call(this, options);
    return task;
  });
};
const srcs = {
  assets: 'frontend/assets/**/*.{gif,jpg,png,svg}',
  stylesAssets: [
    // CSS тут для подключаемых библиотек (шрифтов там), если лень всё это делать через препроцессор...
    'frontend/styles/**/*.{gif,jpg,png,svg,eot,otf,ttf,woff,woff2,css}',
    '!frontend/styles/svgsprites/**/*.*'
  ],
  stylesSvgsprites: 'frontend/styles/svgsprites/**/*.svg'
};

/* ЭЛЕМЕНТЫ СБОРКИ */
//изображения
lazyRequireTask('assets', './tasks/assets', {src: srcs.assets});
// скрипты будут объеденены в один файл с сохранением порядка
lazyRequireTask('scripts', './tasks/scripts', {src: [
  'frontend/scripts/index.js'
]});
// все стили инклудим в индекс-файле
lazyRequireTask('styles', './tasks/styles', {src: 'frontend/styles/index.styl'});
// картинки, шрифты для стилей
lazyRequireTask('styles:assets', './tasks/styles-assets', {src: srcs.stylesAssets});
// svg-спрайты
lazyRequireTask('styles:svgsprites', './tasks/styles-svgsprites', {src: srcs.stylesSvgsprites});
// pug-шаблоны
lazyRequireTask('templates', './tasks/templates', {
  manifests: [
    'manifest/assets.json',
    'manifest/scripts.json',
    'manifest/styles.json'
  ],
  src: [
    'frontend/templates/**/*.pug',
    '!frontend/templates/includes/**/*.pug'
  ]
});

/* ОЧИСТКА */
lazyRequireTask('clean', './tasks/clean', {src: ['manifest', 'public', 'tmp']});

/* СБОРКА */
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'assets',
    'scripts',
    'styles:assets',
    'styles:svgsprites'
  ),
  'styles',
  'templates'
));

/* РАЗРАБОТКА */
lazyRequireTask('serve', './tasks/serve');

gulp.task('watch', function () {
  gulp.watch(srcs.assets, gulp.series('assets'));
  gulp.watch('frontend/scripts/**/*.*', gulp.series('scripts'));
  gulp.watch([
    'frontend/styles/**/*.styl',
    'tmp/styles/sprite.styl'
  ], gulp.series('styles'));
  gulp.watch(srcs.stylesAssets, gulp.series('styles:assets', 'styles'));
  gulp.watch(srcs.stylesSvgsprites, gulp.series('styles:svgsprites', 'styles'));
  gulp.watch('frontend/templates/**/*.pug', gulp.series('templates'));
});

gulp.task('dev', gulp.series(
  'build',
  gulp.parallel(
    'serve',
    'watch'
  )
));
