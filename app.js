//加载依赖库
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//加载路由控制
var index = require('./routes/index');
var users = require('./routes/users');

//使用时新添加的，上面的依赖包是创建文件时自带的。
var settings = require('./settings');//数据库连接依赖包
//session会话存储于数据库依赖包（与教程中的区别）
var session = require('express-session');//session使用
var MongoStore = require('connect-mongo')(session);//mongodb使用
//引入 flash 模块来实现页面通知
var flash = require('connect-flash');

//项目实例化
var app = express();

// view engine setup（设置模板位置和模板引擎格式）
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());//定义使用 flash 功能

// uncomment after placing your favicon in /public
//标签显示图标
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//定义日志和输出级别
app.use(logger('dev'));
//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//定义cookie解析器
app.use(cookieParser());
//定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//提供session支持（与教程中的区别）
app.use(session({
    secret: settings.cookieSecret,//secret 用来防止篡改 cookie
    key: settings.db,//cookie name
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    //设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免丢失。
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port,
        url: 'mongodb://localhost/'+settings.db
    })
}));

// 视图交互：实现用户不同登陆状态下显示不同的页面及显示登陆注册等时的成功和错误等提示信息
app.use(function(req, res, next){
    console.log("app.usr local");
    //res.locals.xxx实现xxx变量全局化，在其他页面直接访问变量名即可
    //访问session数据：用户信息
    res.locals.user = req.session.user;
    //获取要显示错误信息
    var error = req.flash('error');//获取flash中存储的error信息
    res.locals.error = error.length ? error : null;
    //获取要显示成功信息
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();//控制权转移，继续执行下一个app。use()
});

//定义匹配路由
app.use('/', index);//指向了routes目录下的index.js文件
app.use('/users', users);//指向了routes目录下的users.js文件

// catch 404 and forward to error handler（处理404错误）
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler（开发模式，处理500错误和错误堆栈跟踪）
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page（生产模式，处理500错误）
    res.status(err.status || 500);
    res.render('error');
});

//导出模块
module.exports = app;
