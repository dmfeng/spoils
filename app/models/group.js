/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-1-26
 * Time: 下午8:08
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema


var GroupSchema = new Schema({
    name: String
    , users: {type : Schema.ObjectId, ref : 'User'}
    , createdAt: {type : Date, default : Date.now}
})

mongoose.model('Group', GroupSchema)