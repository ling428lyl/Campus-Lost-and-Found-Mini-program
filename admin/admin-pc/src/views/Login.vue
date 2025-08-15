<template>
    <div class="body">
        <!-- <img class="bg" src="../assets/bgp1.jpg" alt=""> -->
        <div class="form">
            <h2>校园失物招领后台管理系统</h2>
            <div class="form-content">
                <div class="left">
                    <img src="../assets/gzhu.png" alt="">
                </div>
                <div class="right">
                    <el-input v-model="username" placeholder="请输入账号"></el-input>
                    <el-input v-model="password" show-password placeholder="请输入密码"></el-input>
                    <el-button type="success" @click="submit">登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: ""
        }
    },
    methods: {
        async submit() {
            const { username, password } = this;
            if (!username || !password) {
                this.$message.error("账号和密码不能为空！");
                return;
            }
            const params = {
                username,
                password
            };
            const res = await this.$http.post("/admin/login", params);
            const { data } = res;
            if (typeof data === 'object') {
                localStorage.setItem("userInfo", JSON.stringify(data));
                this.$message.success("登录成功！");
                this.$router.push("/home");
            } else {
                this.$message.error("账号或密码错误");

            }
        }
    }
}
</script>

<style lang="less" scoped>
.body {
    width: 100vw;
    height: 100vh;
    position: relative;
    background-image: url('../assets/bgp1.jpg');
    background-repeat: no-repeat;
    background-size: 100%;
    .bg {
        width: 100vw;
        height: 100vh;
        // z-index: 10;
    }

    .form {
        position: absolute;
        z-index: 11;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #00561a89;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 550px;
        height: 320px;
        border-radius: 30px;

        .form-content {
            margin-top: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }

        h2 {
            margin-top: 40px;
            margin-bottom: 20px;
            color: whitesmoke;
        }

        .left {

            width: 50%;
            // border-right:3px solid #dddddd ;
            img {
                margin-left: 50%;
                // margin-top: 50%;
                transform: translateX(-50%);
                // transform: translateY(-50%);
                width: 150px;
                height: 150px;
                align-items: center;
            justify-content: center;
            }
        }

        .right {
            // margin: auto;
            // margin-left: 50%;
            // transform: translateX(-50%);
            align-items: center;
            justify-content: center;
            width: 50%;
        }

        .el-input {
            width: 85%;
            margin-bottom: 20px;
        }

        .el-button {
            width: 100px;
            margin-left: 25%;
        }
    }
}</style>