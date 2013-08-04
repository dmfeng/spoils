/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-1-26
 * Time: 下午9:38
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose')
    , M_User = mongoose.model('User')
    , M_Record = mongoose.model('Record')
    , formatDate = require('../lib/format').formatDate
    , getRunList = require('../lib/asyncRun').getRunList


function checkRecord( data ){

    if( !data ) return '没有要保存的信息';

    if( !/^\d+$/.test( data.money ) ) return '金额错误';

    if( ! data.cdate ) return '请选择日期';

    if( ! /^\d{4}-\d{2}-\d{2}$/.test(data.cdate) ) return '日期格式错误';

    if( ! data.payer ) return '没有付款者';

    if( ! data.users || data.users.length == 0  ) return '没有参与者';

}

function addRecord( data , cbfun ){

    var errmsg = checkRecord( data );
    if( errmsg ){
        cbfun( errmsg );
        return;
    }

    var record = new M_Record( data );

    record.save(function (err) {

        cbfun( err ? '保存失败' : null );

    });

}





//增加一条记录
exports.addRecord = function (req, res ) {

    var data = req.body;
    data.createdAt = Date.parse( data.cdate );

    addRecord( data , function(  err , data ){
        if( err ){
            res.json({code:0, errmsg: err });
        }else{
            res.json({code:1, msg:'操作成功', data : data });
        }
    })

}

exports.addView = function( req, res ){

    M_User.find({},function( err , users ){
        if( err ){
           console.log('NO USERS')
        }else{
            res.render('records/add', {
                users : users
                , pageId: 'addRecord'
            });
        }
    })

}

exports.recordsList = function( req ,res ){

    var perPage = 15
        , page = req.param('page') || 1;

    var begin = req.param('begin')
        , end = req.param('end')

    var sObj = {}
    if( end || begin ){
        sObj['createdAt'] = {}
        if( begin ){
            sObj['createdAt'].$gte = Date.parse( begin )
        }
        if( end ){
            sObj['createdAt'].$lte = Date.parse( end )
        }
    }


    var runList = getRunList();

    var userObj = {}
    runList.push(function( next ){

        M_User.find({}).select('username').exec(function( err , data ){
            if (err){  return next(err); }

            data.forEach(function( obj ) {
                userObj[ obj._id ] = obj ;
            })

            next();

        })

    })

    var allCount = 0
    runList.push(function( next ){

        M_Record.count( sObj ).exec(function (err, count) {
            if (err) return next( err );
            allCount = count;
            next();
        });

    });

    var rList;
    runList.push(function( next ){

        if( allCount == 0 ){
            rList = [];
            return next();
        }

        M_Record
            .find( sObj )
            .sort('createdAt','descending') // sort by date
            .sort('_id','descending') // sort by id
            .limit(perPage)
            .skip(perPage * (page-1))
            .exec(function( err, records ) {

                if (err) return next( err )

                var list = [];
                records.forEach( function( obj , idx ){

                    var rObj = {
                        payer : userObj[ obj.payer ],
                        createdAt : formatDate( new Date( obj.createdAt ) ) ,
                        money : obj.money,
                        mark : obj.mark,
                        users : [],
                        _id : obj._id
                    }
                    list[ idx ] = rObj;

                    obj.users.forEach( function( key , idx ){
                        rObj.users[idx] = userObj[ key ].username
                    })
                    rObj.users = rObj.users.join(' ')
                })

                rList = list;

                next();
            })

    })



    runList.on('success' , function(){
        res.render('records/list', {
            recordList: rList
            , pageId: 'record'
            , page: page
            , allCount: allCount
            , perPage : perPage

            ,begin_date: begin || ''
            ,end_date : end || ''
        })
    })

    runList.on('error' , function(err){

        res.render('500');
    })

    runList.run();

}


function editRecord( rid , data , cbfun ){

    var errmsg = checkRecord( data );
    if( errmsg ) return cbfun( errmsg );

    data.createdAt = Date.parse( data.cdate );
    data.editAt = Date.now();

    M_Record.update({_id : rid } , {
        $set : data
    } , function(err){
        cbfun(err ? '修改失败' : null );
    })

}

exports.editRecord = function( req ,res ){

    var rid = req.param('rid');

    editRecord( rid , req.body , function(err,data){
        if( err ){
            res.json({code:0, errmsg: err });
        }else{
            res.json({code:1, msg:'修改成功', data : data });
        }
    } )


}

exports.editRecordView = function( req ,res ){

    var rid = req.param('rid');
    var runList = getRunList();
    var users , record;

    runList.push(function( next ){
        M_Record.findById( rid , function( err , rData ){
            if (err) return next(err);
            record = rData;

            record.created_At = formatDate( record.createdAt )

            next();
        } )
    })

    runList.push(function( next ){
        M_User.find({},function( err , uData ){
            if (err) return next(err);
            users = uData;
            next();
        })
    })

    runList.on('success' , function(){
        res.render('records/edit', {
            pageId: 'record',
            record : record,
            users : users
        })
    })

    runList.on('error' , function(){
        res.render('500');
    })

    runList.run();

}


exports.delRecord = function( req, res ){
    var rid = req.param('rid');

    if( !rid ) {
        return res.json({code:0, errmsg:'没有ID,删你妹啊'});
    }

    M_Record.remove({ '_id' : rid }, function( err ){

        if( req.body.ajax == 1 ){
            res.json({code:1, msg:'删除成功!'});
        }else{
            res.redirect('/record/list');
        }

    });
}

exports.delAll = function( req, res ){
    M_Record.remove({},function(){
        M_User.remove({},function(){
            res.redirect('/record/list');
        })

    })

}
