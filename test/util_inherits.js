var test = require( 'tape' ),
    inherits = require( 'util' ).inherits,
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

function MyConstructor() {
    this.a = {
        b: {
            c: [1, 2, 3]
        }
    };
}

inherits( MyConstructor, perfget.constructor );

var myconstructor = new MyConstructor();

test( 'Inheritance Pattern: inheritance only provides get', function ( t ) {

    t.plan( 3 );

    t.ok( typeof myconstructor.get === 'function' );
    t.ok( typeof myconstructor._get === 'undefined' );
    t.ok( typeof myconstructor.get_ === 'undefined' );

} );

test( 'Inheritance Pattern: get works in the context of the new object', function ( t ) {

    t.plan( 3 );

    t.equal( myconstructor.get, perfget.get );
    t.equal( myconstructor.get( 'a.b.c' ), myconstructor.a.b.c );
    t.notEqual( myconstructor.get( 'a.b.c' ), perfget.get.call( obj, 'a.b.c' ) );

} );