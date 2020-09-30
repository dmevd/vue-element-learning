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
                <label >账号/用户名：<el-input  v-model="query.name" clearable placeholder="请输入" class="handle-input mr10"></el-input></label>
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
                <label style="margin-left: 10px">企业：<el-input  v-model="query.unitName" clearable placeholder="请输入" class="handle-input mr10"></el-input></label>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" :disabled="!canSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="showCreateUser" >新建</el-button>
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

            <!-- 新建用户 -->
            <el-dialog title="新建用户" :visible.sync="createUserConfig.show" width="400px">
                <el-form :model="createUserConfig.form" ref="createUserForm" status-icon :rules="createUserConfig.rules" style="margin-left: -40px;margin-right: 10px;">
                    <el-form-item label="账号" :label-width="createUserConfig.formLabelWidth" prop="name">
                        <el-input v-model="createUserConfig.form.name"  auto-complete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" :label-width="editUserConfig.formLabelWidth" prop="nickName">
                        <el-input v-model="createUserConfig.form.nickName"  auto-complete="off" clearable ></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="createUserConfig.formLabelWidth" prop="pwd">
                        <el-input type="password" v-model="createUserConfig.form.pwd"  auto-complete="off" clearable></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="createUserConfig.show = false">取 消</el-button>
                    <el-button type="primary" @click="createUser">确 定</el-button>
                </div>
            </el-dialog>

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

            <!-- 绑定企业 -->
            <el-dialog title="绑定企业" :visible.sync="bindUnitConfig.show" width="800px">
                <el-form :model="bindUnitConfig.form" style="margin-left: -40px;margin-right: 10px;">
                    <el-form-item label="账号Id" :label-width="bindUnitConfig.formLabelWidth" >
                        <el-input v-model="bindUnitConfig.form.userId"  auto-complete="off" disabled :style="bindUnitConfig.inputWidth"></el-input>
                    </el-form-item>
                    <el-form-item label="账号" :label-width="bindUnitConfig.formLabelWidth">
                        <el-input v-model="bindUnitConfig.form.name"  auto-complete="off" disabled :style="bindUnitConfig.inputWidth"></el-input>
                    </el-form-item>
                    <el-form-item label="企业" :label-width="bindUnitConfig.formLabelWidth">
                        <el-select v-model="bindUnitConfig.form.list" multiple :style="bindUnitConfig.selectWidth">
                            <el-option
                                    v-for="item in bindUnitConfig.unitList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="bindUnitConfig.show = false">取 消</el-button>
                    <el-button type="primary" @click="bindUnit">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 绑定角色 -->
            <el-dialog title="绑定角色" :visible.sync="bindRoleConfig.show" width="800px">
                <el-form :model="bindRoleConfig.form" style="margin-left: -40px;margin-right: 10px;">
                    <el-form-item label="账号Id" :label-width="bindRoleConfig.formLabelWidth" >
                        <el-input v-model="bindRoleConfig.form.userId"  auto-complete="off" disabled :style="bindRoleConfig.inputWidth"></el-input>
                    </el-form-item>
                    <el-form-item label="账号" :label-width="bindRoleConfig.formLabelWidth">
                        <el-input v-model="bindRoleConfig.form.name"  auto-complete="off" disabled :style="bindRoleConfig.inputWidth"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" :label-width="bindRoleConfig.formLabelWidth">
                        <el-select v-model="bindRoleConfig.form.list" multiple :style="bindRoleConfig.selectWidth">
                            <el-option
                                    v-for="item in bindRoleConfig.roleList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="bindRoleConfig.show = false">取 消</el-button>
                    <el-button type="primary" @click="bindRole">确 定</el-button>
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
                            func:this.showBindUnit
                        },{
                            name: '授权角色',
                            func:this.showBindRole
                        }]
                    }
                ],
                canSearch: true,
                createUserConfig:{
                    show:false,
                    formLabelWidth: '120px',
                    form:{
                        name:'',
                        nickName: '',
                        pwd:''
                    },
                    rules: {
                        name: [
                            {required: true, trigger: 'blur',message: '请输入账号' }
                        ],
                        nickName: [
                            {required: true, trigger: 'blur',message: '请输入用户名' }
                        ],
                        pwd: [
                            {required: true, trigger: 'blur',message: '请输入密码' }
                        ]
                    }
                },
                editUserConfig:{
                    show:false,
                    formLabelWidth: '120px',
                    form:{
                        userId:-1,
                        name:'',
                        nickName: ''
                    }
                },
                bindUnitConfig:{
                    show:false,
                    formLabelWidth: '120px',
                    inputWidth:'width:300px',
                    selectWidth:'width:600px',
                    unitList:[],
                    form:{
                        userId: 1,
                        name:'',
                        list:[]
                    }
                },
                bindRoleConfig:{
                    show:false,
                    formLabelWidth: '120px',
                    inputWidth:'width:300px',
                    selectWidth:'width:600px',
                    roleList:[],
                    form:{
                        userId: 1,
                        name:'',
                        list:[]
                    }
                }
            }
        },

        created() {
            this.handleSearch();
            this.loadRoleList();
            this.$api.unitService("getUnitListByName",{}).then(res =>{
                this.bindUnitConfig.unitList = res.result.list;
            });
            this.$api.userService("getRoleList",{}).then(res =>{
                this.bindRoleConfig.roleList = res.result.list;
            });
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
                console.log('查询');
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

            // 弹出新建用户界面
            showCreateUser(){
                this.createUserConfig.form.name = '';
                this.createUserConfig.form.nickName = '';
                this.createUserConfig.form.pwd = '';
                if(this.$refs.createUserForm){
                    this.$refs.createUserForm.resetFields();
                }
                this.createUserConfig.show = true;
            },
            //新建用户
            createUser(){
                this.$refs.createUserForm.validate((valid) => {
                    if (valid) {
                        this.$api.userService('addUser',this.createUserConfig.form).then(res =>{
                                this.loadTableData(this.query.pageNum);
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                                this.createUserConfig.show = false;
                        })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '请确认录入信息是否校验通过!'
                        });
                        return false;
                    }
                });
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
                        this.loadTableData(this.query.pageNum);
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                    })
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
                    this.loadTableData(this.query.pageNum);
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.editUserConfig.show = false;
                })
            },
            // 弹出绑定企业界面
            showBindUnit(data){
                this.bindUnitConfig.form.userId = data.id;
                this.bindUnitConfig.form.name = data.name;
                let unitIdArr = [];
                for(let i = 0; i < data.unitList.length; i ++){
                    unitIdArr.push(data.unitList[i].unitId);
                }
                this.bindUnitConfig.form.list = unitIdArr;

                this.bindUnitConfig.show = true;
            },
            //绑定企业
            bindUnit(){
                this.$api.unitService("empowerUserUnit",this.bindUnitConfig.form).then(res=>{
                    this.loadTableData(this.query.pageNum);
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.bindUnitConfig.show = false;
                })
            },
            // 弹出绑定角色界面
            showBindRole(data){
                this.bindRoleConfig.form.userId = data.id;
                this.bindRoleConfig.form.name = data.name;
                let roleIdArr = [];
                for(let i = 0; i < data.roleList.length; i ++){
                    roleIdArr.push(data.roleList[i].roleId);
                }
                this.bindRoleConfig.form.list = roleIdArr;

                this.bindRoleConfig.show = true;
            },
            //绑定角色
            bindRole(){
                this.$api.userService("empowerUserRole",this.bindRoleConfig.form).then(res=>{
                    this.loadTableData(this.query.pageNum);
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.bindRoleConfig.show = false;
                })
            }
        }
    }



</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .mr10 {
        margin-right: 10px;
    }
</style>
