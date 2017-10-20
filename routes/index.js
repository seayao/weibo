var express = require('express');
var router = express.Router();//创建模块化安装路径的处理程序。
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');//加载用户发表微博模块

/* GET home page. */
//首页:显示所有的微博，并按照时间先后顺序排列
router.get('/', function (req, res) {
    //读取所有的用户微博，传递把posts微博数据集传给首页
    Post.get(null, function (err, posts) {
        if (err) {
            posts = [];
        }
        //读取5个热门用户
        User.getAll(5, function (err, hotUsers) {
            if (err) {
                hotUsers = [];
            }
            //调用模板引擎，并传递参数给模板引擎
            res.render('index', {
                title: 'Answer - 为你开启探索知识的大门',
                posts: posts,
                hotUsers: hotUsers,
                user_sn: req.session.user_sn
            });
        });
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
        res.render('discover', {
            title: '发现',
            posts: posts,
            user_sn: req.session.user_sn
        });
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
        res.render('question', {
            title: '问答',
            posts: posts,
            user_sn: req.session.user_sn
        });
    });
});

//用户主页
router.get('/user/:account', function (req, res) {//创建路由规则
    User.get(req.params.account, function (err, user) {
        //判断用户是否存在
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        }
        //调用对象的方法用户存在，从数据库获取该用户的微博信息
        Post.get(user.account, function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            //调用user模板引擎，并传送数据（用户名和微博集合）
            res.render('user', {
                title: user.account + '的主页',
                posts: posts,
                user_db: user,
                user_sn: req.session.user_sn
            });
        });
    });
});

//用户设置界面
router.get('/setting/:account', checkLogin);
router.get('/setting/:account', function (req, res) {//创建路由规则
    User.get(req.params.account, function (err, user) {
        //判断用户是否存在
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        }
        res.render('setting', {
            title: '个人设置',
            user_db: user,
            user_sn: req.session.user_sn
        });
    });
});

//用户编辑个人信息页面获取
router.get('/user/:account/edit', checkLogin);
router.get('/user/:account/edit', function (req, res) {//创建路由规则
    User.get(req.params.account, function (err, user) {
        //判断用户是否存在
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        } else if (req.session.user_sn.account !== user.account) {
            req.flash('error', '无权限!');
            return res.redirect('/user/' + user.account);
        }
        //更新session（用户编辑个人信息成功后，更新）
        req.session.user_sn = user;
        res.render('edit', {
            title: '编辑个人资料',
            user_db: user,
            user_sn: req.session.user_sn
        });
    });
});

//用户编辑个人信息页面操作
router.post('/user/:account/edit', checkLogin);
router.post('/user/:account/edit', function (req, res) {//路由规则/post
    var sessionUser = req.session.user_sn;//获取当前用户信息
    //用户头像
    var avatar = req.files.avatar;
    //用户封面
    var userCover = req.files.cover;
    //定义头像和封面存储路径
    var avatarUrl, userCoverUrl;
    if (!avatar && !userCover && !req.body) {
        req.flash('error', '请补全信息');
        res.redirect('/user/' + sessionUser.account + '/edit');
    } else {
        //用户头像最终路径
        if (avatar) {
            avatarUrl = '/upload/avatar/' + avatar.name;
        } else {
            avatarUrl = sessionUser.avatar;
        }
        //用户封面最终路径
        if (userCover) {
            userCoverUrl = '/upload/avatar/' + userCover.name;
        } else {
            userCoverUrl = sessionUser.cover;
        }
        //数据库操作
        User.get(sessionUser.account, function (err, userInfo) {
            if (err) {
                req.flash('error', err);
                res.redirect('/user/' + sessionUser.account + '/edit');
            }
            var now = new Date();
            var currTime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes() + ':' + (now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()));
            //构造更新后的用户
            var updateUser = new User({
                account: sessionUser.account,
                nickname: req.body.nickname || sessionUser.nickname,
                password: req.body.password || sessionUser.password,//密码要加密，待处理
                cover: userCoverUrl,
                avatar: avatarUrl,
                gender: req.body.gender || sessionUser.gender,
                headline: req.body.headline || sessionUser.headline,
                labels: req.body.labels || sessionUser.labels,
                address: req.body.address || sessionUser.address,
                describe: req.body.describe || sessionUser.describe,
                birthday: req.body.birthday || sessionUser.birthday,
                profession: req.body.profession || sessionUser.profession,
                profession_exp: req.body.profession_exp || sessionUser.profession_exp,//对象数组
                education_exp: req.body.education_exp || sessionUser.education_exp,//对象数组
                contacts: req.body.contacts || sessionUser.contacts,//对象数组
                updated_time: currTime
            });
            User.update(updateUser, function (err) {
                if (err) {
                    req.flash('error', err);
                    res.redirect('/user/' + sessionUser.account + '/edit');
                }
                req.flash('success', '保存成功');
                res.redirect('/user/' + sessionUser.account + '/edit');
            });
        });
    }
});


