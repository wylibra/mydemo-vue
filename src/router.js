import Vue from "vue"
import VueRouter from "vue-router"

// 引入组件
import login from './page/login.vue'
import home from './page/home.vue'
import notFound from './page/404.vue'
import cascader from './page/form/cascader.vue'
import menutable from './page/menu2/menuTable.vue'

// 使用vueRouter
Vue.use(VueRouter);

let routes =[{
	path: '/login',
	component: login,
	name: '',
	hidden: true
},
{
	path: '/404',
	component: notFound,
	name: '',
	hidden: true
},
{
	path: '/',
	component: home,
	name: 'form',
	iconCls: 'el-icon-message', // 图标样式class
	children: [{
		path: '/cascader',
		component: cascader,
		name: '级联选择器'
	}]
},
{
	path: '/',
    component: home,
    name: '表格',
    iconCls: 'el-icon-menu',
    children: [{
            path: '/menutable',
            component: menutable,
            name: '表格示例'
        }
    ]
},
{
	path: '/',
    component: home,
    name: '图表',
    iconCls: 'el-icon-picture',
    children: [{
            path: '/cascader',
            component: cascader,
            name: 'echarts图表示例'
        },
        {
            path: '/cascader',
            component: cascader,
            name: 'echarts图表示例'
        }
    ]
},
{
	path: '/menutable',
    component: home,
    name: '设置',
    iconCls: 'el-icon-setting',
    children: [{
            path: '/menutable',
            component: menutable,
            name: '个人信息'
        }
    ]
}];
const router = new VueRouter({
	routes
})
export default router;