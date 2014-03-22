[![Build Status](https://travis-ci.org/AutoSponge/perfget.png?branch=master)](https://travis-ci.org/AutoSponge/perfget)
[![NPM version](https://badge.fury.io/js/perfget.png)](http://badge.fury.io/js/perfget)

perfget
=======

*Fastest method for returning deeply nested properties based on a string path.*

If you merely try to access a path like `a.b.c` and either `a` or `a.b` does not exist,
you will throw an error.  If `a` is not defined: `ReferenceError: a is not defined`.
If `a.b` is not defined: `TypeError: Cannot read property 'c' of undefined`.

The only safe pattern for property access is: `a && a.b && a.b.c`.  Relying on this
pattern leads to verbose, error-prone code.  You will also have problems passing
this around to other functions.

`get` will allow you to pass `get( "a.b.c" )` as a path or as an array of "segments",
`get( ["a", "b", "c"] )`.  If any part of the path fails, `get` returns `undefined`.

Any properties you can normally access, `get` can return.  For instance, this will work
in the browser: `get( "document.body.childNodes.length" );`

##Updates

v0.2.0 - perfget now uses a constructor function to instantiate the `perfget` object.
This means you can inherit the `.get()` method into your own constructors using
node's `util.inherits`.  This provides fast, null-safe accessor methods on your
custom objects.  See the tests for an example.

perfget no longer caches the string path as a key to the split array.  While this extra
step will slow overall speed, I felt the caching may have been too aggressive for larger
applications.  If you want that performance back, split the string yourself and
cache the array or wrap get with your own caching function.

## Notes

No, this does not use `try/catch`.  That tends to slow things down, especially in the
browser.  For each "depth", **perfget** constructs a function capable of accessing
properties at that depth.  The function gets cached for reuse.  Splitting long strings
can also take time, so we cache those as well for reliable, fast results.

## Getting started

Download and include `perfget.min.js` on a browser page or install via npm:

`npm install perfget --save-dev`

## API

- `get( path:String|Array )` : Returns property values of `this`.
- `_get( receiver:Object )`  : Returns a function which takes a path (just like `get`).
- `get_( path:String|Array )`: Returns a function which takes a receiver.

## Uses:

Use `get()` globally

```html
<!-- Browser example -->
<script src="perfget.min.js">
<script>
get( "window.location.hash" );
</script>
```

```javascript
// NodeJS example
var get = require( "perfget" ).get;
get( "process.title" ); //'node'
```

Use `get()` for your custom objects

```html
<!-- Browser example -->
<script src="perfget.min.js">
<script>
function Klass( thangs ) {
  this.stuff = {
    thangs: thangs
  };
}
Klass.prototype.get = get;

var k = new Klass( [1,2,3] );
k.get( "stuff.thangs.1" ); //2
</script>
```

```javascript
// NodeJS example
var perfget = require( "perfget" );
function Klass( thangs ) {
  this.stuff = {
    thangs: thangs
  };
}
Klass.prototype.get = perfget.get;

var k = new Klass( [1,2,3] );
k.get( "stuff.thangs.1" ); //2
```

Use `_get()` to wrap objects

```html
<!-- Browser example -->
<script src="perfget.min.js">
<script>
var location = _get( window.location );
location();
location( "hash" );
</script>
```

```javascript
// NodeJS example
var _get = require( "perfget" )._get;
var global = _get( global );
global( "process.versions.v8" );
```

Use `get_()` with promises

```html
<!-- Browser example -->
<script src="jquery.min.js">
<script src="perfget.min.js">
<script>
var getResults = get_( "data.results" );
$.get( "http://fake.is/api" )
  .done( getResults )
  .then( handleResults )
  .fail( handleError );
</script>
```
```javascript
// NodeJS example
var Promise = require( "es6-promise" ).Promise;
var http = require( "http" );
var get_ = require( "perfget" ).get_;
var getResults = get_( "data.results" );

function request( options, body ) {
    return new Promise( function ( resolve, reject ) {
        var req = https.request( options, resolve );
        req.on( "error", reject );
        if ( body ) {
            req.write( body );
        }
        req.end();
    } );
}

function body( res ) {
    var body = "";
    return new Promise( function ( resolve, reject ) {
        res.on( "data", function ( chunk ) {
            body += chunk;
        } );
        res.on( "end", function () {
            return (res.statusCode === 200 ? resolve : reject)( body );
        } );
    } );
}

function parse( body ) {
    return JSON.parse( body );
}

request( {
            hostname: "fake.is",
            path: "/api",
            method: "GET"
        } )
            .then( body )
            .then( parse )
            .then( getResults )
            .then( handleResults )
            .catch( handleError );

```

Use `get_()` functionally, like with `.map()`

```html
<!-- Browser example -->
<script src="jquery.min.js">
<script src="perfget.min.js">
<script>
var pluckId = get_( "deeply.nested.id" );
var obj = {deeply:{nested:{id:1}}}
[obj].map( pluckId ); // [1]
</script>
```

```javascript
// NodeJS example
var get_ = require( "perfget" ).get_;
var pluckId = get_( "deeply.nested.id" );
var obj = {deeply:{nested:{id:1}}}
[obj].map( pluckId ); // [1]
```

## Change log

- 2014-03-18: (v0.1.1) Replaced gulp-mocha with gulp-nodeunit, added travis-ci integration