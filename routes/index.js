var express = require('express');
var router = express.Router();//创建模块化安装路径的处理程序。
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require("../models/post.js");//加载用户发表微博模块

/* GET home page. */
//首页:显示所有的微博，并按照时间先后顺序排列
router.get('/', function (req, res) {
    //读取所有的用户微博，传递把posts微博数据集传给首页
    Post.get(null, function (err, posts) {
        if (err) {
            posts = [];
        }
        //调用模板引擎，并传递参数给模板引擎
        res.render('index', {title: 'Answer - 为你开启探索知识的大门', posts: posts});
    });
});

//发现模块
router.get('/discover', function (req, res) {
    //读取所有的用户微博，传递把posts微博数据集传给首页
    Post.get(null, function (err, posts) {
        if (err) {
            posts = [];
        }
        //调用模板引擎，并传递参数给模板引擎
        res.render('discover', {title: '发现', posts: posts});
    });
});

//发现模块
router.get('/question', function (req, res) {
    //读取所有的用户微博，传递把posts微博数据集传给首页
    Post.get(null, function (err, posts) {
        if (err) {
            posts = [];
        }
        //调用模板引擎，并传递参数给模板引擎
        res.render('question', {title: '问答', posts: posts});
    });
});

//用户主页
router.get('/user/:useraccount', function (req, res) {//创建路由规则
    User.get(req.params.useraccount, function (err, user) {
        //判断用户是否存在
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        }
        //调用对象的方法用户存在，从数据库获取该用户的微博信息
        Post.get(user.useraccount, function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            //调用user模板引擎，并传送数据（用户名和微博集合）
            res.render('user', {
                title: user.useraccount + "的主页",
                user: user,
                posts: posts
            });
        });
    });
});

//用户设置界面
router.get('/setting/:useraccount', function (req, res) {//创建路由规则
    User.get(req.params.useraccount, function (err, user) {
        //判断用户是否存在
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        }
        res.render('setting', {
            title: "个人设置",
            user: user
        });
    });
});

//用户编辑个人信息页面获取
router.get('/user/:useraccount/edit', function (req, res) {//创建路由规则
    User.get(req.params.useraccount, function (err, user) {
        //判断用户是否存在
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        }
        res.render('edit', {
            title: "编辑个人资料",
            user: user
        });
    });
});
//用户编辑个人信息页面操作
router.post('/user/:useraccount/edit', function (req, res) {//路由规则/post
    var currentUser = req.session.user;//获取当前用户信息
    var userHead = req.files.head;
    var headUrl;
    if (!userHead) {
        req.flash('error', '请选择文件');
        res.redirect('/user/' + currentUser.useraccount + '/edit');
    } else {
        headUrl = '/upload/head/' + userHead.name;
        User.get(currentUser.useraccount, function (err, userInfo) {
            if (err) {
                req.flash('error', err);
                res.redirect('/user/' + currentUser.useraccount + '/edit');
            }
            User.update(currentUser.useraccount, userInfo.usernick, userInfo.password, headUrl, function (err) {
                if (err) {
                    req.flash('error', err);
                    res.redirect('/user/' + currentUser.useraccount + '/edit');
                }
                //更新session
                req.session.user = new User({
                    usernick: userInfo.usernick,
                    useraccount: currentUser.useraccount,
                    password: userInfo.password,
                    head: headUrl
                });
                req.flash('success', '头像上传成功');
                res.redirect('/user/' + currentUser.useraccount + '/edit');
            });
        });
    }
});


//发表
router.get('/publish', checkLogin);//页面权限控制
router.get('/publish', function (req, res) {
    res.render('publish', {title: '发表'});
});
router.post('/publish', function (req, res) {//路由规则/post
    var currentUser = req.session.user;//获取当前用户信息
    if (req.body.title == "") {//发布信息不能为空
        req.flash('error', '标题不能为空！');
        return res.redirect('/publish');
    } else if (req.body.content == "") {//发布信息不能为空
        req.flash('error', '正文不能为空！');
        return res.redirect('/publish');
    }
    //实例化Post对象
    var post = new Post(currentUser.useraccount, currentUser.usernick, currentUser.head, req.body.title, req.body.content, req.body.cover);//req.body.获取用户发表的内容
    //调用实例方法，发表微博，并把信息保存到MongoDB数据库
    post.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/publish');
        }
        req.flash('success', '发表成功');
        res.redirect('/user/' + currentUser.useraccount);
    });
});

