(function ( GLOBAL ) {

    'use strict';

    function Perfget() {}

    Perfget.prototype.get = (function () {
        var depthCache = {};

        function getDepth( depth ) {
            var params = '',
                vars = '  var _0 = this',
                body = false,
                h, i;

            if ( !depthCache[depth] ) {
                for ( i = 0; i < depth; i += 1 ) {
                    params += i ? (', $' + i) : '$' + i;
                    vars += i ? (', _' + i) : '';
                }
                vars += ';\n';
                for ( h = i - 1; i > 0; i -= 1, h -= 1 ) {
                    if ( !body ) {
                        body = '_' + h + ' === Object(_' + h + ') && ($' + h + ' in _' + h + ') ? _' + h + '[$' + h + ']';
                    } else {
                        body = '(_' + i + ' = _' + h + '[$' + h + '], _' + i + ') && ' + body;
                    }
                }
                body = '  return ' + (!body ? '_0;' : body + ' : void(0);');
                depthCache[depth] = Function( params, vars + body );  // jshint ignore:line
            }
            return depthCache[depth];
        }

        return function ( path ) {
            var params = path ? path.split ? path.split( '.' ) : path : [];
            return getDepth( params.length ).apply( this, params );
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

    if ( typeof module === 'undefined' ) {

        GLOBAL.get = perfget.get;
        GLOBAL._get = perfget._get;
        GLOBAL.get_ = perfget.get_;

    } else {

        module.exports = perfget;

    }

}( this ));