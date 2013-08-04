/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-1-26
 * Time: 下午9:03
 * To change this template use File | Settings | File Templates.
 */


function createPagination (req) {
    return function createPagination (allCount, perPage , page) {
        var url = require('url')
            , qs = require('querystring')
            , params = qs.parse(url.parse(req.url).query)
            , pages =  Math.ceil( allCount / perPage )
            , str = ''

        if( pages < 2 ) return ''

        str += '<div class="pagination"><ul>'
        params.page = 1
        var clas = page == 1 ? "active" : "no"
        str += '<li class="'+clas+'"><a href="?'+ qs.stringify(params)+'">第一页</a></li>'
        for (var p = 1; p <= pages; p++) {
            params.page = p
            clas = page == p ? "active" : "no"
            str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">'+ p +'</a></li>'
        }
        params.page = --p
        clas = page == params.page ? "active" : "no"
        str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">最后一页</a></li>'
        str += '</ul></div> '
        return str
    }
}


module.exports = function (config) {
    return function (req, res, next) {
        res.locals.appName = config.app.name
        res.locals.title = '集体财务记录系统'
        res.locals.req = req
        res.locals.pageId = 'other'
        res.locals.isActive = function (link) {
            return req.url === link ? 'active' : ''
        }
        //res.locals.formatDate = formatDate
        //res.locals.stripScript = stripScript
        res.locals.createPagination = createPagination(req)
        next()
    }
}