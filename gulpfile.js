//npm install gulp gulp-mocha gulp-uglify gulp-rename gulp-notify gulp-clean gulp-jshint --save-dev
var gulp = require( "gulp" ),
    mocha = require( "gulp-mocha" ),
    jshint = require( "gulp-jshint" ),
    uglify = require( "gulp-uglify" ),
    rename = require( "gulp-rename" ),
    notify = require( "gulp-notify" ),
    clean = require( "gulp-clean" );

gulp.task( "compress", function () {
    return gulp.src( "src/*.js" )
        .pipe( jshint() )
        .pipe( jshint.reporter( "default" ) )
        .pipe( rename( {suffix: '.min'} ) )
        .pipe( uglify() )
        .pipe( gulp.dest( "dist" ) )
        .pipe( notify( { message: "compress task complete" } ) );
} );

gulp.task( "test", function () {
    return gulp.src( ["test/*_test.js"], { read: false } )
        .pipe( mocha( {
            reporter: "spec"
        } ) )
        .pipe( notify( { message: "test task complete" } ) );
} );

gulp.task( "clean", function () {
    return gulp.src( ["dist"], { read: false } )
        .pipe( clean() )
        .pipe( notify( { message: "clean task complete" } ) );
} );

gulp.task( "default", ["clean", "compress"], function () {
    gulp.start( "test" );
} );