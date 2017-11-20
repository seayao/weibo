/**
 * Created by Administrator on 2017/10/12.
 */
$(document).ready(function () {
    //预加载动画结束
    setTimeout(function () {
        $('#main-loading').fadeOut('normal');
    }, 200);

    //顶部导航消息提示
    $('.message-tips').flashing({
        color: '#f01414'
    });

    //顶部私信提示
    $('.private-letter').shake({
        rangeX: 3,
        rangeY: 5,
        rangeRot: 10,
        rumbleSpeed: 200
    });

    //bootstrap提示工具
    $(function () {
        $("[data-toggle='tooltip']").tooltip();
    });

    //轮播控制
    //var swiper = new Swiper('.swiper-container', {
    //    speed:600,
    //    autoplay: 5000,
    //    pagination: '.swiper-pagination',
    //    paginationClickable: true,
    //    autoplayDisableOnInteraction : false,
    //    loop:true,
    //    keyboardControl:true
    //});

    //智能隐藏导航栏
    var new_scroll_position = 0;
    var last_scroll_position;
    //设置滚动多少隐藏
    var setHeight = 60;
    var header = document.getElementById('menu-nav');
    window.addEventListener('scroll', function (e) {
        last_scroll_position = window.scrollY;
        // 向下滚动
        if (new_scroll_position < last_scroll_position && last_scroll_position > setHeight) {
            header.classList.remove('slideDown');
            header.classList.add('slideUp');
            // 向上滚动
        } else if (new_scroll_position > last_scroll_position) {
            header.classList.remove('slideUp');
            header.classList.add('slideDown');
            $('.web-code-div').css('display', 'none');
        }
        new_scroll_position = last_scroll_position;
    });

    //默认隐藏返回顶部按钮
    $(function () {
        //移动距离超过一定距离时出现
        $(window).scroll(function () {
            if ($(window).scrollTop() > 100) {
                $('.back-top').fadeIn('normal');
            } else {
                $('.back-top').fadeOut("normal");
            }
        });
        //返回顶部
        $('.back-top').click(function (e) {
            e.preventDefault();
            var speed = 500;//滑动的速度
            $('body,html').animate({scrollTop: 0}, speed);
            return false;
        });
    });
});

//资源标签页定位
$('#menu-nav .resource-drop-menu a').click(function (e) {
    var href = $(this).attr('href');
    var tabId = $(this).attr('data-tab');
    if ('#' !== href) {
        e.preventDefault();
        $(document).scrollTop($(href).offset().top - 70);
        if (tabId) {
            $('#feature-tab a[href=#' + tabId + ']').tab('show');
        }
    }
});

//导航点击样式切换
$('ul.navbar-nav > li').click(function () {
    $('ul.navbar-nav > li').removeClass('active');
    $(this).addClass('active');
});

//点击查看更多时执行
$('.view-details').click(function (e) {
    e.preventDefault();
    //弹出提示框
    $('.details-alert').modal('toggle');
});

//点击搜索时执行
//$('.my-search-btn').click(function () {
//    var seaVal = $('.my-search-input').val();
//    if (seaVal) {
//        $('.noval-alert').modal('hide');
//        $('body').loading({
//            loadingWidth:240,
//            title:'搜索中···',
//            titleColor:'rgba(0,0,0,0.7)',
//            titleFontSize:'16px',
//            titleFontWeight:'bold',
//            titleFontFamily:'"Microsoft Yahei", Arial, Helvetica, sans-serif',
//            name:'searching',
//            animateIn:'none',
//            discription:'这是一个描述...',
//            direction:'row',//方向，column纵向   row 横向
//            type:'origin',
//            mustRelative:true,
//            originBg:'#666',
//            originDivWidth:30,
//            originDivHeight:30,
//            originWidth:6,
//            originHeight:6,
//            smallLoading:false,
//            loadingBg:'rgba(255, 255, 255, 0.8)',
//            loadingMaskBg:'rgba(0,0,0,0.3)'
//        });
//
//        setTimeout(function(){
//            removeLoading('searching');
//        },3000);
//    } else {
//        $('.noval-alert').modal('show');
//    }
//});

//点击扫码
$('.scan-log').click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('.web-code-div').fadeToggle('fast');
});

//全屏检测二维码如存在则点击消失
$(window).click(function () {
    $('.web-code-div').fadeOut('fast');
});

//(头像)图片加载失败处理
function avatarError(image) {
    image.onerror = '';
    image.src = '../../images/default/default_avatar.jpg';
    image.onerror = null;
}

//(用户主页封面)图片加载失败处理
function coverError(image) {
    image.onerror = '';
    image.src = '../../images/default/default_cover.jpg';
    image.onerror = null;
}

//其他图片加载失败处理
function imageError(image) {
    image.onerror = '';
    image.src = '../../images/default/default_img.jpg';
    image.onerror = null;
}

//数字格式化，如15616 => 15.6k
function numFormat(num) {
    var result = Number(num);
    if (result >= 1000) {
        var remain = result % 1000;
        if (remain === 0) {
            result = parseInt(result / 1000);
        } else {
            result = (result / 1000).toFixed(1);
        }
        return result + 'k';
    } else {
        return result;
    }
}

////对数字进行格式化调用
//var numElement = document.querySelectorAll('strong');
//for (var i=0;i<numElement.length;i++){
//    numElement[i].innerHTML = numFormat(numElement[i].innerHTML);
//}


