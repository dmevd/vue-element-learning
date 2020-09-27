<template>
    <el-tabs type="border-card">
        <!--环比-->
        <el-tab-pane label="环比">
            <!--查询条件-->
            <div class="handle-box">
                <el-form :model="tab1.query" ref="tab1Form" status-icon :rules="tab1.rules"
                         style="margin-left: -40px;margin-right: 10px;" inline>
                    <el-form-item label="数据类型" :label-width="tab1.formLabelWidth" prop="valueTypes">
                        <select-tree
                                :width="620"
                                :checkedKeys="tab1.query.valueTypes"
                                multiple
                                :defaultProps="tab1.valueTypeSelector.defaultProps"
                                :data="tab1.valueTypeSelector.data"
                                clearable
                                @popoverHide="popoverHide"
                        ></select-tree>
                    </el-form-item>
                    <el-form-item label="企业" :label-width="tab1.formLabelWidth" prop="unitId">
                        <el-input v-model="tab1.query.unitId" clearable placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" :label-width="tab1.formLabelWidth" prop="startDate">
                        <el-input v-model="tab1.query.startDate" placeholder="请选择" auto-complete="off"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="结束时间" :label-width="tab1.formLabelWidth" prop="endDate">
                        <el-input v-model="tab1.query.endDate" auto-complete="off" placeholder="请选择"
                                  clearable></el-input>
                    </el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="tab1Search" :disabled="!tab1.canSearch">搜索</el-button>
                </el-form>

            </div>
        </el-tab-pane>
        <el-tab-pane label="同比">配置管理</el-tab-pane>
    </el-tabs>
</template>

<script>
    import SelectTree from "@/components/select-tree/SelectTree";

    export default {
        name: "AssayAnalysis",
        components: {SelectTree},
        data() {
            return {
                tab1: {
                    formLabelWidth: '120px',
                    canSearch: true,
                    valueTypeSelector: {
                        defaultProps: {
                            nodeKey: 'value',
                            children: 'children',
                            label: 'label'
                        },
                        data: [
                            {
                                value: 'A',
                                label: 'label-A',
                                disabled: true,
                                children: [
                                    {
                                        value: 'A-1',
                                        label: 'label-A-1',
                                    },
                                    {
                                        value: 'A-2',
                                        label: 'label-A-2',
                                    },
                                ],
                            },
                            {
                                value: 'B',
                                label: 'label-B'
                            }
                        ]
                    },
                    query: {
                        valueTypes: [],
                        unitId: '',
                        startDate: '',
                        endDate: ''
                    },
                    rules: {
                        valueTypes: [
                            {required: true, trigger: 'blur', message: '不可为空'}
                        ],
                        unitId: [
                            {required: true, trigger: 'blur', message: '不可为空'}
                        ],
                        startDate: [
                            {required: true, trigger: 'blur', message: '不可为空'}
                        ],
                        endDate: [
                            {required: true, trigger: 'blur', message: '不可为空'}
                        ],
                    }
                }
            }
        },
        methods:{
            tab1Search(){
                console.log('valutypes :【'+this.tab1.query.valueTypes+'】');
                this.$refs.tab1Form.validate((valid) => {
                    if(valid){

                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: '操作失败!'
                        });
                    }
                })
            },

            popoverHide (checkedIds, checkedData) {
                this.tab1.query.valueTypes = checkedIds;
                console.log(checkedIds);
                console.log(checkedData);
            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
</style>
