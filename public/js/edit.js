/**
 * Created by Administrator on 2017/10/12.
 */
//上传图片预览
$("#uploadHead").change(function (e) {
    var file = e.target.files;
    if (file.length) {
        file = file[0];
        var r = new FileReader();
        r.readAsDataURL(file);
        r.onload = function (e) {
            $("#showHead").attr('src',this.result);
        };
        //clearAll();
    }
});

//提交头像表单
$("#headBtn").click(function(){
    $("#headForm").submit();
});