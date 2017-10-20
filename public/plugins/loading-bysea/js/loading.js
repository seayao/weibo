/**
 * Created by Administrator on 2017/9/21.
 */
(function ($) {
    $.fn.loading = function (options) {
        var parameter = {
            state: "open",        //open，close，加载状态，默认open
            type: "random",             //0-11，图片类型，random默认随机
            anim: "random",                //0-2，动画类型，random默认随机
            rgba: "rgba(0,0,0,0.3)",  //0-1，背景，默认0.3
            linearGradient: true,      //背景线性渐变，默认开启
            time: 6e3             //延时关闭动画，默认6s超时关闭
        };
        var ops = $.extend(parameter, options);
        var $this = $(this);
        var _this = this;
        var _state = ops.state;
        var _type = ops.type;
        var _anim = ops.anim;
        var _rgba = ops.rgba;
        var _gradient = Boolean(ops.linearGradient);
        var _time = ops.time;
        if (_state == 'open') {
            _this.css({
                "position": "fixed",
                "left": 0,
                "top": 0,
                "right": 0,
                "bottom": 0,
                "width": "100%",
                "height": "100%",
                "z-index": 999999
            });
            if (_gradient) {
                _this.css({
                    /*从上到下的线性渐变：*/ /* Safari 5.1 - 6.0 */ /* Opera 11.1 - 12.0 */ /* Firefox 3.6 - 15 */
                    "background": "-webkit-gradient(linear, left top, left bottom, from(#026da1), to(#4f453b))",
                    "background": "linear-gradient(#026da1, #4f453b)", /* 标准的语法 */
                    /*线性渐变 - 从左到右*/ /* Safari 5.1 - 6.0 */ /* Opera 11.1 - 12.0 */ /* Firefox 3.6 - 15 */
                    "background": "-webkit-gradient(linear, left top, right top, from(#6bb8d6) , to(#5a89a5))",
                    "background": "linear-gradient(to right, #6bb8d6 , #5a89a5)", /* 标准的语法 */
                    /*从左上角到右下角的线性渐变：*/ /* Safari 5.1 - 6.0 */ /* Opera 11.1 - 12.0 */ /* Firefox 3.6 - 15 */
                    "background": "-webkit-gradient(linear, left top, right bottom, from(#005c95) , to(#757263))",
                    "background": "linear-gradient(to bottom right, #005c95 , #757263)" /* 标准的语法 */
                });
            } else {
                _this.css({
                    "background-color": _rgba
                });
            }
            if (_type == 'random' || isNaN(_type)) {
                _type = parseInt(Math.random() * 12);
            } else {
                _type = parseInt(_type) % 12;
            }
            var loadHtml = '';
            loadHtml += '<div class="sea-loading-con">';
            loadHtml += '<div class="sea-loading-circle"></div>';
            loadHtml += '<img class="sea-pre-load-img" src="/plugins/loading-bysea/img/lol/' + _type + '.jpg">';
            loadHtml += ' </div>';
            _this.append(loadHtml);

            if (_anim == 'random' || isNaN(_anim)) {
                _anim = parseInt(Math.random() * 3);
            }
            switch (parseInt(_anim) % 3) {
                case 0 :
                    $this.fadeIn("normal");
                    break;
                case 1 :
                    $this.slideDown("normal");
                    break;
                case 2 :
                    _this.css("display", "block");
                    break;
            }

            if (!_time || isNaN(_time)) {
                _time = 10e3;
            }
            setTimeout(function () {
                switch (parseInt(_anim) % 3) {
                    case 0 :
                        $this.fadeOut("normal");
                        break;
                    case 1 :
                        $this.slideUp("normal");
                        break;
                    case 2 :
                        _this.css("display", "none");
                        break;
                }
            }, _time);

        } else if (_state == 'close') {
            _this.css({"display": "none"});
        } else {
            _this.css({"display": "none"});
        }
    }
})(jQuery);