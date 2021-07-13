```
<template>

  <div class="login">

    <div class="form-container">

   <el-form :model="loginForm" :rules="loginFormRules" ref="loginForm">

​    <!--logo-->

​    <el-form-item>

          <div class="logo">

​      <!-- <img src="../../assets/images/login-logo.png"> -->

​      <h2>{{ $config.title }}</h2>

            <p>欢迎，请登录！</p>

​     </div>

​    </el-form-item>

​    <!--user name-->

​    <el-form-item prop="username">

​     <el-input

​      size="large"

​      placeholder="账号"

​      v-model.trim="loginForm.username"

​      @keyup.enter.native="doLogin"

​     \>

​      <i slot="prepend" class="el-icon-user"></i>

​      <!-- <i slot="prepend" class="fa fa-user"></i> -->

​     </el-input>

​    </el-form-item>

​    <!--password-->

​    <el-form-item prop="password">

​     <el-input

​      size="large"

​      type="password"

​      placeholder="密码"

​      v-model="loginForm.password"

​      @keyup.enter.native="doLogin"

​      auto-complete="off"

​     \>

​      <i slot="prepend" class="el-icon-lock"></i>

​      <!-- <i slot="prepend" class="fa fa-lock"></i> -->

​     </el-input>

​    </el-form-item>

​    <!-- Verification Code -->

​    <!-- <el-form-item prop="verifyCode" class="verificationcode-container">

​     <el-input

​      size="large"

​      class="verificationcode-input-box"

​      placeholder="Captcha"

​      v-model="loginForm.verifyCode"

​      @keyup.enter.native="doLogin"

​     \></el-input>

           <div class="verificationcode-img-box">

            <img @click="handleGetCaptcha" :src="captchaUrl">

​     </div>

​    </el-form-item>-->

​    <!--remember me-->

​    <el-form-item>

​     <el-checkbox v-model="rememberMe">记住账号</el-checkbox>

​    </el-form-item>

​    <!--login button-->

​    <el-form-item>

​     <el-button

​      type="primary"

​      class="btn-submit"

​      size="large"

​      :loading="loading"

​      @click="submitForm('loginForm')"

​      \>登 录</el-button

​     \>

​    </el-form-item>

   </el-form>

  </div>

 </div>

</template>



<script>

// import menu from "@/router/menu";

var host = window.location.host;

var protocol = window.location.protocol;

var base = "";

if (process.env.NODE_ENV === "development") {

 base = "";

} else {

 base = "/html";

}

export default {

 name: "Login",

 data() {

  // eslint-disable-next-line

  var validateEmail = (rule, value, callback) => {

   if (!value) {

​    callback(new Error("必填"));

   } else {

​    var reg3 = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+.([a-zA-Z])+$/;

​    if (reg3.test(this.loginForm.username)) {

​     if (this.loginForm.username.length > 100) {

​      callback(new Error("电子邮件不能超过100个字符"));

​     } else {

​      callback();

​     }

​    } else {

​     callback(new Error("请输入电子邮件"));

​    }

   }

  };

  var validatePass = (rule, value, callback) => {

   if (value === "") {

​    callback(new Error("必填"));

   } else if (value.length < 6) {

​    callback(new Error("密码长度不小于6个字符"));

   } else {

​    callback();

   }

  };

  return {

   loginForm: {

​    username: "",

​    password: "",

​    verifyCode: ""

   },

   captchaUrl: "",

   rememberMe: false,

   loginFormRules: {

​    username: [

​     {

​      // validator: validateEmail,

​      required: true,

​      message: "必填",

​      trigger: "blur"

​     }

​    ],

​    password: [

​     {

​      validator: validatePass,

​      trigger: "blur"

​     }

​    ],

​    verifyCode: [

​     {

​      required: true,

​      message: "必填",

​      trigger: "blur"

​     }

​    ]

   },

   loading: false,

   withoutPassword: false,

   wroute: {

​    id: "",

​    name: ""

   }

  };

 },

 mounted() {

  var url = window.location.toString(); //获取url地址



  var urlParmStr = url.slice(url.indexOf("?") + 1); //获取问号后所有的字符串



  var arr = urlParmStr.split("&"); //通过&符号将字符串分割转成数组

  var mm = arr[0]; //获取数组中第一个参数

  var wid = arr[1]; //第二个参数

  var wname = arr[2]; //第三个参数

  wid = decodeURI(wid); //转码将解码方式unscape换为decodeURI，将中文参数获取

  wname = decodeURI(wname); //转码将解码方式unscape换为decodeURI，将中文参数获取

  var arr2 = wname.split("#");

  wname = arr2[0];

  var str = "tiamaes-tmsp-without-password";



  this.wroute.id = wid;

  this.wroute.name = wname;

  if (mm == str) {

   this.loginForm.username = "charge";

   this.loginForm.password = "123456";

   this.withoutPassword = true;



   this.doLogin();

  }

  // 在login发送所有请求之前，清掉 sessionStorage 里的用户信息，因为登录之前是没有 token 的。

  localStorage.removeItem("loginUserBaseInfo"); //这里不能用 sessionStorage, 如果把url复制到浏览器新的tab页中，因为不是一个session，所以不能共享 sessionStorage

  // sessionStorage.removeItem("menuList"); //应该会出现上边同样的问题，用 localStorage 可以同网站不同的浏览器tab共享数据



  //获取验证码

  // this.handleGetCaptcha();



  //在这里把 localstorage 的用户名放到用户名的input里；并且如果用户有存用户名，那么“记住账号”就勾上

  let username = localStorage.getItem("bustrip-operation-admin");

  if (!username) return;

  this.loginForm.username = username;

  this.rememberMe = true;

 },

 methods: {

  handleGetCaptcha() {

   //获取验证码

   this.captchaUrl = `${this.captchaURL}?t=${Date.now()}`;



   /* // 下边是 Ajax 的方法

   this.$http({

​    method: "get",

​    url: this.api.getCaptcha

   }).then(res => {

​    this.captchaUrl = res.captchaUrl;

   }); */

  },

  doLogin() {

   this.submitForm("loginForm");

  },

  submitForm(formName) {

   this.$refs[formName].validate(valid => {

​    if (valid) {

​     this.loading = true;



​     let params = { ...this.loginForm };

​     params.loginUrl = this.loginURL;



​     this.$store

​      .dispatch("LoginByUsername", params)

​      .then(() => {

​       // 如果Remember me, 保存用户名

​       if (this.rememberMe) {

​        localStorage.setItem(

​         "bustrip-operation-admin",

​         this.loginForm.username

​        );

​       } else {

​        localStorage.removeItem("bustrip-operation-admin");

​       }



​       if (this.withoutPassword) {

​        window.location.search = "";



​        let { id, name } = this.wroute;

​        console.log("this.wroute; :>> ", this.wroute);

​        this.$store.commit("SET_SYSTEM_INFO", {

​         id,

​         name

​        });

​        localStorage.setItem("systemId", this.wroute.id);

​        this.$router.push({

​         path: "/"

​        });

​       } else {

​        this.$router.push({ path: "/home" });

​       }

​       //把用户基础信息存到 sessionStorage 里

​       let userinfo = {

​        username: this.loginForm.username

​        // id: res.admin.id,

​        // token: res.admin.token, //验证用户合法性的token，目前后端没做验证，所以这个字段暂时没用

​        // expire: res.admin.expire || "5525427687", //token过期时间（token 用于用户鉴权，请求头的 Authorization 需要后端支持，否则会请求两次）

​        // roleId: res.admin.roleId //用户组id，1：超级管理员；2：普通用户

​       };

​       localStorage.setItem(

​        "loginUserBaseInfo",

​        JSON.stringify(userinfo)

​       );

​       this.loading = false;

​      })

​      .catch(() => {

​       this.loading = false;

​      });

​    } else {

​     return false;

​    }

   });

  },

  submitFormOriginal(formName) {

   this.$refs[formName].validate(valid => {

​    if (valid) {

​     let param = {

​      accountName: this.loginForm.username,

​      password: this.loginForm.password

​      // verifyCode: this.loginForm.verifyCode,

​     };



​     // 登录

​     this.$http({

​      method: "post",

​      url: this.api.doLogin,

​      data: param

​     }).then(res => {

​      res = res.data;

​      if (res.success === true) {

​       // 如果Remember me, 保存用户名

​       if (this.rememberMe) {

​        localStorage.setItem(

​         "bustrip-operation-admin",

​         this.loginForm.username

​        );

​       } else {

​        localStorage.removeItem("bustrip-operation-admin");

​       }



​       //把用户基础信息存到sessionStorage里

​       let userinfo = {

​        username: this.loginForm.username,

​        id: res.admin.id,

​        token: res.admin.token, //验证用户合法性的token，目前后端没做验证，所以这个字段暂时没用

​        expire: res.admin.expire || "5525427687", //token过期时间（token 用于用户鉴权，请求头的 Authorization 需要后端支持，否则会请求两次）

​        roleId: res.admin.roleId //用户组id，1：超级管理员；2：普通用户

​        // state: res.admin.state //state 代表：1.未绑定；2.正常；3.禁用；在运营端没用

​       };

​       localStorage.setItem(

​        "loginUserBaseInfo",

​        JSON.stringify(userinfo)

​       );



​       // 获取用户权限列表

​       let param = {

​        id: res.admin.id

​       };



​       this.$http({

​        method: "post",

​        url: this.api.userInfo,

​        data: param

​       }).then(res => {

​        res = res.data;

​        if (res.success === true) {

​         // 把 res.admin.menuList 存到sessionStorage里，便于在刷新页面的时候重新配置路由

​         sessionStorage.setItem(

​          "menuList",

​          JSON.stringify(res.admin.menuList)

​         );



​         // 根据 res.admin.menuList 处理路由

​         // let dynamicRoute = menu.mergeRoutes(res.admin.menuList);

​         // 手动初始化vue应用中的路由规则，vue-router 中有自己独立的路由规则。

​         // this.initRouterRule(dynamicRoute);



​         //跳转到对应的平台

​         this.$router.push({

​          name: "operation"

​         });

​        }

​       });

​      } else {

​       // this.handleGetCaptcha();

​       this.$message({

​        message: "用户名或密码错误",

​        type: "error"

​       });

​      }

​     });

​    } else {

​     return false;

​    }

   });

  }

 }

};

</script>



<style lang="scss">

.login {

 width: 100vw;

 height: 100vh;

 position: relative;

 overflow: hidden;

 background: url(../../assets/images/login-bg.jpg) no-repeat center;

 background-size: cover;

 .el-input__inner {

  background-color: #2e3958;

  border-color: #2e3958;

  color: #fff;

 }

 input:-webkit-autofill,

 textarea:-webkit-autofill,

 select:-webkit-autofill {

  -webkit-text-fill-color: #fff;

  caret-color: #fff;

 }



 input:-webkit-autofill {

  box-shadow: 0px 0 3px 100px #2e3958 inset; //背景色

 }

 .form-container {

  box-sizing: border-box;

  width: 460px;

  height: 454px;

  padding: 55px 60px 0;

  position: absolute;

  left: 0;

  right: 0;

  top: 0;

  bottom: 0;

  margin: auto;

  border-radius: 5px;

  background: url(../../assets/images/decorative-line.png) no-repeat left -7px

   \#212942;

  & > .el-form {

   .logo {

​    // height: 45px;

​    height: 100px;

​    text-align: center;

​    display: flex;

​    flex-direction: column;

​    justify-content: space-around;

​    // color: #4f7eee;

​    h2 {

​     color: #409eff;

​     font-size: 28px;

​     font-weight: 400;

​     margin: 0;

​     padding: 0;

​    }

​    p {

​     color: #fff;

​     font-size: 16px;

​    }

   }

   .verificationcode-container {

​    .verificationcode-input-box {

​     width: 180px;

​     float: left;

​     input {

​      padding-left: 20px;

​     }

​    }

​    .verificationcode-img-box {

​     float: right;

​     line-height: 0;

​     border-radius: 4px;

​     overflow: hidden;

​     cursor: pointer;

​     img {

​      width: 140px;

​      height: 40px;

​     }

​    }

   }

   .el-checkbox {

​    .el-checkbox__input {

​     &.is-checked {

​      .el-checkbox__inner {

​       background: #409eff;

​       border-color: #409eff;

​      }

​     }

​     &.is-focus {

​      .el-checkbox__inner {

​       border-color: #7c7de4;

​      }

​     }

​    }

​    .el-checkbox__label {

​     font-size: 14px;

​     color: #fff;

​    }

   }

   .el-input-group__prepend {

​    padding: 0 11px;

​    font-size: 18px;

​    background-color: #2e3958;

​    border-color: #2e3958;

   }

   .btn-submit {

​    width: 100%;

​    font-weight: bold;

​    font-size: 16px;

   }

  }

 }

}

</style>
```

