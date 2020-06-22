<template>
    <el-dialog
            title="增加过滤条件"
            :visible.sync="vis"
            :before-close="close"
            width="50%">
        <div class="check-box">
            <div>
                <h4 class="after-class">字段信息</h4>
                <div>
                    <el-checkbox :indeterminate="isIndeterminate"
                                 v-model="checkAll"
                                 @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <div style="margin: 10px 0;"></div>
                    <el-checkbox-group v-model="checkedInput"
                                       @change="handleCheckedInputsChange">
                        <el-checkbox v-for="item in inputList"
                                     :label="item.label"
                                     :key="item.key">{{item.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div>
                <h4 class="after-class">当前所选条件</h4>
                <draggable :list="checkedInput"
                           @start="draggingStart"
                           @end="dragging = false">
                    <transition-group tag="ul" class="ul-class">
                        <li v-for="(item,index) in checkedInput"
                            :style="{'background':dragging&&index===dragIndex?'#c1def9':'#e7f3fd'}"
                            :key="item">
                            <img src="./icon/drag.png" alt="">
                            <span style="cursor: move;color:#2680D1">{{item}}</span>
                            <i style="color: #2680D1" @click='deleteChecked(index)' class="el-icon-close"/>
                        </li>
                    </transition-group>
                </draggable>
            </div>
        </div>
        <div slot="footer" style="text-align: center">
            <el-button type="success" :size="btnSize" @click="query">确定</el-button>
            <el-button :size="btnSize" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import draggable from 'vuedraggable';

    export default {
        name: "filterDialog",
        components: {draggable},
        props: {
            cacheList:{
                type:Array
            },
            vis: {
                type: Boolean
            },
            btnSize: {
                type: String,
                default: 'mini'
            },
            inputList: {
                type: Array,
                default: () => {
                    return []
                }
            },
            name: {
                type: String,
                required: true
            },
        },
        data() {
            return {
                dragging: false,
                dragIndex: 0,
                checkAll: false,
                checkedInput: [],
                isIndeterminate: false
            }
        },
        watch: {
            vis() {
                if (this.vis) {
                    let count = 0;
                    //是否已经有缓存 有缓存半选状态逻辑可以通过缓存数据判断
                    //有缓存 就是有序
                    if (this.cacheList) {
                        count = this.cacheList.length;
                        this.checkedInput = this.cacheList;
                    } else {
                        this.inputList.forEach(item => {
                            if (item.default) {
                                count++;
                                this.checkedInput.push(item.label);
                            }
                        });

                    }
                    this.isIndeterminate = count > 0 && count < this.inputList.length;
                    this.checkAll = count === this.inputList.length;
                }
            }
        },
        methods: {
            draggingStart(e) {
                this.dragging = true;
                this.dragIndex = e.oldIndex;
            },
            handleCheckAllChange(val) {
                if (val) {
                    this.inputList.forEach(item => {
                        this.checkedInput.push(item.label);
                    });
                } else {
                    this.checkedInput = []
                }
                this.checkedInput = Array.from(new Set(this.checkedInput));//去重
                this.isIndeterminate = false;
            },
            handleCheckedInputsChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.inputList.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.inputList.length;
            },
            deleteChecked(index) {
                this.checkedInput.splice(index, 1);
                this.handleCheckedInputsChange(this.checkedInput);
            },
            query() {
                this.$emit('checkedInput', this.checkedInput);
                this.close();
            },
            close() {
                this.$emit("update:vis", false);
                this.dragging = false;
                this.dragIndex = 0;
                this.checkAll = false;
                this.checkedInput = [];
                this.isIndeterminate = false;
            },
        }
    }
</script>

<style scoped lang='scss'>
    .check-box {
        padding-left: 15px;

        .after-class {
            position: relative;
            color: #0f76c0;
            margin-bottom: 15px;

            &::before {
                content: "";
                display: block;
                width: 4px;
                height: 100%;
                background-color: #0f76c0;
                position: absolute;
                left: -15px;
            }
        }

        .ul-class {
            display: flex;
            flex-wrap: wrap;
            padding-left: 0;

            li {
                list-style: none;
                cursor: pointer;
                border: 1px solid #ADD8FF;
                border-radius: 4px;
                margin-right: 10px;
                padding: 3px 8px;
                margin-top: 10px;
                opacity: 0.8;
            }
        }

        /deep/ .el-checkbox {
            margin-bottom: 10px;
            display: inline-flex;
            align-items: center;
            width: 26%;

            .el-checkbox__label {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
</style>
