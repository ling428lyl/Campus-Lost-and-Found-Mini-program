<template>
    <div class="body">
        <h2>寻物管理</h2>
        <el-input placeholder="请输入物品名称搜索" prefix-icon="el-icon-search" v-model="search" @change="toSearch">
        </el-input>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="openid" label="OpenId">
            </el-table-column>
            <el-table-column prop="classify1" label="一级分类" sortable>
            </el-table-column>
            <el-table-column prop="classify2" label="二级分类" sortable>
            </el-table-column>
            <el-table-column prop="name" label="物品名称" sortable>
            </el-table-column>
            <el-table-column prop="date" label="拾物时间" sortable>
            </el-table-column>
            <el-table-column prop="region" label="拾物地点" sortable>
            </el-table-column>
            <el-table-column prop="phone" label="联系方式">
            </el-table-column>
            <el-table-column prop="description" label="描述">
            </el-table-column>
            <el-table-column label="相关图片" width="120">
                <template slot-scope="scope">
                    <el-image style="width: 100px; height: 100px" :src="scope.row.imgList[0]"
                        :preview-src-list="scope.row.imgList">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column prop="time" label="发布时间" width="160" sortable></el-table-column>
            <el-table-column label="操作" width="70">
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
import { debounce } from 'lodash';
import axios from 'axios';

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
            let params={}
            if (search) {
                params = {
                    type: 1,
                    page: this.page,
                    pageSize: this.pageSize,
                    search

                }
            }
            else {
                params = {
                    type: 1,
                    page: this.page,
                    pageSize: this.pageSize,

                }
            }
            const { data: { result, total } } = await this.$http.post("/admin/getLost", params);
            this.tableData = result.map(item => {
                return {
                    ...item,
                    time: dayjs(item.time).format("YYYY-MM-DD HH:mm:ss")
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
                const { data } = await this.$http.post("/admin/delete", params);
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

        },
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