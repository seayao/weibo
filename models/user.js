/**
 * Created by Administrator on 2017/5/22.
 */
var mongodb = require('./db');//加载数据库模块

//User构造函数，用于创建对象
function User(user) {
    this.useraccount = user.useraccount;
    this.usernick = user.usernick;
    this.password = user.password;
    this.head = user.head;
    this.gender = user.gender;
}
//输出User对象
module.exports = User;

//User对象方法：把用户信息存入Mongodb
User.prototype.save = function save(callback) {
    var user = {//用户信息
        useraccount: this.useraccount,
        usernick: this.usernick,
        password: this.password,
        head: this.head,
        gender: this.gender
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
            // 为name属性添加索引
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
User.get = function get(useraccount, callback) {
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
            //从users集合中查找name属性为username的记录
            collection.findOne({useraccount: useraccount}, function (err, doc) {
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

//User对象方法：更新/编辑用户信息
User.update = function update(useraccount, usernick, password, head, callback) {
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
            collection.update({useraccount: useraccount},
                {
                    $set: {usernick: usernick, password: password, head: head}
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