/**
 * Created by Administrator on 2017/10/12.
 */
$(document).ready(function () {
    var avatar = $('.showHead')[0];
    var cover = $('.UserCover-noImage')[0];
    if (cover) {
        RGBaster.colors(avatar, {
            //paletteSize: 30,
            exclude: ['rgb(255,255,255)', 'rgb(0,0,0)'],
            success: function (colors) {
                cover.style.backgroundColor = colors.palette[9];
            }
        });
    }
});

//上传用户封面预览
$('#uploadCover').change(function (e) {
    var file = e.target.files;
    if (file.length) {
        file = file[0];
        var r = new FileReader();
        r.readAsDataURL(file);
        r.onload = function (e) {
            $('.pro-header').css('z-index', 3);
            $('.cover-edit-action').slideToggle('normal');
            $('.UserCover-image').css('display', 'block');
            $('.showCover').css('display', 'none');
            $('.UserCover-noImage').css('display', 'none');
            $('.showCover-preview').css('display', 'block').attr('src', this.result);
        };
        //clearAll();
    }
});

//用户封面取消上传操作
$('#ucBtnCancel').click(function () {
    $('.cover-edit-action').slideToggle('normal');
    $('.pro-header').css('z-index', 1);
    $('.showCover-preview').css('display', 'none').attr('src', '');
    //用户已有封面
    var cover = $('.showCover');
    if (cover.length == 1) {
        cover.css('display', 'block');
    } else {
        $('.UserCover-image').css('display', 'none');
        $('.UserCover-noImage').css('display', 'block');
    }
});

//用户封面上传操作
$('#ucBtnConfirm').click(function () {
    $('#coverForm').submit();
});

//上传头像预览
$('#uploadAvatar').change(function (e) {
    var file = e.target.files;
    if (file.length) {
        file = file[0];
        var r = new FileReader();
        r.readAsDataURL(file);
        r.onload = function (e) {
            $('.showHead-preview').css('display', 'block').attr('src', this.result);
            $('.showHead').css('display', 'none');
            $('.headBtn-wrap').slideToggle('normal');
        };
        //clearAll();
    }
});

//用户头像取消上传操作
$('#headBtnCancel').click(function () {
    $('.headBtn-wrap').slideToggle('normal');
    $('.showHead').css('display', 'block');
    $('.showHead-preview').css('display', 'none');
});

//用户头像上传操作
$('#headBtnConfirm').click(function () {
    $('#avatarForm').submit();
});

//用户信息编辑操作
$('.Field-Btn-Content').on('click','.Field-Btn',function(){
    $(this).parent().css('display','none');
    $(this).parent().parent().find('.Field-text').css('display','none');
    $(this).parent().parent().find('.Field-Content-Hidden').css('display','block');
});

//用户信息编辑取消操作
$('.Field-Btn-Handle').on('click','.Field-Cancel',function(){
    $(this).parent().parent().parent().find('.Field-Content-Hidden').css('display','none');
    $(this).parent().parent().parent().find('.Field-Btn-Content').css('display','inline-block');
    $(this).parent().parent().parent().find('.Field-text').css('display','inline-block');
});