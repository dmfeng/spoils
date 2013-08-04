/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-2-17
 * Time: 下午3:14
 * To change this template use File | Settings | File Templates.
 */

function parseFormat(format){
    var separator = format.match(/[.\/-].*?/),
        parts = format.split(/\W+/);
    if (!separator || !parts || parts.length == 0){
        throw new Error("Invalid date format.");
    }
    return {separator: separator, parts: parts};
}

function formatDate( date, format ){
    var val = {
        d: date.getDate(),
        m: date.getMonth() + 1,
        yy: date.getFullYear().toString().substring(2),
        yyyy: date.getFullYear()
    };
    val.dd = (val.d < 10 ? '0' : '') + val.d;
    val.mm = (val.m < 10 ? '0' : '') + val.m;
    var date = [];
    for (var i=0, cnt = format.parts.length; i < cnt; i++) {
        date.push(val[format.parts[i]]);
    }
    return date.join(format.separator);
}

var formatCache = {}

exports.formatDate = function( date , format ){

    format = format || 'yyyy-mm-dd'

    if( !formatCache[ format ] ){
        formatCache[ format ] = parseFormat( format );
    }

    return formatDate( date, formatCache[ format ] )

}