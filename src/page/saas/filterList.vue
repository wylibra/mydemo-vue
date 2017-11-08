<template lang="html">
  <div class="table-content">
    <div v-for="(i,index) in filterArray">
        <el-select v-model="i.field" placeholder="请选择" @change="fieldChange(index, i.field)">
            <el-option
            v-for="item in filterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-select
            v-model="i.params"
            multiple
            filterable
            allow-create
            v-if="i.field==1"
            >
            <el-option
            v-for="item in industryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-date-picker
            v-model="i.params"
            type="daterange"
            align="left"
            placeholder="选择日期范围"
            :picker-options="pickerOptions2" 
            v-else-if="i.field==4"  
            @change="formatDate(i.params, index)"
            >
        </el-date-picker>
        <span v-else-if="i.field==5">
            <el-select filterable v-model="i.params[0]" style="display:inline-block;width:15%;" placeholder="请选择">
                <el-option label="请选择" :value="'0'"></el-option>
                <el-option v-for="(item,index) in dict" :label="item.name" :value="''+item.id"></el-option>
            </el-select>
            <el-select v-model="i.params[1]" filterable style="display:inline-block;width:15%;" placeholder="请选择">
                <el-option label="请选择" :value="'0'"></el-option>
                <el-option v-for="(item,index) in dict" :label="item.name" :value="''+item.id"></el-option>
            </el-select>
            <el-select v-model="i.params[2]" filterable  style="display:inline-block;width:15%;" placeholder="请选择">
                <el-option label="请选择" :value="'0'"></el-option>
                <el-option v-for="(item,index) in dict" :label="item.name" :value="''+item.id"></el-option>
            </el-select>
        </span>
    </div>
    <div>
        <el-button type="text" @click="addFilter">
            <i class="el-icon-plus"></i>
            筛选条件
        </el-button>
    </div>

    <div>
        <el-popover
            ref="popover"
            placement="bottom"
            width="400"
            @show="show"
            v-model="configVisible"
            trigger="click">
            <template>
                <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in cities" :label="city" :key="city" :disabled="city=='公司简介'">
                        {{city}}
                    </el-checkbox>
                </el-checkbox-group>
                <div class="file-save">
                    <el-button
                    class="il-bk"
                    size="small"
                    @click="configVisible = false">取消</el-button>
                    <el-button
                    class="save-btn il-bk"
                    size="small"
                    type="primary"
                    @click="save()">保存</el-button>
                </div>
            </template>
        </el-popover>
        <el-button v-popover:popover size="small">
            <i class="el-icon-plus"></i>
            更多字段
        </el-button>
    </div>
    <!-- <a download="somedata.xls" href="#" onclick="return excellentExport.excel(this, 'datatable', 'Sheet Name Here');">导出excel</a> -->
    <el-table
        id="datatable"
        :data="tableData"
        stripe
        style="width: 100%"
        @sort-change="handleSort"
        >
        <el-table-column
            type="selection"
            min-width="46"
        >
        </el-table-column>
        <!-- <el-table-column
        prop="date"
        label="公司简称"
        :fixed="showedFields.length ? 'left' : null"
        >
        </el-table-column> -->
        <el-table-column
        v-for="(field, index) in showedFields"
        :label="field"
        :key="index"
        :fixed="field === '公司简介' ? 'left' : null"
        :min-width="field === '公司简介' ? 230 : 120"
        :sortable="field==='行业' || field==='所在地' || field==='融资额'"
        >
        <template scope="scope">
            <span  v-if="field==='行业'">
                {{scope.row.date}}
            </span>
            <span  v-else-if="field==='所在地'">
                {{scope.row.address}}
            </span>
            <span  v-else-if="field==='公司简介'">
                {{scope.row.name}}
            </span>
            <span  v-else-if="field">
                {{scope.row.name}}
            </span>
        </template>
        </el-table-column>
    </el-table>
    <input type="text" ref="input1" />
    <button @click="add">添加</button>
  </div>
</template>

