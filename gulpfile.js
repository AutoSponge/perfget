var gulp = require( "gulp" ),
    nodeunit = require( "gulp-nodeunit" ),
    jshint = require( "gulp-jshint" ),
    uglify = require( "gulp-uglify" ),
    rename = require( "gulp-rename" ),
    clean = require( "gulp-clean" );

gulp.task( "compress", function () {
    return gulp.src( "src/*.js" )
        .pipe( jshint() )
        .pipe( jshint.reporter( "default" ) )
        .pipe( rename( {suffix: ".min"} ) )
        .pipe( uglify() )
        .pipe( gulp.dest( "dist" ) );
} );

gulp.task( "test", function () {
    return gulp.src( "test/*.js" )
        .pipe( nodeunit( {} ) );
} );

gulp.task( "clean", function () {
    return gulp.src( ["dist"], { read: false } )
        .pipe( clean() );
} );

gulp.task( "default", ["clean", "compress"], function () {
    gulp.start( "test" );
} );