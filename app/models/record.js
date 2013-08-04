/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-1-26
 * Time: 下午9:26
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema


var RecordSchema = new Schema({
    payer : {type : Schema.ObjectId, ref : 'User'}
    , group: {type : Schema.ObjectId, ref : 'Group' , index: true }
    , users: [{type : Schema.ObjectId, ref : 'User'}]
    , money:{ type: Number, default: 0 } //金额
    , mark: String
    , createdAt: {type : Date, default : Date.now}
    , editAt: {type : Date, default : Date.now}
})

mongoose.model('Record', RecordSchema)
