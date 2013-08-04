/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-1-26
 * Time: 下午8:38
 * To change this template use File | Settings | File Templates.
 */
var auth = require('./middlewares/authorization')
module.exports = function ( app ) {
    app.get('/', function(req,res){
        res.redirect('/record/add');
    })
    // user routes
    var users = require('../app/controllers/users')
    app.get('/login', users.loginView);
    app.post('/login', users.login);
    app.get('/users/add', auth.requiresLogin, users.addUserView);
    app.post('/users/add', auth.requiresLogin, users.addUser );
    app.get('/users/list', auth.requiresLogin, users.userListView );
    app.get('/users/del/:uid', auth.requiresLogin, users.delUser );
    //records soutes
    var records = require('../app/controllers/records');
    app.get('/record/add', auth.requiresLogin, records.addView );
    app.post('/record/add', auth.requiresLogin, records.addRecord );
    app.get('/record/edit/:rid', auth.requiresLogin, records.editRecordView );
    app.post('/record/edit/:rid', auth.requiresLogin, records.editRecord );
    app.get('/record/list', auth.requiresLogin, records.recordsList );
    app.get('/record/del/:rid', auth.requiresLogin, records.delRecord );
    //app.get('/admin/delAll', records.delAll );
    //app.post('/admin/record/add', records.addRecord );
    //app.post('/admin/users/add',  users.addUser );
}