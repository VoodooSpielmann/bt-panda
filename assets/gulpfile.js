var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('default', function() {
  browserSync.init({
    server: true,
    server: {
      baseDir: "./",
      directory: true
    }
  });
  gulp.watch(["*.html","*.css"]).on("change", browserSync.reload);
});