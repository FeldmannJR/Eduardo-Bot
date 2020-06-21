const gulp = require('gulp');
const { dest, task, src, series } = gulp;
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const eslint = require('gulp-eslint');


task('lint', function () {
    return gulp
        // Define the source files
        .src('src/**/*.ts').pipe(eslint({}))
        // Output the results in the console
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
});

task('assets', function () {
    return gulp.src('assets/**/**')
        .pipe(dest('dist/assets/'));
});

task('ts', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(dest('dist'));
});

task('default', series(['lint', 'assets', 'ts']));
