
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {

    if ( ! req.session.user ) {
      if( req.method === 'GET' ){
          return res.redirect('/login')
      }else{
          return res.json({code:2, errmsg: '没有登录' });
      }
  }
  next()
};
