<template>
    <div class="body">
        <h2>用户管理</h2>
        <div class="top">

            <el-input placeholder="请输入用户名" prefix-icon="el-icon-search" v-model="search" @change="toSearch">
            </el-input>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="openid" label="OpenId">
            </el-table-column>
            <el-table-column prop="username" label="用户名" sortable>
            </el-table-column>
            <el-table-column prop="password" label="用户密码">
            </el-table-column>

            <el-table-column prop="date" label="注册时间" width="160"></el-table-column>

            <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteConfirm(scope.row._id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="page" :page-sizes="[3, 5, 10, 15, 20]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import { debounce } from 'lodash'

export default {
    data() {
        return {
            tableData: [],
            page: 1,
            pageSize: 5,
            total: 0,
            search: ''
        }
    },

    async created() {
        this.getTableData()
    },

    methods: {
        async getTableData(search) {
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
            const { data: { result, total } } = await this.$http.post("/admin/getUser", params);
            this.tableData = result.map(item => {
                return {
                    ...item,
                    date: dayjs(item.time).format("YYYY-MM-DD HH:mm:ss")
                }
            });
            this.total = total;
        },

        handleSizeChange(val) {
            this.pageSize = val;
            this.getTableData();

        },

        handleCurrentChange(val) {
            this.page = val;
            this.getTableData();
        },

        deleteConfirm(_id) {
            this.$confirm('是否确定删除本行数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const params = {
                    _id
                };
                const { data } = await this.$http.post("/admin/deleteUser", params);
                if (data === "success") {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getTableData();
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除失败!'
                    });
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        toSearch() {
            let _toSearch = debounce(() => this.getTableData(this.search), 1000);
            _toSearch();

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

    .el-input {
        width: 300px;
        margin-bottom: 20px;

        .el-input__prefix {
            height: auto;
        }
    }
}
</style>