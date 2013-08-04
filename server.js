/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-1-26
 * Time: 下午8:39
 * To change this template use File | Settings | File Templates.
 */

var express = require('express')
    , fs = require('fs')


// Load configurations
var env = process.env.NODE_ENV || 'dev'
// http://cnodejs.net/ NAE
if( /cnode-app-engine/.test( process.env.HOME ) ){
    env = 'nae'
}

var config = require('./config/config')[env]
    , mongoose = require('mongoose')
    , http = require('http')

mongoose.connect( config.db );

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file)
})

var app = express()

// express settings
require('./config/express')(app, config )

// Bootstrap routes
require('./config/routes')(app)

var port = process.env.PORT || config.port || 3000
http.createServer( app ).listen( port , function(){
    console.log("Express server listening on port " + port );
});
