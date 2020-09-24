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
            <v-table
                    is-horizontal-resize
                    style="width:100%"
                    :show-vertical-border="false"
                    row-hover-color="#fafafa"
                    row-click-color="#edf7ff"
                    title-bg-color="#f5f7fa"
                    :columns="columns"
                    :table-data="tableData"
                    :paging-index="(query.pageNum-1)*query.pageSize"
                    :is-loading="isLoading"
            ></v-table>

            <div class="mt20 mb20 bold" style="margin-top: 30px"></div>
                <v-pagination
                        ref="pagination"
                        @page-change="pageChange" @page-size-change="pageSizeChange"
                        :total="pageTotal"
                        :page-size="query.pageSize"
                        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
            </div>

<!--            <div class="pagination">-->
<!--                <el-pagination-->
<!--                        background-->
<!--                        layout="total, prev, pager, next"-->
<!--                        :current-page="query.pageIndex"-->
<!--                        :page-size="query.pageSize"-->
<!--                        :total="pageTotal"-->
<!--                        @current-change="handlePageChange"-->
<!--                ></el-pagination>-->
<!--            </div>-->
<!--        </div>-->

        <!-- 编辑弹出框 -->
<!--        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">-->
<!--            <el-form ref="form" :model="form" label-width="70px">-->
<!--                <el-form-item label="用户名">-->
<!--                    <el-input v-model="form.name"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="地址">-->
<!--                    <el-input v-model="form.address"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--                <el-button @click="editVisible = false">取 消</el-button>-->
<!--                <el-button type="primary" @click="saveEdit">确 定</el-button>-->
<!--            </span>-->
<!--        </el-dialog>-->
    </div>
</template>

<script>
    // import useraction from './useraction.vue'

    export default {
        name: "User",
        components: {
            useraction: () => import('./useraction.vue')
        },
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
                    {field: 'name', title:'账号', width: 100, titleAlign: 'center',columnAlign:'center', isResize:true},
                    {field: 'nickName', title:'姓名', width: 100, titleAlign: 'center',columnAlign:'center', isResize:true},
                    {field: 'role', title: '角色', width: 330, titleAlign: 'center',columnAlign:'center', isResize:true,
                        formatter: function (rowData,rowIndex,pagingIndex,field) {
                            let arr = [];
                            if(rowData.roleList){
                                for(let i = 0; i < rowData.roleList.length; i ++){
                                    let item = rowData.roleList[i];
                                    arr.push(item.roleName);
                                }
                            }
                            return arr.join(',');
                        }
                    },
                    {field: 'unit', title: '企业', width: 330, titleAlign: 'center',columnAlign:'center', isResize:true,
                        formatter: function (rowData,rowIndex,pagingIndex,field) {
                            let arr = [];
                            if(rowData.unitList){
                                for(let i = 0; i < rowData.unitList.length; i ++){
                                    let item = rowData.unitList[i];
                                    arr.push(item.unitName);
                                }
                            }
                            return arr.join(',');
                        }
                    },
                    {field: 'stateName', title: '状态',width: 110, titleAlign: 'center',columnAlign:'center', isResize:true},
                    {field: 'edit', title: '操作',width: 110, titleAlign: 'center',columnAlign:'left', componentName:'useraction', isResize:true}
                ],
                canSearch: true
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
