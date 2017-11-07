<template lang="html">
<div class="home-container">
  <el-row class="container">
    <!--顶部-->
    <el-col :span="24" class="header">
        <el-col :span="1" class="logo">
            <i class="el-icon-star-on"></i>
        </el-col>
        <el-col :span="10">{{collapsed?'':sysName}}</el-col>
        <el-col :span="4" class="userinfo">
            <el-dropdown trigger="hover">
                <span class="el-dropdown-link userinfo-inner">{{sysUserName}}</span>
                <el-dropdown-menu slot="dropdown" menu-align="end">
                    <el-dropdown-item>我的消息</el-dropdown-item>
                    <el-dropdown-item>设置</el-dropdown-item>
                    <el-dropdown-item divided @click.native="logoutFun">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
    </el-col>
    <el-col :span="24" class="main">
        <!--左侧导航-->
        <aside :class="{showSidebar:!collapsed}">
            <!--展开折叠开关-->
            <div class="menu-toggle" @click.prevent="collapseFun">
                <i class="el-icon-arrow-left" v-show="!collapsed"></i>
                <i class="el-icon-arrow-right" v-show="collapsed"></i>
            </div> 
            <!--导航菜单-->
            <el-menu default-active="0" router :collapse="collapsed">
            <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                <el-submenu v-if="item.children&&item.children.length>1" :index="index+''">
                    <template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
                    <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="!item.hidden"
                                    :class="$route.path==term.path?'is-active':''">
                        <i :class="term.iconCls"></i><span slot="title">{{term.name}}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-else-if="item.children&&item.children.length==1" :index="item.children[0].path"
                            :class="$route.path==item.children[0].path?'is-active':''">
                <i :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>
                </el-menu-item>
            </template>
            </el-menu>
        </aside>
        <!--右侧内容区域-->
        <section class="content-container">
            <el-col :span="24" class="breadcrumb-container">
                <strong class="title">{{$route.name}}</strong>
                <el-breadcrumb separator="/" class="breadcrumb-inner">
                    <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">{{ item.name }}</el-breadcrumb-item>
                </el-breadcrumb>
                </el-col>
                <el-col :span="24" class="content-wrapper">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </el-col>
        </section>
   </el-col>
 </el-row>
</div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            sysName: '系统',
            sysUserName: '',
            collapsed: false
        }
    },
    methods: {
        //折叠导航栏
        collapseFun: function() {
            this.collapsed = !this.collapsed;
        },
        showMenu(i, status){
          this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
        },
        //退出登录
        logoutFun: function() {
            var _this = this;
            this.$confirm('确认退出吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                sessionStorage.removeItem('user');
                _this.$router.push('/login');
            }).catch(() => {

            });
        },
    },
    mounted() {
        var user = sessionStorage.getItem('user');
        if (user) {
            user = JSON.parse(user);
            this.sysUserName = user.username || '';
        }
        console.log(this.$router.options.routes);
        // console.log(this.$route.path);
    }
}
</script>

<style scoped lang="scss">
.container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .header {
        height: 60px;
        line-height: 60px;
        background-color: #324157;
        color: #bfcbd9;
        .userinfo {
            text-align: right;
            padding-right: 35px;
            float: right;
            .userinfo-inner {
                cursor: pointer;
                color: #fff;
            }
        }
        .logo {
            height: 60px;
            padding-left: 20px;
        }
    }
    .main {
        display: flex;
        position: absolute;
        top: 60px;
        bottom: 0;
        overflow: hidden;
        aside {
            min-width: 60px;
            background: #eef1f6;
            &::-webkit-scrollbar {
                display: none;
            }
            &.showSidebar {
                overflow-x: hidden;
                overflow-y: auto;
                min-width: 180px;
            }
            .el-menu {
                width: 180px;
                height: 100%;
            }
            .el-menu--collapse {
                width: 60px;
                height: 100%;
            }
            .el-menu .el-menu-item, .el-submenu .el-submenu__title {
                height: 46px;
                line-height: 46px;
            }
        }
        .content-container {
            width: 100%;
            overflow-y: scroll;
            padding: 20px;
            .breadcrumb-container {
                padding: 12px 0;
                .title {
                    width: 200px;
                    float: left;
                    color: #475669;
                }
                .breadcrumb-inner {
                    float: right;
                }
            }
            .content-wrapper {
                background-color: #fff;
                box-sizing: border-box;
            }
        }
    }
    .menu-toggle {
      background: #4A5064;
      text-align: center;
      color: #bfcbd9;
      height: 50px;
      line-height: 50px;
      cursor: pointer;
    }
}
</style>