/**
 * Created by Administrator on 2017/10/18.
 */
$(document).ready(function () {
    //summernote加载中文语言包
    $('.summernote').summernote({
        lang: 'zh-CN',
    });

    //初始化summernote
    $('#editContent').summernote({
        lang: 'zh-CN',
        focus: true,
        height: 650
    });
});


//上传文章封面图预览
$('#article-cover').change(function (e) {
    var file = e.target.files;
    if (file.length) {
        file = file[0];
        var r = new FileReader();
        r.readAsDataURL(file);
        r.onload = function (e) {
            $('.showCover-preview').css('display', 'block').attr('src', this.result);
            $('.show-cover-handle').slideDown('normal');
            $('.article-cover-wrap').css('display', 'none');
        };
    }
});

//上传文章封面图更换操作
$('#changeCoverBtn').click(function () {
    $('#article-cover').trigger('click');
});

//上传文章封面图取消操作
$('#delCoverBtn').click(function () {
    $('.show-cover-handle').slideUp('normal');
    $('.article-cover-wrap').fadeIn('normal');
    $('.showCover-preview').css('display', 'none').attr('src', '');
    $('#article-cover').val('');
});

//发布文章操作
$('#pubArticle').click(function(){
    var markup = $('#editContent').summernote('code');
    $('#article-detail').val(markup);
    $('#articleForm').submit();
});
