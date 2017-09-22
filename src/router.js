import Vue from "vue"
import VueRouter from "vue-router"

// 引入组件
import login from './page/login.vue'
import home from './page/home.vue'
import notFound from './page/404.vue'
import menutab from './page/menu1/menuTab.vue'
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
	name: '导航一',
	iconCls: 'el-icon-message', // 图标样式class
	children: [{
		path: '/menutab',
		component: menutab,
		name: 'Tab'
	}]
},
{
	path: '/',
    component: home,
    name: '导航二',
    iconCls: 'el-icon-message',
    children: [{
            path: '/menutable',
            component: menutable,
            name: 'Table1'
        },{
            path: '/menutable',
            component: menutable,
            name: 'Table2'
        },{
            path: '/menutable',
            component: menutable,
            name: 'Table3'
        }
    ]
},
{
	path: '/',
    component: home,
    name: '设置',
    iconCls: 'el-icon-message',
    children: [{
            path: '/menutable',
            component: menutable,
            name: 'Table4'
        }
    ]
},
{
	path: '/menutable',
	component: menutable,
	name: '菜单',
	iconCls: 'el-icon-message',
}];
const router = new VueRouter({
	routes
})
export default router;