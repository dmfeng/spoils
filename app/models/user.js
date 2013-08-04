/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-1-26
 * Time: 下午7:54
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , crypto = require('crypto')

var UserSchema = new Schema({
    name: String
    , email: String
    , username: String
    , salt : String
    , isAdmin : { type: Number, default: 0 } //是否管理员
    , hashed_password: String
    , createdAt: {type : Date, default : Date.now}
})

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() { return this._password })

// methods

UserSchema.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
})

//检查密码
UserSchema.method('authenticate', function(plainText) {

    return this.encryptPassword(plainText) === this.hashed_password
})

//sha1加密密码
UserSchema.method('encryptPassword', function(password) {
    if (!password) return ''
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
})

mongoose.model('User', UserSchema);
