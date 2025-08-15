<template>
    <div>
        <el-container>
            <el-header>
                <h2>失物招领后台管理系统</h2>
                <div class="info">
                    <p>{{ role }}{{ nickname }}你好！</p>
                    <el-button @click="quit">退出</el-button>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu :default-active="currentPath" class="el-menu-vertical-demo" @select="handleSelect">
                        <el-menu-item index="/found">
                            <i class="el-icon-tickets"></i>
                            <span slot="title">招领管理</span>
                        </el-menu-item>
                        <el-menu-item index="/lost">
                            <i class="el-icon-document"></i>
                            <span slot="title">寻物管理</span>
                        </el-menu-item>
                        <el-menu-item index="/user">
                            <i class="el-icon-user-solid"></i>
                            <span slot="title">用户管理</span>
                        </el-menu-item>
                        <el-menu-item index="/classify">
                            <i class="el-icon-menu"></i>
                            <span slot="title">分类管理</span>
                        </el-menu-item>
                        <el-menu-item index="/admin">
                            <i class="el-icon-s-custom"></i>
                            <span slot="title">管理员管理</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            role: '',
            nickname: '',
            currentPath: ''
        }
    },
    created() {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { role, nickname } = JSON.parse(userInfo);
            this.role = role === 0 ? '超级管理员' : '管理员';
            this.nickname = nickname
        } else {
            this.$router.push('/login')
        }
        const { path } = this.$route;
        this.currentPath = path;
    },
    methods: {
        quit() {
            localStorage.removeItem('userInfo');
            this.$router.push('/login')
        },

        async handleSelect(path) {
            if (path === '/admin') {
                const params = {
                    username: JSON.parse(localStorage.getItem('userInfo')).username
                };
                const { data } = await axios.post("/admin/getPower", params);
                if (data) {
                    if (path !== this.currentPath) {
                        this.$router.push(path);
                        this.currentPath = path;
                    }
                } else if (!data) {
                    this.$message.error("没有查看权限！")
                } else {
                    this.$message.error("出错了！")
                }

            }
            else {
                if (path !== this.currentPath) {
                    this.$router.push(path);
                    this.currentPath = path;
                }
            }

        }
    }
}
</script>

<style lang="less" scoped>
.el-header {
    background-color: #8fb2c9;
    color: #fff;
    text-align: center;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .info {
        display: flex;
        align-items: center;

        .el-button {
            margin-left: 20px;
            align-items: center;
        }
    }
}

.el-aside {
    // background-color: #baccd9 ;
    // color: #fff;
    text-align: center;
    height: calc(100vh - 60px); //动态
}

.el-main {
    background-color: #d0dfe6;
    color: #333;
    text-align: center;
    height: calc(100vh - 60px); //动态
}

.el-menu-vertical-demo {
    height: 100%;
}
</style>