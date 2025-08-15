const mongoose = require('mongoose');
const { stringify } = require('uuid');

//连接数据库
mongoose.connect("mongodb://localhost:27017/lostMg")
    .then(() => {
        console.log("数据库连接成功");
    })
    .catch((err) => {
        console.log("数据库连接失败", err);
    })

//丢失物品表
const LostSchema = new mongoose.Schema({
    type: {
        type: Number,
    },
    classify1: {
        type: String,
    },
    classify2: {
        type: String,
    },
    name: {
        type: String,
    },
    date: {
        type: String,
    },
    region: {
        type: String,
    },
    phone: {
        type: String,
    },
    description: {
        type: String,
        default: ''
    },
    imgList: {
        type: Array,
        default: []
    },
    time: {
        type: Number,
    },
    openid: {
        type: String
    },
    commentList: {
        type: Array,
        default: []
    }
})//数据库会生成_id


//收藏物品表
const CollectSchema = new mongoose.Schema({//只需要知道 是谁收藏了这个物品
    openid: {//所有用户的唯一凭证，是谁收藏
        type: String
    },

    id: {//把_id放过来,映射Lost表的_id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lost'
    },

})


//用户信息表
const UserSchema = new mongoose.Schema({
    openid: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    date: {
        type: Number
    },
    // avatarUrl:{
    //     type:String,
    //     default:''
    // },
    // nickName:{
    //     type:String,
    //     default:''
    // }
})


//管理员账号
const AdminSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    create_time: {
        type: Number
    },
    role: {
        type: Number//0：超管 1：普通管理员
    },
    nickname: {
        type: String
    }
})


//微信用户信息
const WXUserSchema = new mongoose.Schema({
    openid: {
        type: String
    },
    nickName: {
        type: String
    },
    avatarUrl: {
        type: String
    }
})


//分类表
const ClassifySchema = new mongoose.Schema({
    classify1: {
        type: Array,
        default:[]
    },
    classify2: {
        type: Array,
        default:[]
    },

})


//分类表
const CategorySchema = new mongoose.Schema({
    classify1: {
        type:String
    },
    classify2_text: {
        type: String
    },
    // classify2_url: {
    //     type: String
    // },


})


//建立表结构
const Lost = mongoose.model("Lost", LostSchema);
const Collect = mongoose.model("Collect", CollectSchema);
const User = mongoose.model("User", UserSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const WXUser = mongoose.model("WXUser", WXUserSchema);
const Classify=mongoose.model("Classify",ClassifySchema);
const Category=mongoose.model("Category",CategorySchema);

// Category.create(
    
//     {
//         classify1:"卡片、证件",
//         classify2_text: "身份证",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"卡片、证件",
//         classify2_text: "校园卡",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"卡片、证件",
//         classify2_text: "公交卡",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"卡片、证件",
//         classify2_text: "银行卡",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"卡片、证件",
//         classify2_text: "其他",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"生活用品",
//         classify2_text: "雨伞",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"生活用品",
//         classify2_text: "风扇",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"数码产品",
//         classify2_text: "手机",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"数码产品",
//         classify2_text: "相机",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"数码产品",
//         classify2_text: "耳机",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"数码产品",
//         classify2_text: "充电宝",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"数码产品",
//         classify2_text: "平板",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"美妆护肤",
//         classify2_text: "口红",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"美妆护肤",
//         classify2_text: "粉底",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"美妆护肤",
//         classify2_text: "眉笔",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"饰品",
//         classify2_text: "项链",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"饰品",
//         classify2_text: "手链",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"饰品",
//         classify2_text: "戒指",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"饰品",
//         classify2_text: "耳饰",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"饰品",
//         classify2_text: "眼镜",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"衣物",
//         classify2_text: "男装",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"衣物",
//         classify2_text: "女装",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"衣物",
//         classify2_text: "包包",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"其他",
//         classify2_text: "零食",
//         classify2_url:"../../images/collect_fill.png",
//     },
//     {
//         classify1:"其他",
//         classify2_text: "药品",
//         classify2_url:"../../images/collect_fill.png",
//     }
// )


//导出
module.exports = {
    Lost,
    Collect,
    User,
    Admin,
    WXUser,
    Classify,
    Category
}