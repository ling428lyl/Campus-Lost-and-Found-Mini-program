<template>
    <div class="body">
        <h2>管理员管理</h2>
        <div class="top">

            <el-input placeholder="请输入用户名搜索用户" prefix-icon="el-icon-search" v-model="search" @change="toSearch">
            </el-input>
            <el-button @click="dialogVisible = true, title = '新增管理员'">新增</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="username" label="账号" sortable>
            </el-table-column>
            <el-table-column prop="password" label="用户密码">
            </el-table-column>
            <el-table-column prop="nickname" label="用户名" sortable>
            </el-table-column>
            <el-table-column prop="role" label="权限" sortable>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="160" sortable></el-table-column>

            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="editItem(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteConfirm(scope.row._id)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="page" :page-sizes="[3, 5, 10, 15, 20]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @close="handleClose">
            <div class="dialog-style">
                <div class="input-area">
                    <div>账号：</div>
                    <el-input v-model="username" placeholder="请输入用户名"></el-input>
                </div>
                <div class="input-area">
                    <div>密码：</div>
                    <el-input v-model="password" placeholder="请输入密码"></el-input>
                </div>
                <div class="input-area">
                    <div>昵称：</div>
                    <el-input v-model="nickname" placeholder="请输入昵称"></el-input>
                </div>
            </div>

            <el-radio-group v-model="role">
                <el-radio :label="0">超级管理员</el-radio>
                <el-radio :label="1">管理员</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAdmin">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import { debounce } from 'lodash'

export default {
    data() {
        return {
            tableData: [],
            page: 1,
            pageSize: 5,
            total: 0,
            search: '',
            dialogVisible: false,
            username: '',
            password: '',
            nickname: '',
            role: 0,
            _id: '',
            title: '新增管理员'
        }
    },

    async created() {
        this.getTableData()
    },

    methods: {
        //获取表格数据
        async getTableData(search, _id) {
            let params = {}
            if (search) {
                params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    search
                }
            } else {
                params = {
                    page: this.page,
                    pageSize: this.pageSize
                }
            }
            const { data: { result, total } } = await this.$http.post("/admin/getAdmin", params);
            this.tableData = result.map(item => {
                if (_id && item._id === _id) {
                    localStorage.setItem("userInfo", JSON.stringify(item));
                    window.location.reload();
                }
                return {
                    ...item,
                    create_time: dayjs(item.time).format("YYYY-MM-DD HH:mm:ss"),
                    role: item.role === 0 ? '超级管理员' : '管理员'
                }
            });
            this.total = total;
        },

        //页面大小变化
        handleSizeChange(val) {
            this.pageSize = val;
            this.getTableData();

        },

        //当前页面变化
        handleCurrentChange(val) {
            this.page = val;
            this.getTableData();
        },

        //确认删除
        deleteConfirm(_id) {
            this.$confirm('是否确定删除本行数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',

            }, console.log('aa')).then(async () => {
                const params = {
                    _id,
                    username: JSON.parse(localStorage.getItem('userInfo')).username
                }; console.log('cc')
                const { data } = await this.$http.post("/admin/deleteAdmin", params);

                if (data === "success") {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getTableData();
                } else if (data === 'noPower') {
                    this.$message({
                        type: 'error',
                        message: '没有权限!'
                    });
                }
                else {
                    this.$message({
                        type: 'error',
                        message: '删除失败!'
                    });
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                }); console.log('bb')
            });
        },

        //搜索防抖
        toSearch() {
            let _toSearch = debounce(() => this.getTableData(this.search), 1000);
            _toSearch();

        },

        //新增管理员
        async addAdmin() {
            this.title = '新增管理员'
            const { username, password, role, nickname, _id } = this;
            if (!username || !password || !nickname) {
                this.$message.error("未填写必填项！");
                return;
            }
            if(password.length<6){
                this.$message.error("密码长度不可小于6！");
                return;
            }
            const params = {
                username,
                password,
                role,
                nickname,
                _id
            };
            const { data } = await axios.post("/admin/addAdmin", params);
            if (data === "success") {
                this.$message.success(_id ? "编辑成功!" : "新增成功!");
                this.dialogVisible = false;
                this.search='';

                if (_id === JSON.parse(localStorage.getItem("userInfo"))._id) {//改自己的数据
                    this.getTableData("", _id)
                } else {
                    this.getTableData();
                }
                this.username = "";
                this.password = "";
                this.nickname = "";
                this._id = "";

            } else {
                this.$message.error(_id ? "编辑失败！" : "新增失败！");
            }
        },

        //编辑
        editItem(item) {
            this.title = '编辑管理员信息';
            const { username, password, nickname, role, _id } = item;
            this.username = username;
            this.password = password;
            this.role = role === "超级管理员" ? 0 : 1;
            this.nickname = nickname;
            this._id = _id;
            this.dialogVisible = true;
        },

        //关闭
        handleClose() {
            this._id = "";
            this.username = "";
            this.password = "";
            this.nickname = "";
        }
    },
}
</script>

<style lang="less" scoped>
.body {
    padding: 20px;
    border-radius: 15px;
    background-color: #fff;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    .pagination {
        margin-top: 20px;
    }

    h2 {
        margin-bottom: 20px;
    }

    .dialog-style{
        display: flex;
        flex-direction: column;
        justify-content: center;
        .input-area {
        display: flex;
        justify-content: center;
        align-items: center;

        // div {
        //     display: flex;
        //     justify-content: right;
        // }
    }
    }

    .el-input {
        width: 250px;
        margin-bottom: 20px;

        .el-input__prefix {
            height: auto;
        }
    }

    .top .el-button {
        margin-left: 40px;
    }
}
</style>