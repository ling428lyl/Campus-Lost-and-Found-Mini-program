<template>
    <div class="body">
        <h2>分类管理</h2>

        <div class="top">
            <el-input placeholder="请输入一级分类名称搜索" prefix-icon="el-icon-search" v-model="search" @change="toSearch">
            </el-input>
            <el-input placeholder="请输入二级分类名称搜索" prefix-icon="el-icon-search" v-model="search2" @change="toSearch">
            </el-input>
            <el-button @click="dialogVisible = true, title = '新增分类', classify1Dis = false;">新增</el-button>
        </div>




        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>

            <el-table-column prop="classify1" label="一级分类" sortable>
                <!-- <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row" :key="index">{{ item }}</div>

                </template> -->
            </el-table-column>
            <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteClassify1Confirm(scope.row.classify1)"></el-button>
                    <el-button type="primary" icon="el-icon-edit" circle
                        @click="beforeEditClassify1(scope.row)"></el-button>
                </template>
            </el-table-column>

            <!-- <el-table-column label="二级分类"> -->
            <el-table-column prop="classify2_text" label="二级分类" sortable>
            </el-table-column>
            <!-- <el-table-column prop="classify2_url" label="二级分类图标url">
            </el-table-column>
            <el-table-column label="二级分类图标" width="120">
                <template slot-scope="scope">
                    <el-image style="width: 100px; height: 100px" :src="scope.row.classify2_url">
                    </el-image>
                </template>
            </el-table-column> -->
            <!-- </el-table-column> -->



            <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteConfirm(scope.row._id)"></el-button>
                    <el-button type="primary" icon="el-icon-edit" circle @click="editItem(scope.row)"></el-button>
                    <!-- <el-button type="success" icon="el-icon-plus" circle @click="deleteConfirm(scope.row._id)"></el-button> -->
                </template>
            </el-table-column>

        </el-table>
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="page" :page-sizes="[3, 5, 10, 15, 20]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>


        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @close="handleClose">
            <div class="inputArea">
                <div>一级分类名称：</div><el-input v-model="classify1" :disabled="classify1Dis" placeholder="请输入一级分类名称"></el-input>
            </div>
            <div class="inputArea">
                <div>二级分类名称：</div><el-input v-model="classify2_text" placeholder="请输入二级分类名称"></el-input>
            </div>
            <!-- <div class="inputArea">
                <div>二级分类图标url：</div><el-input v-model="classify2_url" placeholder="请输入二级分类图标url"></el-input>

            </div> -->
            <!-- <el-upload class="avatar-uploader" action="/admin/classifyUploadImg" :show-file-list="false"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :http-request="uploadHttpRequest" :headers="headers" 
                name="img">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->


            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addClassify">确 定</el-button>
            </span>
        </el-dialog>


        <el-dialog title="编辑一级分类名称" :visible.sync="editClassify1Visible" width="30%" @close="handleClose">
            <div class="inputArea">
                <div>一级分类名称：</div><el-input v-model="classify1" placeholder="请输入一级分类名称"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editClassify1">确 定</el-button>
            </span>
        </el-dialog>

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
            search: '',
            search2: '',
            dialogVisible: false,
            title: '',
            classify1: '',
            classify2_text: '',
            // classify2_url: '',
            classify1Dis: false,
            // imageUrl: '',
            classify1Ori: '',
            editClassify1Visible: false
            // mergeObj: {}, // 用来记录需要合并行的下标
            // mergeArr: ['classify1', 'classify2_text', 'classify_url'] // 表格中的列名
        }
    },

    async created() {
        this.getTableData()
    },

    methods: {
        async getTableData(search, search2) {
            this.tableData = []
            let params = {}
            if (search && !search2) {
                params = {
                    search,
                    page: this.page,
                    pageSize: this.pageSize,
                }

            }
            if (search2 && !search) {
                params = {
                    search2,
                    page: this.page,
                    pageSize: this.pageSize,
                }
                console.log(search2)
            }
            if (search && search2) {
                params = {
                    search2,
                    search,
                    page: this.page,
                    pageSize: this.pageSize,
                }
            }
            if (!search && !search2) {
                params = {
                    page: this.page,
                    pageSize: this.pageSize,
                }
            }
            const { data: { result, total } } = await this.$http.post("/admin/getCategory", params);
            // console.log(data)
            this.tableData = result;
            this.total = total;
            // this.search = '';
            // this.search2 = '';
            // this.getSpanArr(this.tableData);
            //// const [{ classify1 }] = data
            //// const [{ classify2 }] = data
            //// this.tableData.push(classify1);
            //// this.tableData.push(classify2);
            // console.log(this.tableData)
            // console.log(data[0])
            // this.tableData.push(data[0].classify1);
            // this.tableData.push(data[0].classify2)
            // console.log(this.tableData[0])
            // console.log(typeof (this.tableData))
            // if (this.tableData) {
            //     let b = [];
            //     this.tableData[0].forEach(item => {
            //         b.push({ classify1: item })
            //     })


            //     this.tableData[1].forEach((item, index) => {
            //         b[index].data = item
            //     })

            //     this.tableData = b
            // }
            // console.log(this.tableData)
        },

        toSearch() {
            let _toSearch = debounce(() => this.getTableData(this.search, this.search2), 1000);
            _toSearch();

        },



        //     getSpanArr(data) {
        //         this.mergeArr.forEach((key, index1) => {
        //             let count = 0; // 用来记录需要合并行的起始位置
        //             this.mergeObj[key] = []; // 记录每一列的合并信息
        //             data.forEach((item, index) => {
        //                 // index == 0表示数据为第一行，直接 push 一个 1
        //                 if (index === 0) {
        //                     this.mergeObj[key].push(1);
        //                 } else {
        //                     // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
        //                     if (item[key] === data[index - 1][key]) {
        //                         this.mergeObj[key][count] += 1;
        //                         this.mergeObj[key].push(0);
        //                     } else {
        //                         // 如果当前行和上一行其值不相等 
        //                         count = index; // 记录当前位置 
        //                         this.mergeObj[key].push(1); // 重新push 一个 1
        //                     }
        //                 }
        //             })
        //         })
        //     },
        //   // objectSpanMethod方法
        //     // 默认接受四个值 { 当前行的值, 当前列的值, 行的下标, 列的下标 }
        //     objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        //         // 判断列的属性
        //         if (this.mergeArr.indexOf(column.property) !== -1) {
        //             // 判断其值是不是为0 
        //             if (this.mergeObj[column.property][rowIndex]) {
        //                 return [this.mergeObj[column.property][rowIndex], 1]
        //             } else {
        //                 // 如果为0则为需要合并的行
        //                 return [0, 0];
        //             }
        //         }
        //     },

        handleSizeChange(val) {
            this.pageSize = val;
            this.getTableData();

        },

        handleCurrentChange(val) {
            this.page = val;
            this.getTableData();
        },

        deleteConfirm(_id) {
            this.$confirm('是否确定删除本行二级分类信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const params = {
                    _id
                };
                const { data } = await this.$http.post("/admin/deleteClassify2", params);
                if (data === "success") {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.search = '';
                    this.search2 = '';
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

        async addClassify() {

            const { classify1, classify2_text, _id } = this;
            console.log("classify2:" + classify2_text)
            if (!classify1 || !classify2_text) {
                this.$message.error("未填写必填项！");
                return;
            }
            const params = {
                classify2_text, classify1, _id
            };
            console.log(params)
            const { data } = await axios.post("/admin/addClassify", params);
            if (data === "success") {
                this.$message.success(_id ? "编辑成功!" : "新增成功!");
                this.dialogVisible = false;
                this.classify1 = "";
                this.search = '';
                this.search2 = '';
                // this.classify2_text = "";
                // this.classify2_url = "";
                this.getTableData()

            } else if (data === "existed") {
                this.$message.error("此二级分类已存在，请重新输入！");
                this.classify2_text = "";
            }
            else {
                this.$message.error(_id ? "编辑失败！" : "新增失败！");
            }
        },

        beforeEditClassify1(item) {
            this.editClassify1Visible = true
            const { classify1 } = item;
            this.classify1Ori = classify1;
            this.classify1 = classify1;
            // this.editClassify1()
        },

        editClassify1() {
            this.$confirm('此操作将修改所有与此一级分类名称相同的数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { classify1Ori, classify1 } = this;
                console.log(classify1);
                console.log(classify1Ori)
                if (!classify1) {
                    this.$message.error("未填写必填项！");
                    return;
                }
                const params = {
                    classify1Ori, classify1
                };
                const { data } = await axios.post("/admin/editClassify1", params);
                if (data === "success") {
                    this.$message.success("编辑成功!");
                    this.editClassify1Visible = false;
                    this.classify1 = "";
                    // this.classify2_url = "";
                    this.getTableData()

                }
                else {
                    this.$message.error("编辑失败！");
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消编辑'
                });
            });

        },

        editItem(item) {
            this.classify1Dis = true;
            this.title = '编辑二级分类信息';
            const { classify1, classify2_text, _id } = item;

            this.classify1 = classify1;
            this.classify2_text = classify2_text;
            // this.classify2_url = classify2_url;
            this._id = _id;
            this.dialogVisible = true;
        },

        handleClose() {
            this._id = "";
            this.classify1 = "";
            this.classify2_text = "";
            // this.classify2_url = "";
        },

        deleteClassify1Confirm(classify1) {
            this.$confirm('是否确定删除所有与本行信息一级分类相同的数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const params = {
                    classify1
                };
                const { data } = await this.$http.post("/admin/deleteClassify1", params);
                if (data === "success") {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.search = '';
                    this.search2 = '';
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


        // handleAvatarSuccess(res) {
        //     this.imageUrl = URL.createObjectURL(file.raw);
        //     //将后端发送的地址赋值到我们需要显示的img中的src动态绑定的参数中
        //     console.log(res);
        //     this.imageUrl = res.data.path;
        //     //将图片地址绑定到我们的form表单数据中 后期存入数据库中     
        //     this.classify2_url = res.data.path;
        // },
        // beforeAvatarUpload(file) {
        //     this.imageUrl = URL.createObjectURL(file.raw);
        //     const isPNG = file.type === 'image/png';
        //     const isJPG = file.type === 'image/jpeg';
        //     const isLt2M = file.size / 1024 / 1024 < 2;

        //     if (!isPNG && !isJPG) {
        //         this.$message.error('上传头像图片只能是 PNG 或 JPG 格式!');
        //     }
        //     if (!isLt2M) {
        //         this.$message.error('上传头像图片大小不能超过 2MB!');
        //     }
        //     return isJisPNG && isLt2M;
        // },
        // uploadHttpRequest(data) {

        // },

    },




    computed: {
        // newTableData() {
        //     console.log(this.tableData[0])
        //     console.log(typeof (this.tableData))
        //     let b = [];
        //     this.tableData[0].forEach(item => {
        //         b.push({ classify1: item })
        //     })


        //     this.tableData[1].forEach((item, index) => {
        //         b[index].data = item
        //     })
        //     console.log(b)
        //     return b

        // }
    },

    mounted() {
        // console.log(this.tableData)

    }
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
        width: 250px;
        margin-bottom: 20px;
        margin-left: 50px;

        .el-input__prefix {
            height: auto;
        }
    }

    .inputArea {
        display: flex;
        // flex-direction: row;
        justify-content: center;
        align-items: center;

        .el-input {
            margin-left: 5px;
            margin-top: 20px;
        }

        // .span{
        //     width:400px;
        // }
    }

    .top .el-button {
        margin-left: 40px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}
</style>