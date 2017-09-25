<<template>
  <div class="login-page-container">
    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3>系统登录</h3>
        <el-form-item prop="userName">
            <el-input type="text" v-model="loginForm.userName" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="userPass">
            <el-input type="password" v-model="loginForm.userPass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click="loginSubmit('loginForm')" :loading="logining">登录</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<<script>
export default {
  props: {

  },
  data() {
      return {
          logining: false,
          loginForm: {
              userName: 'admin',
              userPass: 'admin'
          },
          rules: {
               userName: [{
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                }],
                userPass: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }]
          },
          checked: true
      }
  },
  methods: {
      loginSubmit(formName) {
          var _this = this;
          _this.$refs[formName].validate((valid) => {
              if (valid) {
                  _this.logining = true;
                  var loginParams = {
                      username: _this.loginForm.userName,
                      userpass: _this.loginForm.userPass,
                  };
                  if (loginParams.username == 'admin' && loginParams.userpass == 'admin') {
                      _this.logining = false;
                      sessionStorage.setItem('user', JSON.stringify(loginParams));
                      _this.$router.push({path: '/cascader'});
                  } else {
                      _this.logining = false;
                      _this.$alert('用户名或密码错误！', '提示信息', {confirmButtonText: '确定'});
                  }
              } else {
                console.log('error submit!!');
                return false;
              }
          });
      }
  }
}
</script>
<style scoped lang="scss">
.login-page-container {
    background: #373552;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px;
        background: #fff;
        border: 1px solid #eaeaea;
    }
}
label.el-checkbox.remember {
    margin: 0px 0px 35px 0px;
}
</style>
