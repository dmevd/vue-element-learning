<template>
    <div :id="thisId" :style="cStyle"><div>{{yAxis.unit}}<br/>&nbsp;<br/></div></div>
</template>

<script>

    import {Line} from '@antv/g2plot';//v2.0.1
    export default {
        name: "LineChart",
        props:{
            id: {
                type: String,
                default: ''
            },
            cStyle:{
                type: String,
                default: 'height:500px; margin: 10px 10px 80px 10px'
            },
            width:{
                type:String,
                default:'100%',
            },
            height:{
               type:String,
               default: '500px'
            },
            data:{
                type:Array,
                default: ()=>[]
            },
            xField:{
                type:String,
                default: 'date'
            },
            yField:{
                type:String,
                default: 'value'
            },
            seriesField:{
                type: String,
                default: 'type'
            },
            xAxis: {//继承 G2plot
                type: Object,
                default: ()=>{
                    return {

                    }
                }
            },
            yAxis: {//继承 G2plot
                unit: '单位'
            },
            legend: {//继承 G2plot
                type: Object,
                default: ()=>{
                    return {
                        position: 'right-top',
                        flipPage: true
                    }
                }
            },
            point: {
                type: Object,
                default:()=>{
                    return {
                        visible: true,
                        shape: 'circle',
                        size: 3,
                        style: {
                            stroke: '#fff',
                        }
                    }
                }

            },
            smooth:{//折线是否平滑
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
                thisId: this.id
            }
        },
        created(){
            if(this.id === ''){//
                this.thisId = this.$myUtils.guid();
            }else{
                this.thisId = this.id;
            }
        },
        mounted() {
            this.init();
        },
        methods:{
            init(){
                let lineChart = new Line(this.thisId, {
                    data: this.data,
                    xField: this.xField,
                    yField: this.yField,
                    seriesField: this.seriesField,
                    xAxis: this.xAxis,
                    legend: this.legend,
                    yAxis: this.yAxis,
                    point: this.point,
                    smooth: this.smooth,//折线是否平滑
                });
                lineChart.render();
            }
        }
    }
</script>

<style scoped>

</style>
