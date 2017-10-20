/**
 * Created by Administrator on 2017/5/22.
 */
//获取微博和保存微博
var mongodb = require('./db');
//Post构造函数，用于创建对象
function Post(post) {
    this.article_id = post.article_id;//文章唯一id
    this.author = post.author;//作者信息，对象
    this.title = post.title;//文章标题
    this.detail = post.detail;//文章内容
    this.cover = post.cover;//文章封面图
    this.topics = post.topics;//话题归类，数组
    this.url = post.url;//文章url地址，作为分享等使用
    this.isTop = post.isTop;//是否置顶
    this.canComment = post.canComment;//是否可以评论，对象
    this.visitCount = post.visitCount;//浏览数量
    this.followerCount = post.followerCount;//关注数量
    this.answerCount = post.answerCount;//回答数量
    this.praiseCount = post.praiseCount;//点赞数量
    this.commentCount = post.commentCount;//评论数量
    this.isReportedCount = post.isReportedCount;//被举报数量
    this.reportUser = post.reportUser;//举报用户，数组
    this.isMutedCount = post.isMutedCount;//被屏蔽数量
    this.muteUser = post.muteUser;//屏蔽用户，数组
    this.article_type = post.article_type;//文章类型
    this.article_status = post.article_status;//文章状态，对象
    var now = new Date();
    var currTime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes() + ':' + (now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()));
    this.created = post.created || currTime;//发布时间
    this.updated_time = post.updated_time || currTime;//更新时间
}
//输出Post对象
module.exports = Post;

//对象方法：保存新发布的微博到数据库
Post.prototype.save = function save(callback) {
    //存入MongoDB数据库
    var postInfo = {//发布文章的信息
        article_id: this.article_id,
        author: this.author,
        title: this.title,
        detail: this.detail,
        cover: this.cover,
        topics: this.topics,
        url: this.url,
        isTop: this.isTop,
        canComment: this.canComment,
        visitCount: this.visitCount,
        followerCount: this.followerCount,
        answerCount: this.answerCount,
        praiseCount: this.praiseCount,
        commentCount: this.commentCount,
        isReportedCount: this.isReportedCount,
        reportUser: this.reportUser,
        isMutedCount: this.isMutedCount,
        muteUser: this.muteUser,
        article_type: this.article_type,
        article_status: this.article_status,
        created: this.created,
        updated_time: this.updated_time
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
            //为文章id属性添加索引，待处理
            //collection.ensureIndex('useraccount');

            //把发布的微博信息post写入posts表中
            collection.insert(postInfo, {safe: true}, function (err, post) {
                mongodb.close();
                callback(err, post);
            });
        });
    });
};

//获取全部或指定用户的微博记录，account后续可改为user_id，待处理
Post.get = function get(account, callback) {
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
            //查找account属性为account的微博记录，如果account为null则查找全部记录
            var query = {};
            if (account) {
                query.account = account;
            }
            //查找符合条件的记录，并按创建时间created顺序排列
            collection.find(query).sort({created: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                }
                //定义所有文章数组
                var posts = [];
                //遍历查询结果
                docs.forEach(function (item, index) {
                    //把结果封装成Post对象
                    var post = new Post(item);
                    //把全部结果封装成数组
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
    });
};