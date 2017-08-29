/**
 * Created by Administrator on 2017/7/18.
 */
//数字格式化，如15616 => 15.6k
function numFormat(num){
    var result = Number(num);
    if (result >= 1000){
        var remain = result%1000;
        if(remain === 0){
            result = parseInt(result/1000);
        }else {
            result = (result/1000).toFixed(1);
        }
        return result + "k";
    }else {
        return result;
    }
}

//对数字进行格式化
var numElement = document.querySelectorAll("strong");
for (var i=0;i<numElement.length;i++){
    numElement[i].innerHTML = numFormat(numElement[i].innerHTML);
}