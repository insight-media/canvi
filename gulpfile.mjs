import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as sassCompiler from 'sass';
import uglify from 'gulp-uglify';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import log from 'fancy-log';
import babel from 'gulp-babel';
import strip from 'gulp-strip-comments';
import wait from 'gulp-wait';
import gap from 'gulp-append-prepend';

const sass = gulpSass(sassCompiler);

gulp.task('sass', function () {
	return gulp.src('./scss/canvi.scss')
		.pipe(wait(700))
		.pipe(sass({ includePaths: ['./scss/partials'] }).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 1 version', '> 1%', 'ie 8', 'ie 7'],
		}))
		.pipe(cleanCss())
		.pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
	return gulp.src('./js/*.js')
		.pipe(strip())
		.pipe(babel({
			presets: ['@babel/preset-env'],
			plugins: ['@babel/plugin-transform-object-assign'],
		}))
		.pipe(gap.appendText('export default Canvi;'))
		.pipe(uglify())
		.on('error', function (err) { log.error(err.toString()); })
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	gulp.watch('scss/**/*.scss', gulp.series('sass'));
	gulp.watch('./js/*.js', gulp.series('js'));
});

gulp.task('default', gulp.parallel('sass', 'js', 'watch'));
