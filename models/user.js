/**
 * Created by Administrator on 2017/5/22.
 */
var mongodb = require('./db');//加载数据库模块

//User构造函数，用于创建对象
function User(user) {
    this.user_id = user.user_id;//用户唯一id
    this.account = user.account;//登录账号
    this.nickname = user.nickname;//昵称
    this.password = user.password;//登录密码
    this.url = user.url;//用户url地址，作为分享等使用
    this.cover = user.cover;//用户主页封面图
    this.avatar = user.avatar;//用户头像
    this.gender = user.gender;//性别
    this.headline = user.headline;//签名或一句话描述自己
    this.labels = user.labels;//用户标签，数组
    this.address = user.address;//地址
    this.describe = user.describe;//简介
    this.birthday = user.birthday;//生日
    this.profession = user.profession;//职业
    this.profession_exp = user.profession_exp;//职业经历，对象
    this.education_exp = user.education_exp;//教育经历，对象
    this.contacts = user.contacts;//联系方式，对象
    this.fansCount = user.fansCount;//粉丝数量
    this.followerCount = user.followerCount;//关注数量
    this.visitCount = user.visitCount;//访问数量
    this.isReportedCount = user.isReportedCount;//举报数量（被别人举报）
    this.reportUser = user.reportUser;//举报用户（我举报的用户），数组
    this.isMutedCount = user.isMutedCount;//屏蔽数量（被别人屏蔽）
    this.muteUser = user.muteUser;//屏蔽用户（我屏蔽的用户），数组
    this.disabled = user.disabled;//是否被禁用（类似封号）
    this.expire_time = user.expire_time;//禁用到期时间（封号到期时间）
    var now = new Date();
    var currTime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes() + ':' + (now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()));
    this.created = user.created || currTime;//注册时间
    this.updated_time = user.updated_time || currTime;//更新时间
}
//输出User对象
module.exports = User;

//User对象方法：把用户信息存入Mongodb
User.prototype.save = function save(callback) {
    var user = {//用户信息
        user_id: this.user_id,
        account: this.account,
        nickname: this.nickname,
        password: this.password,
        url: this.url,
        cover: this.cover,
        avatar: this.avatar,
        gender: this.gender,
        headline: this.headline,
        labels: this.labels,
        address: this.address,
        describe: this.describe,
        birthday: this.birthday,
        profession: this.profession,
        profession_exp: this.profession_exp,
        education_exp: this.education_exp,
        contacts: this.contacts,
        fansCount: this.fansCount,
        followerCount: this.followerCount,
        visitCount: this.visitCount,
        isReportedCount: this.isReportedCount,
        reportUser: this.reportUser,
        isMutedCount: this.isMutedCount,
        muteUser: this.muteUser,
        disabled: this.disabled,
        expire_time: this.expire_time,
        created: this.created,
        updated_time: this.updated_time
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合，users相当于数据库中的表
        db.collection('users', function (err, collection) {//定义集合名称users
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 为用户id属性添加索引，待处理
            // collection.ensureIndex('name', {unique: true});

            //把user对象中的数据，即用户注册信息写入users集合中
            collection.insert(user, {safe: true}, function (err, user) {
                mongodb.close();
                callback(err, user);
            });
        });
    });
};

//User对象方法：从数据库中查找指定用户的信息
User.get = function get(account, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //从users集合中查找account属性为account的记录
            collection.findOne({account: account}, function (err, doc) {
                mongodb.close();
                if (doc) {
                    //封装查询结果为User对象
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};

//User对象方法：从数据库中查找所有用户的信息
User.getAll = function getAll(queryNum, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //从users集合中查找所有用户信息
            collection.find({}).limit(queryNum).sort({created: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                }
                //定义所有用户数组
                var allUsers = [];
                //遍历查询结果
                docs.forEach(function (item, index) {
                    //把结果封装成User对象
                    var userItem = new User(item);
                    //把全部结果封装成数组
                    allUsers.push(userItem);
                });
                callback(null, allUsers);
            });
        });
    });
};

//User对象方法：更新/编辑用户信息
User.update = function update(userObj, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新用户信息
            collection.update({account: userObj.account},
                {
                    $set: {
                        nickname: userObj.nickname,
                        password: userObj.password,
                        cover: userObj.cover,
                        avatar: userObj.avatar,
                        gender: userObj.gender,
                        headline: userObj.headline,
                        labels: userObj.labels,
                        address: userObj.address,
                        describe: userObj.describe,
                        birthday: userObj.birthday,
                        profession: userObj.profession,
                        profession_exp: userObj.profession_exp,
                        education_exp: userObj.eduation_exp,
                        contacts: userObj.contacts,
                        updated_time: userObj.updated_time
                    }
                }, function (err) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null);
                });
        });
    });
};