<script>
import moment from 'moment'
// import dict from '../../dict'
import excellentexport from 'excellentexport'
export default {
    data() {
        return {
            // 更多字段是否展示
            configVisible: false,
            // 全选
            checkAll: false,
            // 已选字段
            checkedCities: ['公司简介', '行业', '一句话简介'],
            // 全部字段
            cities: ['公司简介', '行业','一句话简介','所在地','轮次','获投时间','融资额','投资方'],
            // 全选 不确定状态
            isIndeterminate: true,


            dict: [],
            // 列表展示字段
            showedFields: ['公司简介', '行业','一句话简介'],
            // 列表数据
            tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
            }],
            // 筛选条件组
            filterArray: [],
            // 筛选项
            filterOptions: [{
                    label:'行业',
                    value:'1'
                }, {
                    label:'标签',
                    value:'2'
                }, {
                    label:'投资轮次',
                    value:'3'
                }, {
                    label:'创办时间',
                    value:'4'
                }, {
                    label:'所在地',
                    value:'5'
                }, {
                    label:'趋势热度',
                    value:'6'
            }],
            // 行业
            industryOptions: [{
                    label:'行业',
                    value:'1'
                }, {
                    label:'标签',
                    value:'2'
                }, {
                    label:'投资轮次',
                    value:'3'
                }, {
                    label:'创办时间',
                    value:'4'
                }, {
                    label:'所在地',
                    value:'5'
                }, {
                    label:'趋势热度',
                    value:'6'
            }],
            // 自定义日期
            pickerOptions2: {
                shortcuts: [{
                    text: '昨日',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '今日',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '上周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    let nowDayOfWeek = end.getDay() == 0 ? 7 : end.getDay(); //今天本周的第几天
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * (nowDayOfWeek - 1 + 7));
                    end.setTime(end.getTime() - 3600 * 1000 * 24 * nowDayOfWeek);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '本周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    let nowDayOfWeek = end.getDay() == 0 ? 7 : end.getDay(); //今天本周的第几天
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * (nowDayOfWeek - 1));
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '上月',
                    onClick(picker) {
                    let date = new Date();  //上月日期
                    date.setDate(1);
                    date.setMonth(date.getMonth()-1);
                    let lastMonth = date.getMonth();
                    let nowYear = date.getFullYear();
                    //获得某月的天数
                    function getMonthDays(myMonth){
                        var monthStartDate = new Date(nowYear, myMonth, 1);
                        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
                        var   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);
                        return   days;
                    }
                    const end = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
                    const start = new Date(nowYear, lastMonth, 1);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '本月',
                    onClick(picker) {
                    const end = new Date();
                    let nowYear = end.getFullYear();
                    let nowMonth = end.getMonth();
                    let start = new Date(nowYear, nowMonth, 1);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '去年',
                    onClick(picker) {
                    let nowYear = (new Date()).getFullYear();
                    const start = new Date(nowYear - 1, 0, 1);
                    const end = new Date(nowYear - 1, 11, 31);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '今年',
                    onClick(picker) {
                    let nowYear = (new Date()).getFullYear();
                    const end = new Date();
                    const start = new Date(nowYear, 0, 1);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
        }
    },
    mounted() {
        
    },
    methods: {
        // 添加筛选
        addFilter() {
            let filterItem = {
                field: '',
                function: '',
                params: []
            };
            this.filterArray.push(filterItem);
        },
        // 筛选项change
        fieldChange(index, field) {
            let filterItem = {
                field: field,
                function: '',
                params: []
            };
            this.filterArray.splice(index, 1, filterItem);
        },
        // 日期格式化
        formatDate(date, index) {
                date[0] = moment(date[0]).format('YYYY-MM-DD');
                date[1] = moment(date[1]).format('YYYY-MM-DD');
        },
        // check 全选
        handleCheckAllChange(val) {
            this.checkedCities = val.target.checked ? this.cities : [];
            this.isIndeterminate = false;
        },
        // check 单选
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        // 展示 更多字段
        show() {
            this.configVisible = true;
        },
        // 筛选项保存
        save() {
            this.configVisible = false;
            this.showedFields = this.checkedCities;
        },
        // 表格排序
        handleSort(val) {
            if(val.column) {
                console.log(val.column.label);
                console.log(val.order);
            }
        },
        // 导出excel
        exportExcel() {
            var ele = document.getElementById('datatable');
            excellentexport.excel(this, ele, 'Sheet Name Here');
        },
        add() {
            this.$refs.input1.value = '22';
        }
    }
}
</script>

<style lang="css">
.el-picker-panel__shortcut {
    display: inline;
    width: auto;
}
</style>