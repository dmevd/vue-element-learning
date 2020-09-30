<template>
    <div>
        <el-table
                :data="tableData"
                :fit="true"
                style="width: 100%">

            <el-table-column
                    v-for="(item, rowIndex) in columns"
                    :key="rowIndex"
                    :prop="item.field"
                    :label="item.title"
                    :min-width="item.width ? item.width: 180">
                <template slot-scope="scope" >
                    <span v-if="typeof item.formatter==='function'" v-html="item.formatter(scope.row ,rowIndex, item.field)"></span>
                    <span v-else-if="item.edit instanceof Array && item.edit.length > 0" >
                        <el-button v-for="(act, actIndex) in item.edit" :key="actIndex"
                                size="mini"
                                type="text"
                                @click="act.func(scope.row)">{{act.name}}</el-button>
                    </span>
                    <span v-else v-html="scope.row[item.field]"></span>
                </template>
            </el-table-column>
        </el-table>


</div>
</template>

<script>
    export default {
        name: "my-table",
        props:{
            columns:{
                type: Array,
                default: ()=>[]
            },
            tableData:{
                type:Array,
                default: ()=> []
            }
        },
        data(){
            return {
                currentPage: this.pageNum
            }
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>
