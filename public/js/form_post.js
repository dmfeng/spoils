/**
 * Created with JetBrains WebStorm.
 * User: dimu.feng
 * Date: 13-1-28
 * Time: 下午7:03
 * To change this template use File | Settings | File Templates.
 */

$(function(){
    $('#j-add_form').submit(function(){

        var data = $('#j-add_form').serialize();
        $('#js-submit').button('loading');

        var url = $(this).attr('action');
        $.post( url , data , function( json ){

            var $alert;
            if( !json || json.code === 0 ){
                $('<div class="alert alert-error">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>失败!</strong>'+ json.errmsg +'</div>').appendTo('#js-add_errmsg').alert();
                $('#js-submit').button('reset');
            }else{
                $alert = $('<div class="alert alert-success">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>成功！</strong>已保存</div>').appendTo('#js-add_errmsg').alert();
                $alert.bind('closed',function(){
                    location.reload();
                });
                setTimeout(function(){
                    $alert.alert('close');
                },1000);
            }
        })
        return false;
    });
});