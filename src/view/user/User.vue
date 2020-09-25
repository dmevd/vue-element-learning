<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--查询条件-->
            <div class="handle-box">
                <label >账号/用户名：<el-input  v-model="query.name" placeholder="请输入" class="handle-input mr10"></el-input></label>
                <label >角色：
                    <el-select v-model="query.roleId" clearable placeholder="请选择">
                        <el-option
                                v-for="item in roleSelector.data"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </label>
                <label style="margin-left: 10px">企业：<el-input  v-model="query.unitName" placeholder="请输入" class="handle-input mr10"></el-input></label>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" :disabled="!canSearch">搜索</el-button>
            </div>
            <!--表格-->
            <my-table
                    :columns="columns"
                    :table-data="tableData"
            ></my-table>

            <!--分页插件-->
            <div class="mt20 mb20 bold" style="margin-top: 30px"></div>
            <el-pagination
                    @size-change="pageSizeChange"
                    @current-change="pageChange"
                    :current-page="query.pageNum"
                    :page-sizes="[10, 20, 30]"
                    :page-size="query.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageTotal">
            </el-pagination>

            <!-- 编辑用户 -->
            <el-dialog title="修改用户" :visible.sync="editUserConfig.show" width="400px">
                <el-form :model="editUserConfig.form" style="margin-left: -40px;margin-right: 10px;">
                    <el-form-item label="账号Id" :label-width="editUserConfig.formLabelWidth">
                        <el-input v-model="editUserConfig.form.userId"  auto-complete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="账号" :label-width="editUserConfig.formLabelWidth">
                        <el-input v-model="editUserConfig.form.name"  auto-complete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" :label-width="editUserConfig.formLabelWidth">
                        <el-input v-model="editUserConfig.form.nickName"  auto-complete="off" ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editUserConfig.show = false">取 消</el-button>
                    <el-button type="primary" @click="updateUser">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>


    export default {
        name: "User",
        data() {
            return {
                query: {
                    name: '',
                    roleId:'',
                    unitName: '',
                    pageNum: 1,
                    pageSize: 10
                },
                roleSelector:{
                  data:[]
                },
                currentPage: 1,
                pageTotal: 0,
                isLoading: false,
                tableData: [],
                columns: [
                    {field: 'name', title:'账号', width: 100},
                    {field: 'nickName', title:'姓名', width: 100},
                    {field: 'role', title: '角色', width: 230,
                        formatter: function (rowData,rowIndex,pagingIndex,field) {
                            let arr = [];
                            if(rowData.roleList){
                                for(let i = 0; i < rowData.roleList.length; i ++){
                                    let item = rowData.roleList[i];
                                    arr.push(item.roleName);
                                }
                            }
                            return arr.join(', ');
                        }
                    },
                    {field: 'unit', title: '企业', width: 230, titleAlign: 'center',columnAlign:'center', isResize:true,
                        formatter: function (rowData,rowIndex, field) {
                            let arr = [];
                            if(rowData.unitList){
                                for(let i = 0; i < rowData.unitList.length; i ++){
                                    let item = rowData.unitList[i];
                                    arr.push(item.unitName);
                                }
                            }
                            return arr.join(', ');
                        }
                    },
                    {field: 'stateName', title: '状态',width: 50},
                    {field: 'edit', title: '操作',width: 190,
                        edit:[{
                            name: '禁/启用',
                            func:this.disableUser
                        },{
                            name: '修改',
                            func: this.showEditUser
                        },{
                            name: '绑定企业',
                            func:this.handleSearch
                        },{
                            name: '授权角色',
                            func:this.handleSearch
                        }]
                    }
                ],
                canSearch: true,

                editUserConfig:{
                    show:false,
                    formLabelWidth: '120px',
                    form:{
                        userId:-1,
                        name:'',
                        nickName: ''
                    }
                }
            };
        },

        created() {
            this.handleSearch();
            this.loadRoleList();

        },
        methods: {
            loadRoleList(){
                this.$api.userService("getRoleList", {}).then(res =>{
                    let list = res.result.list;
                    let data = [];
                    if(list){
                        for (let i = 0; i< list.length; i++){
                            let role = list[i];
                            let item = {
                                value: role.id,
                                label: role.name
                            };
                            data.push(item)
                        }
                    }
                    this.roleSelector.data = data;
                })
            },
            // 触发搜索按钮
            handleSearch() {
                this.loadTableData(1);
                if(this.$refs.pagination){
                    this.$refs.pagination.newPageIndex = 1;
                }

            },
            loadTableData(pageIndex){
                console.log('查询')
                this.query.pageNum = pageIndex;
                this.isLoading = true;
                this.canSearch = false;
                this.$api.userService("getUserInfoListByPage", this.query).then(res =>{
                    this.tableData = res.result.list;
                    this.pageTotal = res.result.total;
                    this.isLoading = false;
                    this.canSearch = true;
                })
            },
            pageChange(pageIndex){
                this.loadTableData(pageIndex)
            },
            pageSizeChange(pageSize){
                this.query.pageSize = pageSize;
                this.loadTableData(1)
            },
            //禁用/启用账号
            disableUser(data){
                let param = {
                    state: data.state === 1 ? 0 : 1,
                    userId: data.id
                };
                this.$confirm('确定'+(data.state === 1 ?　'禁用': '启用')+'该账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.userService("deleteUser", param).then(res =>{
                        this.loadTableData(this.query.pageNum)
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '操作取消!'
                    });
                })


            },
            // 弹出编辑用户界面
            showEditUser(data){
                this.editUserConfig.form.userId = data.id;
                this.editUserConfig.form.name = data.name;
                this.editUserConfig.form.nickName = data.nickName;

                this.editUserConfig.show = true;
            },
            //更新用户
            updateUser(){
                this.$api.userService("updateUser",this.editUserConfig.form).then(res=>{
                    this.loadTableData(this.query.pageNum)
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.editUserConfig.show = false;
                })
            }
        }
    }



</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