//用户注册
router.get('/reg', checkNotLogin);//页面权限控制，注册功能只对未登录用户可用
router.get('/reg', function (req, res) {
    res.render('reg', {title: '用户注册'});
});
router.post('/reg', function (req, res) {
    //console.log(req.body['pwdrepeat'] + ";" + req.body['userpwd']);
    if (req.body.usernick == "") {
        //使用req.body.username获取提交请求的用户名，username为input的name
        req.flash('error', "请设置用户昵称！");//保存信息到error中，然后通过视图交互传递提示信息，调用alert.ejs模块进行显示
        return res.redirect('/reg');//返回reg页面
    } else if (req.body.useraccount == "") {
        req.flash('error', "请设置登录账号！");
        return res.redirect('/reg');
    } else if (req.body.userpwd == "") {
        req.flash('error', "请设置登录密码！");
        return res.redirect('/reg');
    } else if (req.body.pwdrepeat == "") {
        req.flash('error', "请重新输入登录密码！");
        return res.redirect('/reg');
    }
    //两次输入密码如果不一致，提示信息
    if (req.body['pwdrepeat'] !== req.body['userpwd']) {
        req.flash("error", "两次输入密码不一致！");//保存信息到error中，用于界面显示提示信息
        return res.redirect('/reg');
    }
    //把密码转换为MD5值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.userpwd).digest('base64');

    //用新注册用户信息对象实例化User对象，用于存储新注册用户和判断注册用户是否存在
    var newUser = new User({
        usernick: req.body.usernick,
        useraccount: req.body.useraccount,
        password: password,
        head: null,
        gender: req.body.gender
    });
    //检查用户名是否已经存在
    User.get(newUser.useraccount, function (err, user) {
        if (user) {
            if (user.usernick == newUser.usernick) {
                err = "该昵称已被占用！";
            } else if (user.useraccount == newUser.useraccount) {
                err = "该账号已存在，找回密码？";
            }
        }

        if (err) {
            req.flash('error', err);//保存错误信息，用于界面显示提示
            return res.redirect('/reg');
        }

        newUser.save(function (err) {
            //用户名不存在时，保存记录到数据库
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;//保存用户信息，用于判断用户是否已登录
            req.flash('success', req.session.user + "注册成功!");
            res.redirect('/');
        });
    });
});

//用户登录
router.get('/login', checkNotLogin);//登陆功能只对未登录用户可使用
router.get('/login', function (req, res) {
    res.render('login', {title: '用户登录'});
});
router.post('/login', checkNotLogin);
router.post('/login', function (req, res) {
    //输入为空时
    if (req.body.useraccount == "") {
        req.flash('error', "请输入用户账号！");
        return res.redirect('/login');
    } else if (req.body.userpwd == "") {
        req.flash('error', "请输入密码！");
        return res.redirect('/login');
    }
    //密码用md5值表示
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.userpwd).digest('base64');
    //判断用户名和密码是否存在和正确
    User.get(req.body.useraccount, function (err, user) {
        if (!user) {
            req.flash('error', "用户名不存在！");
            return res.redirect('/login');
        }
        if (user.password !== password) {
            req.flash('error', "用户密码不正确！");
            return res.redirect('/login');
        }
        //保存用户信息
        req.session.user = user;
        req.flash('success', "登录成功！");
        res.redirect('/');
    });
});

//用户登出
router.get('/logout', checkLogin);//退出功能只对已登陆的用户可用
router.get('/logout', function (req, res) {
    req.session.user = null;//清空session
    req.flash('success', "退出成功！");
    res.redirect('/');
});
//针对处理post请求，使用http invoker或ajax post向服务器端的地址（http://localhost:3000/users）提交post请求进行测试
router.post('/users', function (req, res) {
    console.log("admin refresh");
    res.send(200);
});

function checkNotLogin(req, res, next) {
    if (req.session.user)//用户存在
    {
        req.flash('error', "已登录！");
        return res.redirect('/');
    }
    next();//控制权转移：当不同路由规则向同一路径提交请求时，在通常情况下，请求总是被第一条路由规则捕获，
    // 后面的路由规则将会被忽略，为了可以访问同一路径的多个路由规则，使用next()实现控制权转移。
}
function checkLogin(req, res, next) {
    if (!req.session.user)//用户不存在
    {   //未登录跳转到登陆界面
        req.flash('error', "未登录！");
        return res.redirect('/login');
    }
    //已登录转移到下一个同一路径请求的路由规则操作
    next();
}

module.exports = router;
