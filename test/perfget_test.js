var perfget = require( '../dist/perfget.min' ),
    get = perfget.get,
    _get = perfget._get,
    get_ = perfget.get_;

/**
 * create test object and associated paths
 * object has depth 26 (a-z properties)
 * every third step alternates between array or function object
 * each path is recorded by its length (e.g., path[1] is 'a', path[26] is 'a...z')
 */
var paths = {};
var obj = (function ( start, end ) {
    var i, next, obj, path, name;
    next = obj = {};
    path = '';
    for ( i = 0; i < (end - start); i += 1 ) {
        name = String.fromCharCode( i + start );
        next = next[name] = (i % 3 < 2 ? {} : i % 2 === 0 ? [] : function () {
        });
        path += path.length ? '.' + name : name;
        paths[i + 1] = path;
    }
    return obj;
}( 97 /* a */, 123 /* z */ ));

//create tests
var tests = {};
var testDefinitions = [
    //type      message                                     path                            receiver    equals
    ['equals',  'should get obj from obj.null',             null,                           obj,        obj],
    ['equals',  'should get obj from obj.',                 ,                               obj,        obj],
    ['equals',  'should get obj from obj at depth 0',       paths[0],                       obj,        obj],
    ['equals',  'should get a from obj at depth 1',         paths[1],                       obj,        obj.a],
    ['equals',  'should get z from obj at depth 26',        paths[26],                      obj,        obj.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z],
    ['equals',  'should not get x from a at depth 2',       paths[1] + '.x',                obj         ],
    ['equals',  'should not get x from a at depth 3',       paths[1] + '.x.x',              obj         ],
    ['instance','should return an array c from b',          paths[3],                       obj,        Array],
    ['equals',  'should return length 0 from path c',       paths[3] + '.length',           obj,        0],
    ['equals',  'should return length 0 from array c',      ['a', 'b', 'c', 'length'],      obj,        0],
    ['type',    'should return a function f from e',        paths[6],                       obj,        'function'],
    ['type',    'should return a function apply from f',    paths[6] + '.apply',            obj,        'function'],
    ['equals',  'should return f.apply.length',             paths[6] + '.apply.length',     obj,        2],
    ['equals',  'should get d from obj at depth 4',         ['a', 'b', 'c', 'd'],           obj,        obj.a.b.c.d],
    'ignore'
];

var group = exports['Object Traversal'] = {};
var test;
var i = testDefinitions.length;
var createTestFn = {
    equals: function ( type, message, path, receiver, result ) {
        return function ( test ) {
            test.expect( 3 );

            test.equals( get.call( receiver, path ), result, message );
            test.equals( _get( receiver )( path ), result, message );
            test.equals( get_( path )( receiver ), result, message );

            test.done();
        };
    },
    instance: function ( type, message, path, receiver, result ) {
        return function ( test ) {
            test.expect( 3 );

            test.ok( get.call( receiver, path ) instanceof result, message );
            test.ok( _get( receiver )( path ) instanceof result, message );
            test.ok( get_( path )( receiver ) instanceof result, message );

            test.done();
        };
    },
    type: function ( type, message, path, receiver, result ) {
        return function ( test ) {
            test.expect( 3 );

            test.equals( typeof get.call( receiver, path ), result, message );
            test.equals( typeof _get( receiver )( path ), result, message );
            test.equals( typeof get_( path )( receiver ), result, message );

            test.done();
        };
    }
};

while ( i-- ) {
    test = testDefinitions[i];
    if ( test !== 'ignore' ) {
        group['test - ' + test[1]] = createTestFn[test[0]].apply( null, test );
    }
}

var group2 = exports['util.inherits Inheritance Pattern'] = {};

group2['inheritance only provides get'] = function ( test ) {

    var inherits = require( 'util' ).inherits;

    function MyConstructor() {
        this.a = {
            b: {
                c: [1, 2, 3]
            }
        };
    }

    inherits( MyConstructor, perfget.constructor );

    var myconstructor = new MyConstructor();

    test.expect( 3 );

    test.ok( typeof myconstructor.get === 'function' );
    test.ok( typeof myconstructor._get === 'undefined' );
    test.ok( typeof myconstructor.get_ === 'undefined' );

    test.done();

};

group2['get works in the context of the new object'] = function ( test ) {

    var inherits = require( 'util' ).inherits;

    function MyConstructor() {
        this.a = {
            b: {
                c: [1, 2, 3]
            }
        };
    }

    inherits( MyConstructor, perfget.constructor );

    var myconstructor = new MyConstructor();

    test.expect( 3 );

    test.equals( myconstructor.get, perfget.get );
    test.equals( myconstructor.get( 'a.b.c' ), myconstructor.a.b.c );
    test.notEqual( myconstructor.get( 'a.b.c' ), perfget.get.call( obj, 'a.b.c' ) );

    test.done();

};

var group3 = exports['Object.create Inheritance Pattern'] = {};
// Don't use Object.create( perfget ) as this will include _get and get_ which you should
// use functionally and not use in the context of an object.
group3['inheritance only provides get'] = function ( test ) {

    var prototypal = Object.create( perfget.factory() );

    test.expect( 3 );

    test.ok( typeof prototypal.get === 'function' );
    test.ok( typeof prototypal._get === 'undefined' );
    test.ok( typeof prototypal.get_ === 'undefined' );

    test.done();

};

group3['get works in the context of the new object'] = function ( test ) {

    var prototypal = Object.create( perfget.factory() );

    prototypal.a = {
        b: {
            c: [1, 2, 3]
        }
    };

    test.expect( 3 );

    test.equals( prototypal.get, perfget.get );
    test.equals( prototypal.get( 'a.b.c' ), prototypal.a.b.c );
    test.notEqual( prototypal.get( 'a.b.c' ), perfget.get.call( obj, 'a.b.c' ) );

    test.done();

};