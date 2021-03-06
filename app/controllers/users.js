/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-1-26
 * Time: 下午8:32
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose')
    , M_User = mongoose.model('User')
    , M_Record = mongoose.model('Record')
    , getRunList = require('../lib/asyncRun').getRunList

//登陆
exports.loginView = function (req, res) {

    res.render('users/login', {
        title: '登录', pageId: 'user', message: req.flash('error')
    })
}

//登陆
exports.login = function (req, res) {

    var name = req.body.name;
    var pass = req.body.pass;

    var loginUrl = '/login'

    if (!name || !pass) {
        return res.redirect(loginUrl);
    }

    M_User.find({ 'name': name}, function (err, user) {

        if (err || user.length == 0) {
            return res.redirect(loginUrl);
        }

        user = user[0]

        if (user.authenticate(pass)) { //成功
            req.session.user = {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            }
            res.redirect('/record/add');
        } else { //失败
            res.redirect(loginUrl);
        }

    })

}


//注册
exports.signup = function (req, res) {
    res.render('users/signup', {
        title: '注册', pageId: 'user', user: new User()
    })
}

function checkUser(data) {

    if (!data) return '没有要保存的信息';

    if (!data.name) return '登录名不能为空';

    if (!data.password) return '密码不能为空';

    if (!data.username) return '昵称不能为空';

}

function addUser(data, cbfun) {

    var errmsg = checkUser(data);
    if (errmsg) {
        cbfun(errmsg);
        return;
    }

    var user = new M_User(data);

    user.save(function (err) {

        cbfun(err ? '保存失败' : null, user._id);

    });

}
exports.addUser = function (req, res) {
    addUser(req.body, function (err, data) {
        if (err) {
            res.json({code: 0, errmsg: err });
        } else {
            res.json({code: 1, msg: '操作成功', data: data });
        }
    })
}

exports.addUserView = function (req, res) {

    res.render('users/addUser', {pageId: 'user'});

}

exports.userListView = function (req, res) {

    var runList = getRunList();

    var userList = [] , userObj = {};
    runList.push(function (next) {

        M_User.find({}, function (err, data) {
            userList = data;

            data.forEach(function (user) {
                user.money = 0;
                user.payMoney = 0;
                userObj[user._id] = user;
            })

            next();
        });
    })

    var recordList = [];
    runList.push(function (next) {

        M_Record.find({}, function (err, data) {
            recordList = data;
            next();
        });

    })

    runList.push(function (next) {

        recordList.forEach(function (record) {

            var money = record.money,
                count = record.users.length;

            var num = money / count;
            record.users.forEach(function (uid) {
                var user = userObj[uid];
                user.money = user.money + num;
            })

            var payUser = userObj[record.payer];
            payUser.payMoney = payUser.payMoney + money;

        })

        next();

    })

    runList.push(function (next) {

        userList.forEach(function (user) {
            user.money = Math.round(user.money);
            user.needPay = user.money - user.payMoney;
        })
        next();

    })

    runList.on('success', function () {

        res.render('users/list', {
            userList: userList, pageId: 'user'
        });

    });

    runList.run();

}

exports.delUser = function (req, res) {
    var uid = req.param('uid');

    if (!uid) {
        return res.json({code: 0, errmsg: '没有ID,删你妹啊'});
    }


    M_User.remove({ '_id': uid }, function (err) {

        if (req.body.ajax == 1) {
            res.json({code: 1, msg: '删除成功!'});
        } else {
            res.redirect('/users/list');
        }


    });
}