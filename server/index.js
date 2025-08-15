const express = require('express');
const app = express();
const { Lost, Collect, User, Admin, WXUser, Classify, Category } = require('./db');//导入数据表
const multer = require('multer');//node.js 中间件,用于上传文件
const { v4 } = require('uuid');//是一个用于创建 RFC4122 通用唯一标识符的库。
const { default: axios } = require('axios');//基于 promise 的网络请求库，可以用于浏览器和 node.js
const { Collection } = require('mongoose');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));//允许客户端访问

app.all("*", (req, res, next) => {//跨域
    res.setHeader("Access-Control-Allow-Origin", '*');//在服务器响应客户端的时候，带上Access-Control-Allow-Origin头信息
    res.setHeader("Access-Control-Allow-Headers", '*');//跨域允许包含的头
    next();
})



const storage = multer.diskStorage({//文件上传配置
    destination: (req, file, cb) => {
        cb(null, "./file")
    },
    filename: (req, file, cb) => {
        let type = file.originalname.replace(/.+\./, ".");
        cb(null, `${v4()}${type}`)
    }
})

const upload = multer({ storage });//文件上传配置实例化



// 文件上传接口
app.post("/uploadImg", upload.array("file", 6), (req, res) => {
    res.send(req.files);
})


// 发布内容接口
app.post("/publish", async (req, res) => {
    //将前端传过来的东西存入Lost数据表
    try {
        const { type, classify1, classify2, name, date, region, phone, description, imgList, time, openid } = req.body;//传
        await Lost.create({
            type, classify1, classify2, name, date, region, phone, description, imgList, time, openid  //存
        });
        res.send("success")
    } catch (error) {
        console.log(error)
        res.send("error")
    }

})

//获取首页数据
app.get("/getLost", async (req, res) => {
    const { type } = req.query;
    const result = await Lost.find({//筛选
        type
    }).sort({ time: -1 })//1是升序-1是降序
    res.send(result)
})

//收藏物品
app.post("/toCollect", async (req, res) => {
    try {
        const { id, openid } = req.body;//传
        await Collect.create({
            id, openid  //存
        });
        res.send("success")
    } catch (error) {
        res.send("error")
    }
})

