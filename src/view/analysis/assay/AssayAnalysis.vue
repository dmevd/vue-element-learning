<template>
    <el-tabs type="border-card">
        <!--环比-->
        <el-tab-pane label="环比">
            <!--查询条件-->
            <div class="handle-box">
                <el-form :model="tab1.query" ref="tab1Form" status-icon :rules="tab1.rules"
                         style="margin-left: -40px;margin-right: 10px;">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="数据类型" :label-width="tab1.formLabelWidth" prop="valueTypes">
                                <select-tree
                                        :width="'100%'"
                                        :checkedKeys="tab1.query.valueTypes"
                                        multiple
                                        :defaultProps="tab1.valueTypeSelector.defaultProps"
                                        :data="tab1.valueTypeSelector.data"
                                        clearable
                                        @popoverHide="popoverHide"
                                ></select-tree>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="数据类型2" :label-width="tab1.formLabelWidth" prop="valueTypes">
                                <a-tree-select
                                        multiple
                                        v-model="tab1.query.valueTypes"
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px'}"
                                        :tree-data="tab1.valueTypeSelector.data"
                                        placeholder="请选择"
                                        :replaceFields="tab1.valueTypeSelector2.defaultProps"
                                        tree-default-expand-all
                                        allowClear
                                        @change="popoverHide2"
                                >
                                </a-tree-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="企业" :label-width="tab1.formLabelWidth" prop="unitId">
                                <el-select v-model="tab1.query.unitId" placeholder="请选择">
                                    <el-option
                                            v-for="item in tab1.unitIdSelector.data"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="开始时间" :label-width="tab1.formLabelWidth" prop="startDate">
                                <el-date-picker
                                        v-model="tab1.query.startDate"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-row>
                                <el-col :span="16">
                                    <el-form-item label="结束时间" :label-width="tab1.formLabelWidth" prop="endDate">
                                        <el-date-picker
                                                v-model="tab1.query.endDate"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" icon="el-icon-search" @click="tab1Search"
                                               :disabled="!tab1.canSearch">搜索
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="12" v-for="item in tab1.chartConfig.chartList" :key="item.id">
                        <LineChart
                                :data="item.data"
                                :x-field="item.xField"
                                :y-field="item.yField"
                                :series-field="item.seriesField"
                                :y-axis="item.yAxis"
                        ></LineChart>
<!--                        <div :id="item.id" style="height:500px; margin: 30px"></div>-->
                    </el-col>
                </el-row>

            </div>
        </el-tab-pane>
        <el-tab-pane label="同比">配置管理</el-tab-pane>
    </el-tabs>
</template>

<script>
    import SelectTree from "@/components/select-tree/SelectTree";
    import LineChart from "@/components/chart/line/LineChart";

    export default {
        name: "AssayAnalysis",
        components: {LineChart, SelectTree},
        data() {
            return {
                tab1: {
                    formLabelWidth: '120px',
                    canSearch: true,
                    valueTypeSelector: {
                        defaultProps: {
                            nodeKey: 'value',
                            children: 'children',
                            label: 'name'
                        },
                        data: []
                    },
                    valueTypeSelector2: {
                        defaultProps: {
                            children: 'children',
                            title: 'name',
                            key: 'value',
                            value: 'value'
                        },
                        data: []
                    },
                    unitIdSelector: {
                        data: []
                    },
                    query: {
                        valueTypes: [],
                        unitId: 7,
                        startDate: '2020-8-1',
                        endDate: '2020-9-30'
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
                    },

                    chartConfig: {
                        chartList: []
                    }

                }
            }
        },
        //页面初始加载
        created() {
            this.getValueTypes();
            this.getUnitIdList();
        },
        methods: {
            getValueTypes() {
                this.$api.reportService("getAssayDataTree", {}).then(res => {
                    console.log("zuzhuang ")
                    // this.tab1.valueTypeSelector.data = res.result;
                    this.tab1.valueTypeSelector.data = this.addNodeProperty(res.result);
                })
            },
            addNodeProperty(arr) {
                for (let index in arr) {
                    let node = arr[index];
                    if (!node.value) {
                        node.value = 'noValue_' + this.$myUtils.guid();
                    }
                    if (node.children && node.children.length > 0) {
                        node.selectable = false;
                        this.addNodeProperty(node.children);
                    }
                }
                return arr;
            },


            getUnitIdList() {
                this.$api.unitService("getUnitListByName", {}).then(res => {
                    this.tab1.unitIdSelector.data = res.result.list;
                })
            },

            tab1Search() {
                console.log(this.tab1.query);
                let me = this;
                this.$refs.tab1Form.validate((valid) => {
                    if (valid) {
                        me.$message.success('操作成功!');
                        this.getLineChartData();
                        // this.renderLineChart();
                    } else {
                        me.$message.error('失败');
                    }
                })
            },
            popoverHide(checkedIds, checkedData) {
                this.tab1.query.valueTypes = checkedIds.filter(item => {
                    return !item.startsWith("noValue");
                });
            },
            popoverHide2(values, label, extra) {
                this.tab1.query.valueTypes = values.filter(item => {
                    return !item.startsWith("noValue");
                });
            },

            getLineChartData() {
                let me = this;
                this.$api.reportService("getAssayLineChartData", this.tab1.query).then(res => {
                    console.log(" 获取数据");
                    let dataMap = res.result;
                    me.tab1.chartConfig.chartList = [];
                    for (let unit in dataMap) {
                        let item = dataMap[unit];
                        me.tab1.chartConfig.chartList.push({
                            data: item,
                            xField: 'date',
                            yField: 'value',
                            seriesField: 'type',
                            yAxis: {
                                unit:'单位：' + unit
                            },
                        });
                    }
                    if(me.tab1.chartConfig.chartList.length === 0){
                        this.$message.warning('未查询到数据，请更改查询条件重新尝试！')
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
</style>
