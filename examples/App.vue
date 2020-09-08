<template>
    <div>
        <search-header
                ref="searchHeader"
                :btn-list="btnList"
                :input-list="inputList"
                :valid-rules="validRules"
                :revertConfig="{
                    class:'revert-class',
                    index:0
                }"
                :cache-proxy="cacheProxy"
                name="App">
        </search-header>
        <div style="margin-top:20px">
            {{searchData}}
        </div>
        <el-button @click="changeBtnShow"
                   type='danger'>动态改变第一个查询按钮显隐
        </el-button>
        <el-button @click="deleteLast"
                   type='danger'>删除最后一个input
        </el-button>
        <el-button @click="setDefault"
                   type='danger'>初始页面默认查询值
        </el-button>
        <el-button @click="changeBtnStatus('query_1')"
                   type='danger'>动态禁用查询_1按钮
        </el-button>
        <el-button @click="changeBtnStatus('import_2')"
                   type='danger'>动态禁用导出_2按钮
        </el-button>
    </div>
</template>

<script>

    export default {
        name: "App",
        data() {
            return {
                searchData: {},
                inputList: [
                    {
                        default: true,
                        label: '下拉框异步请求',
                        key: 'select_async',
                        type: 'select',
                        className:'test-class',
                        query: true,
                        list: async () => {
                            return [{label: '未送审', value: 1}, {label: '待审核', value: 2}];
                        }
                    },
                    {
                        default: true,
                        label: '始值',
                        key: 'aaa',
                        type: 'input',
                    },
                    {
                        label: '下拉2222222框初始值',
                        key: 'select',
                        type: 'select',
                        list: [{label: '未送审', value: '未送审'}, {label: '待审核', value: '待审核'}]
                    },
                    {
                        label: '输入框',
                        key: 'input',
                        type: 'input',
                    },
                    {
                        label: '日期选择',
                        key: 'dataPicker',
                        type: 'date',
                    },
                    {
                        label: '日期时间选择',
                        key: 'datetime',
                        type: 'datetime',
                    },
                    {
                        default: true,
                        label: '时间段选择',
                        key: 'dateRange',
                        type: 'dateRange',
                        value: ['parentStart', 'parentEnd']
                    },
                    {
                        label: '时间段选择2',
                        key: 'dateRange2',
                        type: 'dateRange',
                        value: ['parentStart_2', 'parentEnd_2']
                    },
                    {
                        type: 'cascade',
                        queryKey: 'label',//最后请求时用的key 查询时需要暴露出来的key
                        label: '地区',//作为选择筛选条件的label用
                        cascadeList: {
                            area: {
                                label: '区域',
                                key: 'area',
                                nextKey: 'provinces',
                                list: async () => {
                                    return [];
                                },
                            },
                            provinces: {
                                label: '省份',
                                key: 'provinces',
                                nextKey: 'city',
                                list: async () => {
                                    return [];
                                },
                            },
                            city: {
                                label: '城市',
                                key: 'city',
                                list: async () => {
                                    return [];
                                },
                            },
                        },
                    },
                ],
                validRules: {
                    input: [
                        {pattern: /^[\u4e00-\u9fa5]+$/, message: '请输入中文', trigger: 'change'}
                    ]
                },
                btnList: [
                    {
                        default: true,
                        label: '查询_1',
                        className: 'red-class',
                        type: 'primary',
                        key: 'query_1',
                        isSearch: true,
                        icon: 'el-icon-zoom-in',
                        show: true,
                        method: (param, data) => {
                            this.searchData = data;
                            console.log(data, param, '查询');
                        },
                    },
                    {
                        default: true,
                        label: '导出_1',
                        type: 'success',
                        key: 'import_1',
                        show: 0,
                        method: (param) => {
                            console.log(param, '导出_1');
                        },
                    },
                    {
                        label: '新增_1',
                        default: true,
                        icon: 'el-icon-plus',
                        type: 'success',
                        key: 'add_1',
                        show: 1,
                        method: (param) => {
                            console.log(param, '新增_1');
                        },
                    },
                    {
                        label: '查询_2',
                        key: 'query_2',
                        type: 'primary',
                        show: true,
                        method: (param) => {
                            console.log(param, '查询_2');
                        },
                    },
                    {
                        label: '导出_2',
                        type: 'success',
                        key: 'import_2',
                        method: (param) => {
                            console.log(param, '导出_2');
                        },
                    },
                    {
                        label: '新增_2',
                        type: 'success',
                        key: 'add_2',
                        show: () => {
                            return true
                        },
                        method: (param) => {
                            console.log(param, '新增_2');
                        },
                    },
                    {
                        isNewline:true,
                        label: '设置',
                        type: 'success',
                        key: 'setUp',
                        icon: 'el-icon-zoom-in',
                        show: () => {
                            return true
                        },
                        method: (param) => {
                            console.log(param, '设置');
                        },
                    },
                ],
                cacheProxy: {
                    without: true,
                    asyncGet: false,//如果为true get函数需要添加async 返回一个promise对象到子组件
                    get: () => {
                        return JSON.parse(localStorage.getItem('searchList_App'))
                    },
                    set: (data) => {
                        console.log(data);
                        localStorage.setItem(`searchList_App`, JSON.stringify(data));
                    }
                }
            }
        },
        methods: {
            deleteLast() {
                this.inputList.shift(0, 1);
                console.log(this.inputList);
            },
            changeBtnShow() {
                this.btnList[0].show = !this.btnList[0].show
            },
            setDefault(){
                this.$refs.searchHeader.setDefaultVal({'select_async':1,'aaa':'初始值初始值'})
            },
            changeBtnStatus(key){
                this.$refs.searchHeader.changeBtnStatus(key)
            },
        }
    };
</script>

<style lang="scss">
    .red-class {
        background: #2680D1 !important;
    }

    .revert-class {
        background-color: darkblue !important;
    }

    .test-class{
        color: red;
        border: 1px solid greenyellow;
    }
</style>
