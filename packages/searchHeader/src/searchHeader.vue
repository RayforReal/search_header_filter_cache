<template>
    <div class="search-header">
        <div class="btn-container">
            <el-button v-for="item in allBtnList.showBtnList"
                       :key="item.key"
                       :size="btnSize"
                       :class="item.className||''"
                       @click="operationClick(item)"
                       :icon="item.icon||''"
                       :type='item.type'>{{item.label}}
            </el-button>
            <transition name="el-fade-in-linear">
                <el-button :size="btnSize"
                           v-show="showFiltrate&&revertBtnShow&&hasSearch"
                           @click="revert"
                           type='danger'>清空
                </el-button>
            </transition>
            <el-dropdown style="margin-left: 10px"
                         @command="handleCommand"
                         v-if="allBtnList.hiddenBtnList.length>0">
                <el-button :size="btnSize">
                    更多<i class="el-icon-arrow-down el-icon--right"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in allBtnList.hiddenBtnList"
                                      :command="item"
                                      :key="item.label">{{item.label}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <transition name="el-zoom-in-top">
            <el-form v-show="showFiltrate&&hasSearch"
                     ref="moreSearch"
                     class="form-container"
                     :model="searchData"
                     label-width="auto"
                     label-position="right"
                     :rules="validRules">
                <template v-for="item in defaultShowList">
                    <el-form-item
                            :label="item.label"
                            v-if="item.type!=='cascade'"
                            :prop="item.key"
                            :key="item.key">
                        <input-content
                                :config="item"
                                :value.sync="searchData[item.key]">
                        </input-content>
                    </el-form-item>
                    <template v-for="ele in cascadeList" v-else>
                        <el-form-item
                                :label="ele.label"
                                :prop="ele.key"
                                :key="ele.key">
                            <el-select v-model="searchData[ele.key]"
                                       :placeholder='`请选择${ele.label}`'
                                       value-key="value"
                                       style="width: 100%"
                                       @change="cascadeChange(ele)"
                                       clearable>
                                <el-option v-for="item in cascadeSelectList[ele.key]" :key="item.value"
                                           :value="{label:item.label,value:item.value}"
                                           :label="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </template>
            </el-form>
        </transition>
        <div class="filter-container" v-show="hasSearch">
            <div @click="showFiltrate=!showFiltrate">
                <span :style="{'color':showFiltrate?'#2680D1':''}">筛选</span>
                <img :src="showFiltrate?onFilter:offFilter" alt="">
            </div>
            <div @click="filterDialogShow=true">
                <span>增加过滤条件</span>
                <img src="./icon/add.png" alt="">
            </div>
        </div>
        <filter-dialog
                :name="name"
                :cache-list="cacheList"
                @checkedInput="checkedInput"
                :input-list="propInputList"
                :vis.sync="filterDialogShow">
        </filter-dialog>
    </div>
</template>

<script>
    import inputContent from './inputContent'
    import filterDialog from "./filterDialog";

    export default {
        name: "searchHeader",
        components: {inputContent, filterDialog},
        data() {
            return {
                cacheList: [],
                onFilter: require('./icon/onFilter.png'),
                offFilter: require('./icon/offFilter.png'),
                filterDialogShow: false,
                searchData: {},
                showFiltrate: true,
                revertBtnShow: false,
                cascadeList: [],
                cascadeSelectList: {},
                defaultShowList: [],
                propInputList: [],
            }
        },
        props: {
            cacheProxy: {
                type: Object,
                default: () => {
                    return {
                        without: false
                    }
                }
            },
            btnSize: {
                type: String,
                default: 'mini'
            },
            name: {
                type: String,
                required: true
            },
            validRules: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            btnList: {
                type: Array,
                default: () => {
                    return []
                }
            },
            inputList: {
                type: Array,
                default: () => {
                    return []
                }
            },
        },
        watch: {
            //没有输入框的时候清空按钮不显示
            'defaultShowList.length': {
                handler(newValue) {
                    this.revertBtnShow = newValue !== 0
                }
            },
            filterDialogShow() {
                if (!this.filterDialogShow) {
                    this.dialogInputInit();
                }
            }
        },
        created() {
            this.dialogInputInit();
            this.cascadeInit();
        },
        computed: {
            hasSearch() {
                let search = this.btnList.filter(item => {
                    return item.isSearch
                });
                if (search && search.length === 1) {
                    return this.checkPropShow(search[0].show)
                }
                return false;
            },
            allBtnList() {
                let arr = {
                    showBtnList: [],
                    hiddenBtnList: []
                };
                this.btnList.forEach(item => {
                    (item.default && this.checkPropShow(item.show)) && arr.showBtnList.push(item);
                    (!item.default && this.checkPropShow(item.show)) && (arr.hiddenBtnList.push(item))
                });
                return arr
            },
        },
        methods: {
            checkPropShow(show) {
                if (typeof (show) === "function") {
                    return show();
                }
                if (typeof (show) === "boolean" || typeof (show) === "number") {
                    return show;
                }
                //默认不传show字段为显示
                return typeof (show) === "undefined";
            },
            dialogInputInit() {
                this.propInputList = this.inputList;
                this.defaultShowList = [];
                let list = {};
                if (this.cacheProxy.without) {
                    if (this.cacheProxy.asyncGet) {
                        this.cacheProxy.get().then(res => {
                            list = res;
                        });
                    } else {
                        list = this.cacheProxy.get();
                    }
                } else {
                    list = JSON.parse(localStorage.getItem(`searchList_${this.name}`));
                }
                if (list) {
                    this.cacheList = list;
                    this.propInputList.forEach(e => {
                        //先全部设成false 有缓存的再设成true
                        //有缓存说明和list代码设的default属性无关
                        e.default = false;
                    });
                    //list 必须在最外层 顺序
                    list.forEach(item => {
                        this.propInputList.forEach(e => {
                            if (item === e.label) {
                                e.default = true;
                                this.defaultShowList.push(e);
                            }
                        });
                    });
                } else {
                    this.defaultShowList = this.inputList.filter(item => {
                        return item.default
                    });
                }
            },
            cascadeInit() {
                let vm = this;
                this.defaultShowList.forEach(item => {
                    if (item.type === 'cascade') {
                        vm.cascadeList = [];
                        Object.values(item.cascadeList).forEach((e, index) => {
                            vm.cascadeSelectList[e.key] = [];
                            vm.cascadeList.push(e);
                            if (index === 0) {
                                e.list().then(res => {
                                    vm.cascadeSelectList[e.key] = res;
                                    vm.$forceUpdate();
                                })
                            }
                        });
                    }
                });
            },
            handleCommand({method, key}) {
                method(key);
            },
            checkedInput(list) {
                this.defaultShowList = [];
                list.forEach(item => {
                    this.inputList.forEach(e => {
                        if (item === e.label) {
                            this.defaultShowList.push(e);
                        }
                    });
                });
                this.cascadeInit();
                this.searchData = {};
                if (this.cacheProxy.without) {
                    this.cacheProxy.set(list);
                } else {
                    localStorage.setItem(`searchList_${this.name}`, JSON.stringify(list));
                }
            },
            //清空
            revert() {
                this.searchData = {};
            },
            cascadeChange(ele) {
                // 级联最后一个不再请求数据
                if (!ele.nextKey) {
                    this.$forceUpdate();
                    return;
                }
                //清空 除了当前项 后面的级联选择框值和下拉列表值都需要清空
                let keys = Object.keys(this.defaultShowList.filter(item => {
                    return item.type === 'cascade'
                })[0].cascadeList);
                let currentIndex = keys.indexOf(ele.key);
                for (let i = currentIndex + 1; i < keys.length; i++) {
                    this.cascadeSelectList[keys[i]] = [];
                    this.searchData[keys[i]] = '';
                }
                let vm = this;
                let data = this.cascadeList.filter(item => {
                    return ele.nextKey === item.key;
                })[0];
                data.list(this.searchData[ele.key].value).then(res => {
                    vm.$set(vm.cascadeSelectList, data.key, res);
                    vm.$forceUpdate();
                })
            },
            //按钮点击事件
            operationClick(data) {
                //查询按钮事件需要把参数暴露出去
                if (data.isSearch) {
                    let params = window.JSON.parse(window.JSON.stringify(this.searchData));
                    //级联数据传出去之前处理
                    let cascadeList = this.defaultShowList.filter(item => {
                        return item.type === 'cascade'
                    });
                    //有可能不止一个级联
                    if (cascadeList.length > 0) {
                        cascadeList.forEach(item => {
                            //级联最后暴露出去属性值默认取value字段
                            let queryKey = item.queryKey || 'value';
                            let keys = Object.keys(item.cascadeList);
                            keys.forEach(el => {
                                if (params[el]) {
                                    params[el] = params[el][queryKey];
                                }
                            })
                        });
                    }
                    //事件段数据处理
                    let timeRangeList = this.defaultShowList.filter(item => {
                        return item.type === 'dateRange'
                    });
                    //有可能不止一个时间段选择
                    if (timeRangeList.length > 0) {
                        timeRangeList.forEach(item => {
                            params = {...params, ...params[item.key]};
                            delete params[item.key];
                        })
                    }
                    data.method(data.key, this.clearObject(params));
                } else {
                    data.method(data.key);
                }
            },
            clearObject(obj) {
                for (const key in obj) {
                    if (typeof obj[key] != 'number' && !obj[key]) {
                        delete obj[key]
                    }
                }
                return obj
            }
        }
    }
</script>

<style scoped lang='scss'>
    .search-header {
        .form-container {
            display: flex;
            flex-wrap: wrap;
            margin: 15px 0;

            /deep/ .el-form-item {
                width: 30%;
                margin: 5px 3% 15px 0;

                .el-form-item__label {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }

        .btn-container {
            text-align: right;

            /deep/ .el-button + .el-button {
                margin-left: 8px;
            }
        }

        .filter-container {
            font-size: 14px;
            display: flex;

            div {
                cursor: pointer;
                display: flex;
                align-items: center;
                margin-right: 20px;

                span {
                    margin-right: 5px;
                }
            }

        }
    }
</style>
