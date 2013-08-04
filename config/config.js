/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-1-26
 * Time: 下午8:37
 * To change this template use File | Settings | File Templates.
 */

module.exports = {
    dev: {
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: '集体财务记录系统'
        },
        db: 'mongodb://10.0.0.102/noobjs_dev'
    }
    , test: {

    }
    , online: {
        port:8888,
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: '财务记录系统'
        },
        db: 'mongodb://127.0.0.1/money'
    }

    , nae: {
        port:80,
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: '财务记录系统'
        },
        db: '正式环境DB'
    }

}
