/**
 * Created by Administrator on 2017/10/12.
 */
//(头像)图片加载失败处理
function avatarError(image) {
    image.onerror = "";
    image.src = "../../images/default/default_avatar.jpg";
    image.onerror = null;
}

//其他图片加载失败处理
function imageError(image) {
    image.onerror = "";
    image.src = "../../images/default/default_img.jpg";
    image.onerror = null;
}