//发表
router.get('/publish', checkLogin);//页面权限控制
router.get('/publish', function (req, res) {
    res.render('publish', {
        title: '发表',
        user_sn: req.session.user_sn
    });
});
router.post('/publish', checkLogin);
router.post('/publish', function (req, res) {//路由规则/post
    var sessionUser = req.session.user_sn;//获取当前用户信息
    //文章封面
    var postCover = req.files.cover;
    //定义文章封面存储路径
    var postCoverUrl = '';
    //定义话题数组
    var topicsArr = [];
    if (!req.body.title || req.body.title == '') {//发布标题不能为空
        req.flash('error', '标题不能为空！');
        return res.redirect('/publish');
    } else if (!filterStr(req.body.detail)) {//发布内容不能为空
        req.flash('error', '正文不能为空！');
        return res.redirect('/publish');
    } else if (!req.body.topics || req.body.topics == '') {
        req.flash('error', '至少选择一个话题！');
        return res.redirect('/publish');
    }

    //封面图路径处理
    if (postCover) {
        postCoverUrl = '/upload/avatar/' + postCover.name;
    }

    //话题选择处理
    if (typeof req.body.topics == 'string') {
        topicsArr.push(req.body.topics);
    } else {
        topicsArr = req.body.topics;
    }

    //选择匿名处理
    var isAnonymous = req.body.isAnonymous;
    isAnonymous = (isAnonymous === 'true');

    //实例化Post对象
    var post = new Post({
        article_id: '',
        author: {
            'user_id': sessionUser.user_id,
            'account': sessionUser.account,
            'nickname': sessionUser.nickname,
            'headline': sessionUser.headline,
            'avatar': sessionUser.avatar
        },
        title: req.body.title,
        detail: req.body.detail,
        cover: postCoverUrl,
        topics: topicsArr,
        url: '',
        isTop: false,
        canComment: {
            'status': req.body.canComment || '1',//0：关闭评论；1：可以评论；2：评论待审核
            'reason': ''
        },
        visitCount: 0,
        followerCount: 0,
        answerCount: 0,
        praiseCount: 0,
        commentCount: 0,
        isReportedCount: 0,
        reportUser: [],
        isMutedCount: 0,
        muteUser: [],
        article_type: 'article',
        article_status: {
            'isAnonymous': isAnonymous,
            'isLocked': req.body.isLocked || '0',//0：公开；1：私密；2：指定人可见
            'isClose': false,
            'readRange': []
        }
    });

    //调用实例方法，发表微博，并把信息保存到MongoDB数据库
    post.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/publish');
        }
        req.flash('success', '发表成功');
        res.redirect('/user/' + sessionUser.account);
    });
});

