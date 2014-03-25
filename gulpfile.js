var gulp = require( 'gulp' ),
    jshint = require( 'gulp-jshint' ),
    uglify = require( 'gulp-uglify' ),
    rename = require( 'gulp-rename' ),
    clean = require( 'gulp-clean' ),
    tape = require( 'tape' );

gulp.task( 'compress', function () {
    return gulp.src( 'src/*.js' )
        .pipe( jshint() )
        .pipe( jshint.reporter( require( 'jshint-stylish' ) ) )
        .pipe( rename( {suffix: '.min'} ) )
        .pipe( uglify() )
        .pipe( gulp.dest( 'dist' ) );
} );

gulp.task( 'clean', function () {
    return gulp.src( ['dist'], { read: false } )
        .pipe( clean() );
} );

gulp.task( 'default', ['clean', 'compress'] );