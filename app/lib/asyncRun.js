/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng@
 * Date: 12-4-22
 * Time: 下午2:02

 var async = new AsyncRun();
 async.on('success',function(){});
 async.push(function(next,msg){ next()}).push(function(next){ next()}).run('test');
 async.run()
 */
//  Synchronous 同步    Asynchronous 异步
var push = Array.prototype.push,
    slice = Array.prototype.slice,
    events = require("events");
function RunList() {
    this.length = 0;
    Array.apply(this, arguments);
    events.EventEmitter.call( this );
}
require('util').inherits( RunList, events.EventEmitter );
RunList.prototype.run = function () {
    throw '没有实现'
};
RunList.prototype.clear = function () {
    this.length = 0;
    return this;
}
RunList.prototype.push = function () {
    push.apply(this, arguments);
    return this;
}
//异步方法
function AsyncRun() {}
require('util').inherits(AsyncRun, RunList);
AsyncRun.prototype.run = function () {
    var This = this, count = 0, len = this.length - 1 , er = [] ;
    var done = function( err ){
        count++;
        if( err ) er.push( err ); //如果有错误保存下来
        if( count <= len ) return; //是否执行完
        if( er.length > 0 ){
            This.emit('error', er );
        }else{
            This.emit('success');
        }
    }
    for( var i = 0 ; i <= len ; i++ ){
        setTimeout( this[i].bind( this , done ) , 0 );
    }
    if( i == 0 ){
        setTimeout( done , 0 );
    }
};
exports.AsyncRun = AsyncRun;
//同步方法，按顺序执行
function SynchRun() {}
require('util').inherits( SynchRun, RunList );
SynchRun.prototype.run = function () {
    var This = this, count = 0, args = [
        function (err) {
            if (err) {
                This.emit('error', err);
                return;
            }
            if (count >= This.length) {
                This.emit('success');
            } else {
                This[count++].apply(This, args);
            }
        }];
    push.apply(args, arguments);
    args[0]();
    return this;
};
exports.SynchRun = SynchRun;
exports.getRunList = function( isAsync ){
    if( isAsync ){ //如果可以异步执行
        return new AsyncRun();
    }else{
        return new SynchRun();
    }
}
