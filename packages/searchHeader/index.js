// 导入组件，组件必须声明 name
import searchHeader from './src/searchHeader.vue'

// 为组件提供 install 安装方法，供按需引入
searchHeader.install = function (Vue) {
    Vue.component(searchHeader.name, searchHeader)
};

// 默认导出组件
export default searchHeader
