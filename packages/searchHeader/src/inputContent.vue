<template>
    <div>
        <el-input
                v-if="config.type==='input'"
                :placeholder="`请输入${config.label}`"
                v-model.trim="inputVal"
                clearable>
        </el-input>
        <el-select v-model="inputVal"
                   style="width: 100%"
                   :placeholder="`请选择${config.label}`"
                   filterable
                   :multiple="!!config.multiple"
                   v-if="config.type==='select'"
                   clearable>
            <el-option v-for="item in searchList" :key="item.value"
                       :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-date-picker
                style="width: 100%"
                v-if="config.type==='date'"
                v-model="inputVal"
                value-format="yyyy-MM-dd"
                type="date"
                :placeholder="`请选择${config.label}`">
        </el-date-picker>
        <el-date-picker
                style="width: 100%"
                v-if="config.type==='datetime'"
                v-model="inputVal"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                :placeholder="`请选择${config.label}`">
        </el-date-picker>
        <div v-if="config.type==='dateRange'" class="time-range-class">
            <el-date-picker
                    style="width: 47%"
                    value-format="yyyy-MM-dd"
                    v-model="rangTime.startTime"
                    type="date"
                    :picker-options="pickerStartOptions"
                    placeholder="开始日期">
            </el-date-picker>
            <span style="margin: 0 4px">至</span>
            <el-date-picker
                    style="width: 47%"
                    value-format="yyyy-MM-dd"
                    v-model="rangTime.endTime"
                    type="date"
                    :picker-options="pickerEndOptions"
                    placeholder="结束日期">
            </el-date-picker>
        </div>
        <el-select
                v-if="config.type==='remote'"
                v-model="inputVal"
                :multiple="!!config.multiple"
                filterable
                remote
                clearable
                reserve-keyword
                :placeholder="`请选择${config.label}`"
                :remote-method="remoteMethod"
                :loading="loading">
            <el-option
                    v-for="item in remoteOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>


<script>
export default {
    name: 'inputContent',
    props: {
        config: {
            type: Object
        },
        value: {}
    },
    data() {
        return {
            loading: false,
            remoteOptions:[],
            searchList: [],
            inputVal: '',
            rangTime: {startTime: "", endTime: ''},
            pickerStartOptions: {
                disabledDate: time => {
                    if (this.rangTime.endTime) {
                        return time.getTime() > new Date(this.rangTime.endTime);
                    }
                }
            },
            pickerEndOptions: {
                disabledDate: time => {
                    if (this.rangTime.startTime) {
                        return time.getTime() < new Date(this.rangTime.startTime) - 24 * 40 * 60 * 1000;
                    }
                }
            }
        }
    },
    watch: {
        rangTime: {
            handler() {
                if (this.config.type === 'dateRange') {
                    this.$emit('update:value', {
                        [this.config.value[0]]: this.rangTime.startTime,
                        [this.config.value[1]]: this.rangTime.endTime
                    });
                }
            },
            deep: true
        },
        inputVal() {
            this.$emit('update:value', this.inputVal)
        },
        //父组件关闭的时候清空searchData清空 当前组件输入框也要清空
        value() {
            if (!this.value&&this.value!==0) {
                this.inputVal = '';
                this.rangTime = {startTime: "", endTime: ''}
            } else {
                this.inputVal = this.value;
            }
        }
    },
    methods:{
        remoteMethod(query){
            if (query !== '') {
                this.loading = true;
                this.config.remoteMethod(query).then(res=>{
                    if(this.config){
                        this.remoteOptions = this.config.dataProxy(res)
                    }else {
                        this.remoteOptions = res;
                    }
                    this.loading = false;
                })
            } else {
                this.remoteOptions = [];
            }
        },
        changeList(data){
            if (data.query) {
                data.list().then(res => {
                    this.searchList = res
                })
            } else {
                this.searchList = data.list;
            }
        },
        selectDataList(){
            if (this.config.type === 'select') {
                if (this.config.query) {
                    this.config.list().then(res => {
                        this.searchList = res
                    })
                } else {
                    this.searchList = this.config.list;
                }
            }
        },
        // dialog 点击确认后 跟新下拉数据
        upDataList(label){
            if(label.includes(this.config.label)){
                this.selectDataList();
            }
        }
    },
    mounted() {
        this.selectDataList();
    }
}
</script>

<style lang="scss" scoped>
.time-range-class {
    display: flex;
    justify-content: space-between
}
</style>

