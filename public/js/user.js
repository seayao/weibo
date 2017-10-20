/**
 * Created by Administrator on 2017/10/16.
 */
$(document).ready(function () {
    //rgbaster
    var avatar = $('.user-avatar-cover img')[0];
    var cover = $('.UserCover-noImage')[0];
    if(cover){
        RGBaster.colors(avatar, {
            //paletteSize: 30,
            exclude: ['rgb(255,255,255)', 'rgb(0,0,0)'],
            success: function (colors) {
                cover.style.backgroundColor = colors.palette[9];
            }
        });
    }
});
