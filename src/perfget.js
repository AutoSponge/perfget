(function ( GLOBAL ) {

    'use strict';

    function Perfget() {}

    Perfget.prototype.get = (function () {
        var depthCache = {};

        function _get( path ) {
            var pathParts = path ? path.split ? path.split( '.' ) : path : [],
                currentPart = '(_ = this[\'' + pathParts.shift() + '\'])',
                result = 'var _ = this; return ' + currentPart;

            while ( pathParts.length ) {
                currentPart = '(_ = _[\'' + pathParts.shift() + '\'])';
                result += ' && ' + currentPart;
            }
            return ( depthCache[path] = new Function( result ) ).call( this );  // jshint ignore:line
        }

        return function( path ) {
            return ( depthCache[path] || _get ).call( this, path );
        };
    }());

    var perfget = new Perfget();

    perfget._get = function _get( reciever ) {
        return function ( path ) {
            return perfget.get.call( reciever, path );
        };
    };

    perfget.get_ = function get_( path ) {
        return function ( reciever ) {
            return perfget.get.call( reciever, path );
        };
    };

    perfget.factory = function () {
        return new Perfget();
    };

    if ( typeof module === 'undefined' ) {

        GLOBAL.get = perfget.get;
        GLOBAL._get = perfget._get;
        GLOBAL.get_ = perfget.get_;
        GLOBAL.perfget = perfget.factory;

    } else {

        module.exports = perfget;

    }

}( this ));