//用户注册
router.get('/reg', checkNotLogin);//页面权限控制，注册功能只对未登录用户可用
router.get('/reg', function (req, res) {
    res.render('reg', {
        title: '用户注册',
        user_sn: req.session.user_sn
    });
});
router.post('/reg', checkNotLogin);
router.post('/reg', function (req, res) {
    //console.log(req.body['pwdrepeat'] + ';' + req.body['userpwd']);
    if (!req.body.nickname || req.body.nickname == '') {
        //使用req.body.username获取提交请求的用户名，username为input的name
        req.flash('error', '请设置用户昵称！');//保存信息到error中，然后通过视图交互传递提示信息，调用alert.ejs模块进行显示
        return res.redirect('/reg');//返回reg页面
    } else if (!req.body.account || req.body.account == '') {
        req.flash('error', '请设置登录账号！');
        return res.redirect('/reg');
    } else if (!req.body.user_pwd || req.body.user_pwd == '') {
        req.flash('error', '请设置登录密码！');
        return res.redirect('/reg');
    } else if (!req.body.pwd_repeat || req.body.pwd_repeat == '') {
        req.flash('error', '请重新输入登录密码！');
        return res.redirect('/reg');
    } else if (!req.body.gender || req.body.gender == '') {
        req.flash('error', '请选择性别！');
        return res.redirect('/reg');
    }
    //两次输入密码如果不一致，提示信息
    if (req.body['pwd_repeat'] !== req.body['user_pwd']) {
        req.flash('error', '两次输入密码不一致！');//保存信息到error中，用于界面显示提示信息
        return res.redirect('/reg');
    }
    //把密码转换为MD5值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.user_pwd).digest('base64');

    //用新注册用户信息对象实例化User对象，用于存储新注册用户和判断注册用户是否存在
    var newUser = new User({
        user_id: '',
        account: req.body.account,
        nickname: req.body.nickname,
        password: password,
        url: '',
        cover: '',
        avatar: '',
        gender: req.body.gender,
        headline: '',
        labels: [],
        address: '',
        describe: '',
        birthday: '',
        profession: '',
        profession_exp: null,//对象数组，暂定null
        education_exp: null,//对象数组，暂定null
        contacts: null,//对象数组，暂定null
        fansCount: 0,
        followerCount: 0,
        visitCount: 0,
        isReportedCount: 0,
        reportUser: [],
        isMutedCount: 0,
        muteUser: [],
        disabled: false,
        expire_time: ''
    });

    //检查用户名是否已经存在
    User.get(newUser.account, function (err, user) {
        if (user) {
            //在此判断user_id是否重复，待处理
            if (user.account == newUser.account) {
                err = '该账号已存在，找回密码？';
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
            req.session.user_sn = newUser;//保存用户信息，用于判断用户是否已登录
            req.flash('success', req.session.user_sn.account + '注册成功!');
            return res.redirect('/');
        });
    });
});

//用户登录
router.get('/login', checkNotLogin);//登陆功能只对未登录用户可使用
router.get('/login', function (req, res) {
    res.render('login', {
        title: '用户登录',
        user_sn: req.session.user_sn
    });
});
router.post('/login', checkNotLogin);
router.post('/login', function (req, res) {
    //输入为空时
    if (req.body.account == '') {
        req.flash('error', '请输入用户账号！');
        return res.redirect('/login');
    } else if (req.body.user_pwd == '') {
        req.flash('error', '请输入密码！');
        return res.redirect('/login');
    }
    //密码用md5值表示
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.user_pwd).digest('base64');
    //判断用户名和密码是否存在和正确
    User.get(req.body.account, function (err, user) {
        if (!user) {
            req.flash('error', '用户名不存在，去注册？');
            return res.redirect('/login');
        }
        if (user.password !== password) {
            req.flash('error', '用户密码不正确！');
            return res.redirect('/login');
        }
        //保存用户信息
        req.session.user_sn = user;
        req.flash('success', '登录成功！');
        return res.redirect('/');
    });
});

//用户登出
router.get('/logout', checkLogin);//退出功能只对已登录的用户可用
router.get('/logout', function (req, res) {
    req.session.user_sn = null;//清空session
    req.flash('success', '退出成功！');
    return res.redirect('/');
});

//针对处理post请求，使用http invoker或ajax post向服务器端的地址（http://localhost:3000/users）提交post请求进行测试
router.post('/users', function (req, res) {
    console.log('admin refresh');
    res.send(200);
});

function checkNotLogin(req, res, next) {
    if (req.session.user_sn)//用户存在
    {
        req.flash('error', '已登录！');
        return res.redirect('/');
    }
    next();//控制权转移：当不同路由规则向同一路径提交请求时，在通常情况下，请求总是被第一条路由规则捕获，
    // 后面的路由规则将会被忽略，为了可以访问同一路径的多个路由规则，使用next()实现控制权转移。
}

function checkLogin(req, res, next) {
    if (!req.session.user_sn)//用户不存在
    {   //未登录跳转到登陆界面
        req.flash('error', '未登录！');
        return res.redirect('/login');
    }
    //已登录转移到下一个同一路径请求的路由规则操作
    next();
}

//过滤内容，即不存在图片也不存在文本内容即为false
function filterStr(str) {
    if (str) {
        var _str = str, noHtml, noTrim;
        var imgReg = /<img[^>]*>/gi;
        noHtml = _str.replace(/<\/?[^>]*>/g, '');
        noTrim = noHtml.replace(/\s+/g, "");
        if (noTrim == '' && !imgReg.test(str)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

module.exports = router;