//实现登录操作
app.get("/login", async (req, res) => {
    const { code } = req.query;
    try {
        const { data: { openid } } = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx76581a51a1ec7dec&secret=2e69675b890f5506cdf6614bc9c729b8&js_code=${code}&grant_type=authorization_code`);

        res.send(openid)
    } catch (error) {
        res.send("error")
    }

})


//获取分类信息
app.get("/getClassify", async (req, res) => {
    // const{classify1}=req.query;
    // const result = await Classify.find()
    
    const result = await Category.find().sort({'classify1':-1});
    res.send(result)
})

//微信用户登录信息
app.post("/addWXUserInfo", async (req, res) => {
    const { openid, avatarUrl, nickName } = req.body;
    const result = await WXUser.findOne({
        openid
    });
    if (result) {
        res.send("added")
        // console.log("11")
    } else {
        await WXUser.create({
            openid, avatarUrl, nickName
        });
        res.send("success")
        // console.log("1werw1")
    }
})

//查询当前物品有没有被当前用户收藏过
app.post("/checkCollect", async (req, res) => {
    const { id, openid } = req.body;
    const result = await Collect.find({
        id,
        openid
    });
    res.send(result);
})


//取消收藏
app.post("/cancelCollect", async (req, res) => {
    try {
        const { id, openid } = req.body;
        await Collect.findOneAndRemove({
            id, openid
        });
        res.send("success")
    } catch (error) {
        res.send("error");
    }
})


//获取收藏夹的数据
app.post("/getCollection", async (req, res) => {
    // try {
    const { openid, type } = req.body;
    let result = await Collect.find({
        openid
    }).populate('id');//id和Lost关联，联合查询Lost表
    const _result = result.filter(item => item.id.type === type);
    // result=await Lost.find({
    //     type
    // })
    // res.send(result);
    // console.log(result)
    res.send(_result);
    console.log(_result)
    // console.log(openid)
    // console.log(req.body)
    // } catch (error) {
    // res.send("error");
    // console.log(result)
    // }
})


//获取我的发布的数据
app.get("/getMyPublish", async (req, res) => {
    const { openid, type } = req.query;
    const result = await Lost.find({
        openid,
        type
    });
    res.send(result);
})

//通过二级分类查数据
app.post("/getClassifyTwo", async (req, res) => {
    const { type, classify2 } = req.body;
    const result = await Lost.find({
        type,
        classify2
    });
    res.send(result);
})

//模糊查询物品名字
app.get("/searchLost", async (req, res) => {
    const { name } = req.query;
    const _name = new RegExp(name, 'i');
    const result = await Lost.find({
        name: _name
    });
    res.send(result);
})

//搜索结果二级页面
app.post("/searchLog", async (req, res) => {
    const { name, type } = req.body;
    const _name = new RegExp(name, 'i');
    const result = await Lost.find({
        name: _name,
        type
    });
    res.send(result);
})

//注册
app.post("/register", async (req, res) => {
    const { openid, username, password, date, avatarUrl, nickName } = req.body;
    const result = await User.findOne({
        username
    });
    const check = await User.findOne({
        openid
    });
    if(check){
        res.send("only")
    }
    if (result) {
        res.send("registered")
    } 
    if(!check&&!result) {
        await User.create({
            openid, username, password, date, avatarUrl, nickName
        });
        res.send("success")
    }
})

//小程序端删除寻物、寻主数据
app.post("/deleteLost", async (req, res) => {
    const { _id } = req.body;
    try {
        await Lost.findByIdAndRemove(_id);
        await Collect.findOneAndRemove({
            id: _id
        });
        res.send("success")
    } catch (error) {
        res.send("error")
    }
})


//查询物品详情数据
app.post("/getDetail", async (req, res) => {
    const { _id } = req.body;
    try {
        const result = await Lost.findById(_id);
        res.send(result);
    } catch (error) {
        res.send("error")
    }
})

//查询物品发布者信息
app.post("/getUserInfo", async (req, res) => {
    const { openid } = req.body;
    try {
        const result = await WXUser.findOne({ openid });
        res.send(result);
    } catch (error) {
        res.send("error")
        console.log(error)
    }
})

//查询账号
app.post("/getAccount",async(req,res)=>{
    const { openid } = req.body;
    try {
        const result = await User.findOne({ openid });
        res.send(result);
    } catch (error) {
        res.send("error")
        console.log(error)
    }
})


//小程序端修改寻物寻主信息
app.post("/updateLost", async (req, res) => {
    const { type, classify1, classify2, name, date, region, phone, description, imgList, time, openid, id } = req.body;//传
    try {
        await Lost.findByIdAndUpdate(id, { type, classify1, classify2, name, date, region, phone, description, imgList, time, openid });
        res.send("success")
    } catch (error) {
        res.send("error")
    }
})

//实现登录操作
app.post("/toLogin", async (req, res) => {
    const { username, password } = req.body;
    const result = await User.findOne({
        username
    });
    if (result) {
        if (result.password === password) {
            res.send("success")
        } else {
            res.send("PwdError")
        }
    } else {
        res.send("error")
    }


})


//新增评论
app.post("/addComment", async (req, res) => {
    const { avatarUrl, nickName, content, time, _id,openid } = req.body;
    try {
        let { commentList } = await Lost.findById(_id);
        commentList.unshift({
            avatarUrl, nickName, content, time,openid
        })
        await Lost.findByIdAndUpdate(_id, {
            commentList
        })
        const result = await Lost.findById(_id);//根据id再查一次更新后的数据然后返回给前端
        res.send({
            status: "success",
            data: result
        })
    } catch (error) {
        res.send({
            status: "error",
            data: error
        })
        console.log(error)
    }

})


//删除评论
app.post("/deleteComment", async (req, res) => {
    const { index, _id } = req.body;
    try {
        let { commentList } = await Lost.findById(_id);
        commentList.splice(index, 1) 
        await Lost.findByIdAndUpdate(_id, {
            commentList
        })
        const result = await Lost.findById(_id);//根据id再查一次更新后的数据然后返回给前端
        res.send({
            status: "success",
            data: result
        })
    } catch (error) {
        res.send({
            status: "error",
            data: error
        })
        console.log(error)
    }

})



//管理员登录
app.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const result = await Admin.findOne({
        username
    });
    if (result && result.password === password) {
        res.send(result);
    } else {
        res.send("error");
    }
})

//寻主/寻物数据
app.post("/admin/getLost", async (req, res) => {
    try {
        const { type, page, pageSize, search } = req.body;
        if (search) {
            const name = new RegExp(search, 'i')
            const result = await Lost.find({ name, type })
                .skip((page - 1) * pageSize).limit(pageSize);
            const total = await Lost.find({ name, type }).countDocuments();
            res.send({
                result,
                total
            })
        }
        else {
            const result = await Lost.find({
                type
            }).skip((page - 1) * pageSize).limit(pageSize);
            const total = await Lost.find({
                type
            }).countDocuments();
            res.send({
                result,
                total
            })
        }
    } catch (error) {
        res.send("error")
    }
})


//删除寻物、寻主数据
app.post("/admin/delete", async (req, res) => {
    const { _id } = req.body;
    try {
        await Lost.findByIdAndRemove(_id);
        res.send("success")
    } catch (error) {
        res.send("error")
    }
})


//用户数据
app.post("/admin/getUser", async (req, res) => {
    const { page, pageSize, search } = req.body;
    try {
        if (search) {
            const username = new RegExp(search, 'i')
            const result = await User.find({ username })
                .skip((page - 1) * pageSize).limit(pageSize);
            const total = await User.find({ username }).countDocuments();
            res.send({
                result,
                total
            })
        } else {
            const result = await User.find()
                .skip((page - 1) * pageSize).limit(pageSize);
            const total = await User.find().countDocuments();
            res.send({
                result,
                total
            })
        }
    } catch (error) {
        res.send("error")
    }
})

//删除用户
app.post("/admin/deleteUser", async (req, res) => {
    const { _id } = req.body;
    try {
        await User.findByIdAndRemove(_id);
        res.send("success")
    } catch (error) {
        res.send("error")
    }
})

//管理员信息
app.post("/admin/getAdmin", async (req, res) => {
    const { page, pageSize, search } = req.body;
    try {
        if (search) {
            const username = new RegExp(search, 'i')
            const result = await Admin.find({ username })
                .skip((page - 1) * pageSize).limit(pageSize);
            const total = await Admin.find({ username }).countDocuments();
            res.send({
                result,
                total
            })
        } else {
            const result = await Admin.find()
                .skip((page - 1) * pageSize).limit(pageSize);
            const total = await Admin.find().countDocuments();
            res.send({
                result,
                total
            })
        }
    } catch (error) {
        res.send("error")
    }
})


//删除管理员
app.post("/admin/deleteAdmin", async (req, res) => {
    const { _id, username } = req.body;
    try {
        const { role } = await Admin.findOne({
            username
        })
        if (role === 1) {
            res.send("noPower")
        } else {
            await Admin.findByIdAndRemove(_id);
            res.send("success")
        }
    } catch (error) {
        res.send("error")
    }
})


//新增管理员
app.post("/admin/addAdmin", async (req, res) => {
    const { username, password, nickname, role, _id } = req.body;
    try {
        if (_id) {//编辑
            await Admin.findByIdAndUpdate(_id, {
                username,password,role,nickname
            });
            res.send("success");
        } else {
            await Admin.create({
                username,password,role,nickname,create_time: new Date().getTime()
            });
            res.send("success");
        }

    } catch (error) {
        res.send("error")
    }
})


//查询当前管理员权限
app.post("/admin/getPower", async (req, res) => {
    const { username } = req.body;
    try {
        const { role } = await Admin.findOne({
            username
        });
        if (role === 0) {
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (error) {
        res.send('error')
    }
})


//分类管理
// app.post("/admin/getClassify", async (req, res) => {
//     try {
//         // Category.collation({"locale": "zh", numericOrdering:true}).sort({name:1});
//         const { search } = req.body;
//         console.log(search)
//         if (search) {
//             const name = new RegExp(search, 'i')
//             console.log(name)
//             // db.product.find({"parameSet":{"$elemMatch":{"564c408fe4b005ef3b0c1a69":"KFFF"}}})
//             const result = await Classify.find({ 'classify1': { name } });
//             console.log(result)
//             res.send(result)
//         }
//         else {
//             const result = await Classify.find();
//             res.send(result)
//         }

//         // console.log(result, total)
//     } catch (error) {
//         res.send("error")
//     }
// })


//分类管理
app.post("/admin/getCategory", async (req, res) => {
    try {
        const { search, search2, page, pageSize } = req.body;
        if (search && !search2) {
            const classify1 = new RegExp(search, 'i')
           
            const result = await Category.find({ classify1 }).skip((page - 1) * pageSize).limit(pageSize);
            const total = await Category.find({ classify1 }).countDocuments();
            // console.log(result)
            res.send({
                result,
                total
            })
        }
        if (search2 && !search) {
            const classify2_text = new RegExp(search2, 'i')
            console.log(classify2_text)
            // db.product.find({"parameSet":{"$elemMatch":{"564c408fe4b005ef3b0c1a69":"KFFF"}}})
            const result = await Category.find({ classify2_text }).skip((page - 1) * pageSize).limit(pageSize);
            const total = await Category.find({ classify2_text }).countDocuments();
            // console.log(result)
            res.send({
                result,
                total
            })
        }
        if (search2 && search) {
            const classify1 = new RegExp(search, 'i')
            console.log(search)
            const classify2_text = new RegExp(search2, 'i')
            console.log(search2)
            // console.log(classify1)
            // db.product.find({"parameSet":{"$elemMatch":{"564c408fe4b005ef3b0c1a69":"KFFF"}}})
            const result = await Category.find({ classify1, classify2_text }).skip((page - 1) * pageSize).limit(pageSize);
            const total = await Category.find({ classify1, classify2_text }).countDocuments();
            // console.log(result)
            res.send({
                result,
                total
            })
        }
        if (!search && !search2) {
            const result = await Category.find().skip((page - 1) * pageSize).limit(pageSize);
            const total = await Category.find().countDocuments();
            res.send({
                result,
                total
            })
        }
    } catch (error) {
        res.send("error")
        console.log(error)
    }
})

//删除分类
app.post("/admin/deleteClassify2", async (req, res) => {
    const { _id } = req.body;
    try {
        await Category.findByIdAndRemove(_id);
        res.send("success")
    } catch (error) {
        res.send("error")
        console.log(error)
    }
})






//新增一级、二级分类/编辑二级分类
app.post("/admin/addClassify", async (req, res) => {
    const { classify2_text, classify1, _id } = req.body;
    const check = await Category.findOne({
        classify2_text
    });
    try {
        if (check) {
            res.send("existed")
        } else {
            console.log(_id)
            if (_id) {//编辑
                await Category.findByIdAndUpdate(_id, {
                    classify2_text
                });
                res.send("success");
            } else {
                await Category.create({
                    classify2_text, classify1
                });
                res.send("success");
            }
        }
    }
     catch (error) {
        res.send("error")
    }
})


//编辑一级分类
app.post("/admin/editClassify1", async (req, res) => {
    const { classify1Ori, classify1 } = req.body;
    let c1o = classify1Ori;//一级分类原始名称
    let c1 = classify1;//一级分类更改后的名称
    try {
        let find = await Category.findOneAndUpdate({ classify1: c1o }, { $set: { classify1: c1 } });
        while (find) {
            find = {};
            find = await Category.findOneAndUpdate({ classify1: c1o }, { $set: { classify1: c1 } });
        }
        res.send("success");
    } 
    catch (error) {
        console.log(error)
        res.send("error")
    }
})


//删除一级分类
app.post("/admin/deleteClassify1", async (req, res) => {
    const { classify1 } = req.body;
    let c1 = classify1;
    try {
        let find = await Category.findOneAndRemove({ classify1: c1 });
        while (find) {
            find = {};
            find = await Category.findOneAndRemove({ classify1: c1 });
        }

        res.send("success");
    } catch (error) {
        console.log(error)
        res.send("error")
    }
})

// // 文件上传接口
// app.post("/admin/classifyUploadImg", upload.array("img", 1), (req, res) => {
//     // res.send(req.files);
//     // 返回图片的地址 
//     // let file = req.files;
//     // console.log(file[0]); 
//     // //====此时，图片已经保存至我们的服务端了====
//     // let fileInfo = {}
//     // // 获取文件基本信息，封装好发送给前端
//     // fileInfo.type = file[0].mimetype;
//     // fileInfo.name = file[0].originalname;
//     // fileInfo.size = file[0].size;
//     // fileInfo.path = '/file' + file[0].filename;
//     // res.send({
//     //     code: 0, 
//     //     value: "图片上传成功",
//     //     data: fileInfo
//     // })

//     const file=req.file
//     file.url=`http://localhost:8080/file/${file.filename}`//通过文件的url显示图片
//     res.send(file)
// })


app.listen(8000, () => {
    console.log('server running!')
})

