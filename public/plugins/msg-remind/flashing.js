//direction:滚动方向 left（向左）right（向右） top(向上) bottom(向下) 默认top
//line:每一次滚动数量 默认是1
//speed:完成一次动画所需时间 默认是1000等于1秒
//timer:每一次动画的时间间隔 默认是0等于0秒
//autoPlay:是否自动滚动 默认true
//fadein:是否支持淡入或淡出 默认false
//enterStop:鼠标移入是否暂停滚动 默认是false
(function ($) {
    $.fn.flashing = function (options) {
        var parameter = {
            color: "#333",     //字体的颜色
            timer: "1000",     //闪烁的间隔
            speed: "800",      //闪烁的速度
            enterStop:false    //鼠标移入暂停
        };
        var ops = $.extend(parameter, options);

        return this.each(function(){
            var $this = $(this);
            var _color = ops.color;
            var _timer = ops.timer;
            var _speed = ops.speed;
            var _enterStop = ops.enterStop;

            $this.css({color:_color});
            flashFunc = function (){
                $this.fadeOut(_speed).fadeIn(_speed);
            };

            var timerId;
            if(!_enterStop){
                setInterval(flashFunc,_timer);
            }else {
                $this.hover(function () {
                    clearInterval(timerId);
                }, function () {
                    timerId = setInterval(flashFunc, _timer);
                }).mouseout();
            }
        });
    }
})(jQuery);