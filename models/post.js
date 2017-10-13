/**
 * Created by Administrator on 2017/5/22.
 */
//获取微博和保存微博
var mongodb = require('./db');
//Post构造函数，用于创建对象
function Post(useraccount, usernick, head, title, content, cover, time) {
    this.useraccount = useraccount;//用户账号
    this.usernick = usernick;//用户昵称
    this.head = head;//用户头像
    this.title = title;//发布标题
    this.content = content;//发布内容
    this.cover = cover;//封面图片
    if (time) {
        this.time = time;//发布时间
    }
    else {
        var now = new Date();
        this.time = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + " " + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes() + ":" + (now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()));
    }
}
//输出Post对象
module.exports = Post;

//对象方法：保存新发布的微博到数据库
Post.prototype.save = function save(callback) {
    //存入MongoDB数据库
    var postInfo = {//发布的基本信息
        useraccount: this.useraccount,
        usernick: this.usernick,
        head: this.head,
        title: this.title,
        content: this.content,
        cover: this.cover,
        time: this.time
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts集合，即数据库表
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //为useraccount属性添加索引
            collection.ensureIndex('useraccount');
            //把发布的微博信息post写入posts表中
            collection.insert(postInfo, {safe: true}, function (err, post) {
                mongodb.close();
                callback(err, post);
            });
        });
    });
};

//获取全部或指定用户的微博记录
Post.get = function get(useraccount, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取posts集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //查找useraccount属性为useraccount的微博记录，如果useraccount为null则查找全部记录
            var query = {};
            if (useraccount) {
                query.useraccount = useraccount;
            }
            //查找符合条件的记录，并按时间顺序排列
            collection.find(query).sort({time: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                }
                var posts = [];
                //遍历查询结果
                docs.forEach(function (doc, index) {
                    //把结果封装成Post对象
                    var post = new Post(doc.useraccount, doc.usernick, doc.head, doc.title, doc.content, doc.cover, doc.time);
                    //把全部结果封装成数组
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
    });
};