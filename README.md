### 列表页面搜索头请求封装组件
>基于element-ui开发
>
>github地址   https://github.com/BalotT/search_header_filter_cache.git

### 安装
        npm install search_header_filter_cache -S
        
### 使用

    在main.js中 引入并且注册
    #main.js
    import searchHeader from 'search_header_filter_cache'
    import 'search_header_filter_cache/lib/searchHeader.css'
    Vue.use(searchHeader);

  # 父组件使用

``` 
    <search-header
        :btn-list="btnList"
        :input-list="inputList"
        :valid-rules="validRules"
        :cache-proxy="cacheProxy"
         name="****">
    </search-header>
```
   ## name （当前页面name值）
    必须为全局唯一值，用作缓存用户所选输入框习惯，存在localStorage,属性名取名规则为 searchList_${name} 
 

  ## cacheProxy （记录用户习惯的方法合集）

        cacheProxy:{
            without:true, //如果在父组件定义存取方法设为true
            asyncGet:false,//如果为true get函数需要添加async 返回一个promise对象到子组件
            get: ()=>{
                return JSON.parse(localStorage.getItem('****'))//模拟外部取值
            },
            set:(data)=>{
                console.log(data);
                localStorage.setItem(`****`, JSON.stringify(data));
            }
        }


 ## inputList  （所有支持的搜索条件输入框）

``` 
        inputList: [
            {
                default:true,
                label: '下拉框异步请求',
                key: 'select_async',
                type: 'select',
                query: true,
                list: async () => {
                    let data = [];
                    let res = await fetch(‘**/**’);
                    if (res.code === 1) {
                        data = res.data.map(item => {
                            return {
                                label: item,
                                value: item
                            }
                        });
                    }
                    return data;
                }
            },
            {
                label: '下拉框初始值',
                key: 'select',
                type: 'select',
                list: [
                    {label: '未送审', value: '未送审'}, 
                    {label: '待审核', value: '待审核'}
                ]
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
                label: '时间段选择',
                key: 'parent',
                type: 'dateRange',
                value: ['parentStart', 'parentEnd']
            },
            {
                type: 'cascade',
                queryKey: 'label',//最后请求时用的key 查询时需要暴露出来的key
                label:'地区',//作为选择筛选条件的label用
                cascadeList: {
                    area: {
                        label: '区域',
                        key: 'area',
                        nextKey: 'provinces',
                        list: async () => {
                            let data = [];
                            let res = await fetch(‘**/**’);
                            if (res.code === 1) {
                                data = res.data.map(item => {
                                    return {
                                        value: item.layer, 
                                        label: item.name
                                    }
                                });
                            }
                            return data;
                        },
                    },
                    provinces: {
                        label: '省份',
                        key: 'provinces',
                        list: async (param) => {
                            let data = [];
                            let res = await fetch("**/**" + param);
                            if (res.code === 1) {
                                data = res.data.map(item => {
                                    return {
                                        value: item.layer, 
                                        label: item.name
                                    }
                                });
                            }
                            return data;
                        },
                    }
                },
            },
        ]
```

| 参数  | 说明                                        | 类型           | 可选值        | 默认值 |
|-------|---------------------------------------------|----------------|--------------|-------|
| default   | 初始化时需要默认展示的输入框                               | boolean              | -            | false     |
| type  | 输入框类型                                   | string         | select/input/date/datetime/dateRange/cascade | input |
| key  | 输入框值的属性名                                  | string         | - | - |
| value  | type为‘dateRange’选择时间段必填，数组第一个字符串为查询暴露出去的开始时间属性名，第二个为结束时间属性名  | array         | - | - |
| query | 下拉数据是否是异步请求，若为true，list必须为回调请求函数 | boolean        | -            | false |
| list  | type为select时必填， 若为请求函数，函数体最后必须返回data 返回值为对象数组{label:'', value:''}               | function/array | -            | -     |
| label  |标签文本               | string | -            | -     |
| queryKey  | 级联选值最后取值的属性名               | string | value/label            | value     |
| cascadeList  | type为cascade时必填，级联对象 , | object(键值对) | -            | -     |
| cascadeList—label  | 标签文本              | string | -            | -     |
| cascadeList—key  | 级联取值查询时属性名              | string | -            | -     |
|  cascadeList—nextKey  | 当前选项选值后关联的下一个下拉列表值的key | string |-            | -     |
|  cascadeList—list   | 异步请求函数，最后必须返回data 返回值为对象数组{label:'', value:''} ，回调参数为关联的上一级传下来的value字段的值             | function | -            | -     |

--- 

## btnList（所有操作按钮）

``` 
    btnList: [
        {
            default: true,
            label: '查询',
            type: 'primary',
            key: 'query',
            className:'red-class',//定义在全局的class名
            isSearch:true,
            icon: 'el-icon-zoom-in',
            show: () => {
                return true
            },
            method: (data,param) => {
                console.log(data,param, '查询');
            },
        },
        {
            label: '新增',
            type: 'success',
            key: 'add',
            show: 0,
            method: (param) => {
                console.log(param, '新增');
            },
        }，
         {
            label: '导出',
            type: 'success',
            key: 'import',
            show: 1,
            method: (param) => {
                console.log(param, '导出');
            },
        },
        {
            label: '多选',
            type: 'success',
            key: 'select',
            show: true,
            method: (param) => {
                console.log(param, '多选');
            },
        },
    ],


        //定义在全局的class 按钮样式覆盖
        <style lang="scss" >
        .red-class{
             color: red !important;
        }
        </style>
```

| 参数       | 说明               | 类型   | 可选值 | 默认值 |
|------------|--------------------|--------|-------|-------|
| default | 需要默认展示的按钮 | boolean | -     | false     |
| label | 标签文本       | string | -     | -     |
| className | 按钮样式覆盖的全局class名       | string | -     | -     |
| type | 按钮类型(同element-ui)       | string | -     | -     |
| isSearch | 控制点击按钮后回调参数是否有搜索条件       | boolean | -     | false     |
| icon | 图标class名(同element-ui)，default属性为true时生效       | string | -     | -     |
|key | 按钮唯一值，点击按钮后回调的参数       | string | -     | -     |
|show | 根据权限需求判断是否显示按钮       | function/boolean/string | -     | true     |
|method | 按钮点时的回调，第一个参数为点击按钮的key，isSearch为true时会有第二个参数为输入框所有值      | string | -     | -     |

--- 
## validRules（搜索框表单校验规则,同element-ui）

```
validRules: {
    //属性名对应inputList中的key
    input: [
        {pattern: /^[\u4e00-\u9fa5]+$/, message: '请输入中文', trigger: 'change'}
    ]
},
```



    
        
