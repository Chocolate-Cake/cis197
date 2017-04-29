var gulp = require('gulp');
var eslint = require('gulp-eslint');

var FILES = [
  'public/js/*.js',
  'db/*.js',
  'app.js'
];

gulp.task('eslint', function () {
  return gulp.src(FILES)
    .pipe(eslint())
    .pipe(eslint.format());
});
