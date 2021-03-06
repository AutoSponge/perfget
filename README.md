[![Build Status](https://travis-ci.org/AutoSponge/perfget.png?branch=master)](https://travis-ci.org/AutoSponge/perfget)
[![NPM version](https://badge.fury.io/js/perfget.png)](http://badge.fury.io/js/perfget)
[![Code Climate](https://codeclimate.com/repos/54cc2ff96956801b330056d8/badges/a212ffff3dde41c5bd31/gpa.svg)](https://codeclimate.com/repos/54cc2ff96956801b330056d8/feed)
[![Test Coverage](https://codeclimate.com/repos/54cc2ff96956801b330056d8/badges/a212ffff3dde41c5bd31/coverage.svg)](https://codeclimate.com/repos/54cc2ff96956801b330056d8/feed)

[![browser support](https://ci.testling.com/AutoSponge/perfget.png)](https://ci.testling.com/AutoSponge/perfget)

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

## Notes

No, this does not use `try/catch`.  That tends to slow things down, especially in the
browser.  For each "depth", **perfget** constructs a **null-safe** function capable of accessing
properties at that depth.  The _depth_ function gets cached for reuse.

## Getting started

Download and include `perfget.min.js` on a browser page or install via npm:

`npm install perfget --save-dev`

### Now available with bower

1. add this line to your bower.json in the dependencies: `"perfget": "perfget#0.2.1b"`
1. Next, add this line to your .html file(s) `<script src="bower_components/perfget/dist/perfget.min.js"></script>`
1. You will have all three (`get`, `get_`, and `_get`) methods as globals as well as the `perfget` which is 
an alias for `perfget.factory`.

If you use this script for a web component, like Polymer, create an intermediary include like this:

```html
<!-- filename: components/perfget-include/perfget-include.html -->
<script src="../perfget/dist/perfget.min.js"></script>
```
Then, import the new component: `<link rel="import" href="components/perfget-include/perfget-include.html">`

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
get( "window.washer" ); //undefined
</script>
```

```javascript
// NodeJS example
var get = require( "perfget" ).get;
get( "process.title" ); //'node'
```

Use `get()` for your custom objects

```html
<!-- Browser method example -->
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
k.get( "stuff.whatevs.mine" ); //undefined
</script>
```

```html
<!-- Browser Object.create example -->
<script src="perfget.min.js">
<script>
var obj = Object.create( perfget() );

obj.stuff = {
  thangs: [1,2,3]
};
obj.get( "stuff.thangs.1" ); //2
obj.get( "stuff.whatevs.mine" ); //undefined
</script>
```

```javascript
// NodeJS method example
var perfget = require( "perfget" );
function Klass( thangs ) {
  this.stuff = {
    thangs: thangs
  };
}
Klass.prototype.get = perfget.get;

var k = new Klass( [1,2,3] );
k.get( "stuff.thangs.1" ); //2
k.get( "stuff.whatevs.mine" ); //undefined
```

```javascript
// NodeJS util.inherits example
var perfget = require( "perfget" );
var util = require( "util" );
function Klass( thangs ) {
  this.stuff = {
    thangs: thangs
  };
}
util.inherits( Klass, perfget.constructor );

var k = new Klass( [1,2,3] );
k.get( "stuff.thangs.1" ); //2
k.get( "stuff.whatevs.mine" ); //undefined
```

```javascript
// NodeJS Object.create example
var perfget = require( "perfget" );
var obj = Object.create( perfget.factory() );
obj.stuff = {
  thangs: [1,2,3]
};

obj.get( "stuff.thangs.1" ); //2
obj.get( "stuff.whatevs.mine" ); //undefined
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

Date       | Version  | Notes
--- | --- | ---
2014-03-24 | v0.2.1 | Added better support for Object.create
2014-03-22 | v0.2.0 | Added support for util.inherits
2014-03-18 | v0.1.1 | Replaced gulp-mocha with gulp-nodeunit, added travis-ci integration