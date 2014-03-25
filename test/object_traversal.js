var test = require( 'tape' ),
    perfget = require( '../dist/perfget.min' ),
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
var scenarios = {};
var scenarioDefinitions = [
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

var scenario;
var i = scenarioDefinitions.length;
var createTestFn = {
    equals: function ( type, message, path, receiver, result ) {
        return function ( t ) {
            t.plan( 3 );

            t.equal( get.call( receiver, path ), result, message );
            t.equal( _get( receiver )( path ), result, message );
            t.equal( get_( path )( receiver ), result, message );
        };
    },
    instance: function ( type, message, path, receiver, result ) {
        return function ( t ) {
            t.plan( 3 );

            t.ok( get.call( receiver, path ) instanceof result, message );
            t.ok( _get( receiver )( path ) instanceof result, message );
            t.ok( get_( path )( receiver ) instanceof result, message );
        };
    },
    type: function ( type, message, path, receiver, result ) {
        return function ( t ) {
            t.plan( 3 );

            t.equal( typeof get.call( receiver, path ), result, message );
            t.equal( typeof _get( receiver )( path ), result, message );
            t.equal( typeof get_( path )( receiver ), result, message );
        };
    }
};

while ( i-- ) {
    scenario = scenarioDefinitions[i];
    if ( scenario !== 'ignore' ) {
        test( 'test - ' + scenario[1], createTestFn[scenario[0]].apply( null, scenario ) );
    }
}