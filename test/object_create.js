var test = require( 'tape' ),
    perfget = require( '../dist/perfget.min' ),
    get = perfget.get,
    _get = perfget._get,
    get_ = perfget.get_;

var obj = {
    a: {
        b: {
            c: [1, 2, 3]
        }
    }
};

if ( typeof Object.create !== 'function' ) {
    Object.create = function ( o ) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

// Don't use Object.create( perfget ) as this will include _get and get_ which you should
// use functionally and not use in the context of an object.
test( 'inheritance only provides get', function ( t ) {

    var prototypal = Object.create( perfget.factory() );

    t.plan( 3 );

    t.ok( typeof prototypal.get === 'function' );
    t.ok( typeof prototypal._get === 'undefined' );
    t.ok( typeof prototypal.get_ === 'undefined' );

} );

test( 'get works in the context of the new object', function ( t ) {

    var prototypal = Object.create( perfget.factory() );

    prototypal.a = {
        b: {
            c: [1, 2, 3]
        }
    };

    t.plan( 3 );

    t.equal( prototypal.get, perfget.get );
    t.equal( prototypal.get( 'a.b.c' ), prototypal.a.b.c );
    t.notEqual( prototypal.get( 'a.b.c' ), perfget.get.call( obj, 'a.b.c' ) );

} );