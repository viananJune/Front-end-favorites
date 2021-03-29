```
import router, { initRouterMap, resetRouter } from "./router";

import store from "./store";

import NProgress from "nprogress"; // progress bar

import "nprogress/nprogress.css"; // progress bar style

import { getToken, setToken, getTokenBySSO } from "./utils/auth"; // getToken from cookie

import { getConfig } from "./config";

import { fromUnixTime } from "date-fns";

var fullPath

var withoutPassword=false

var id

var name



NProgress.configure({

 showSpinner: false

});



const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist



router.beforeEach((to, _from, next) => {

 console.log('window', window)



  fullPath=to.fullPath



  console.log('fullPath', fullPath)

  if(fullPath.indexOf('tiamaes-tmsp-without-password')!=-1){

  withoutPassword=true

  var arr = fullPath.split("&"); //通过&符号将字符串分割转成数组

  var mm = arr[0]; //获取数组中第一个参数

  var wid = arr[1]; //第二个参数

  var wname = arr[2]; //第三个参数

  console.log(' wname', wname)

  wid = decodeURI(wid); //转码将解码方式unscape换为decodeURI，将中文参数获取

  wname = decodeURI(wname);

  id = wid

  name=wname

  console.log('object',id)

  }

 // start progress bar

 NProgress.start();

 const token = getToken() || getTokenBySSO();



 localStorage.getItem("systemId");





 const multiSystem = getConfig("multiSystem");

 const multiSystemEnabled = multiSystem;

 let auth = null;





 //免密登录处理





 if (multiSystemEnabled && to.query.auth) {

  auth = JSON.parse(decodeURIComponent(to.query.auth));

  if (auth && auth.id) {

   localStorage.setItem("systemId", auth.id);

   store.commit("SET_SYSTEM_INFO", {

​    id: auth.id,

​    name: auth.name

   });

  }

 }

 let systemId = auth && auth.id ? auth.id : localStorage.getItem("systemId");





 if (token) {



  if (

   multiSystemEnabled &&

   !multiSystem.systemId &&

   !auth &&

   to.path !== "/home" &&

   !systemId

  ) {

   return next({

​    path: "/home"

   });



  }

  if (to.path === "/login") {

   next({

​    path: "/"

   });

   NProgress.done(); // if current page is dashboard will not trigger afterEach hook, so manually handle it

  } else if (to.path === "/home") {

   store.commit("SET_ROUTERS", []); //清空路由信息

   store.commit("SET_ASYNC_ROUTERS", []); //清空动态生成路由

   store.dispatch("delAllVisitedViews"); //清空所有打开的标签页

   store.commit("SET_SYSTEM_INFO", {

​    id: "",

​    name: ""

   }); //清空子系统信息

   resetRouter();

   localStorage.removeItem("systemId");

   next();

   NProgress.done();

  } else {



   if (store.getters.addRouters.length > 0) {





​    if (auth) {

​     next({ path: to.path });

​    } else {

​     next();

​    }

   } else if (auth) {

​    next({ path: to.path });

   } else {





​    const routerInfo = getConfig("router");

​    if (routerInfo && routerInfo.local) {

​     // 如果配置本地路由模式，跳过动态获取资源菜单

​     return next();

​    }

​    if (!systemId && typeof multiSystem.systemId === "string") {

​     systemId = multiSystem.systemId;

​    }





​    if(withoutPassword){



​     console.log('object', systemId)

​     localStorage.removeItem("systemId");

​     // store.commit("SET_SYSTEM_INFO", {id:id,name:name});

​     localStorage.setItem("systemId", id);

​     store.commit("SET_SYSTEM_INFO", {

​      id: id,

​      name: name

​     });

​     systemId= localStorage.getItem("systemId")



​     }



​    initRouterMap(systemId).then(data => {

​     if (data && data.length) {

​      next({

​       ...to,

​       replace: true

​      });

​     } else {

​      store.dispatch("FedLogOut").then(() => {

​       next({

​        path: "/login"

​       });

​      });

​     }

​    });

   }

  }

 } else {

  if (multiSystem && auth && auth.token) {

   setToken(auth.token);

   return next({

​    path: to.path

   });

  }



  /* has no token*/

  if (whiteList.indexOf(to.path) !== -1) {

   if (

​    multiSystemEnabled &&

​    multiSystem.loginURL &&

​    to.path.indexOf("/login") > -1

   ) {

​    location.href = multiSystem.loginURL;

   } else {

​    next();

   }

  } else {

   NProgress.done();

   if (multiSystemEnabled && multiSystem.loginURL) {

​    location.href = multiSystem.loginURL;

   } else {

​    next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页

   }

  }

 }

});



router.afterEach(() => {

 NProgress.done(); // finish progress bar

});



export { store, router };
```

