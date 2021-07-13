# [一篇搞定（Js异步、事件循环与消息队列、微任务与宏任务）](https://www.cnblogs.com/itgezhu/p/13259966.html)

前言

> 我们都知道`javascript`是一门单线程、异步、非阻塞、解析类型脚本语言。

- 单线程 ？？
- 异步 ？？
- 非阻塞 ？？
- 然后还有 事件循环、消息队列，还有微任务、宏任务这些

这几天在掘金、知乎等论坛翻阅了不少大佬的文章，似乎了解到了一二，然后在这里把自己的体会总结出来，帮助大家快速理解，也能增加自己的记忆。

 

## 单线程与多线程

> JavaScript 的设计就是为了处理浏览器网页的交互（DOM操作的处理、UI动画等），决定了它是一门单线程语言。如果有多个线程，它们同时在操作 DOM，那网页将会一团糟。

由此，我们就可以知道 `js` 处理任务是一件接着一件处理，从上往下顺序执行的

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
console.log('开始')
console.log('中间')
console.log('结束')

// 开始
// 中间
// 结束
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

这个时候，思维开拓的同学可能就会说 那如果一个任务的处理耗时（或者是等待）很久的话，如：网络请求、定时器、等待鼠标点击等，后面的任务也就会被阻塞，也就是说会阻塞所有的用户交互（按钮、滚动条等），会带来极不友好的体验。

但是：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
console.log('开始')
console.log('中间')
setTimeout(() => {
  console.log('timer over')
}, 1000)
console.log('结束')

// 开始
// 中间
// 结束
// timer over
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

会发现 `timer over` 会在 打印`结束`之后打印，也就是说计时器并没有阻塞后面的代码

其实，JavaScript 单线程指的是浏览器中负责解释和执行 JavaScript 代码的只有一个线程，即为JS引擎线程，但是浏览器的渲染进程是提供多个线程的，如下：

- JS引擎线程
- 事件触发线程
- 定时触发器线程
- 异步http请求线程
- GUI渲染线程

当遇到计时器、DOM事件监听或者是网络请求的任务时，JS引擎会将它们直接交给 webapi，也就是浏览器提供的相应线程（如定时器线程为setTimeout计时、异步http请求线程处理网络请求）去处理，而JS引擎线程继续后面的其他任务，这样便实现了 异步非阻塞。

定时器触发线程也只是为 `setTimeout(..., 1000)` 定时而已，时间一到，还会把它对应的回调函数(callback)交给 任务队列 去维护，JS引擎线程会在适当的时候去任务队列取出任务并执行。

JS引擎线程什么时候去处理呢？消息队列又是什么？

## 事件循环与消息队列

JavaScript 通过 事件循环 event loop 的机制来解决这个问题。

其实 事件循环 机制和 任务队列 的维护是由事件触发线程控制的。

事件触发线程 同样是浏览器渲染引擎提供的，它会维护一个 任务队列。

JS引擎线程遇到异步（DOM事件监听、网络请求、setTimeout计时器等...），会交给相应的线程单独去维护异步任务，等待某个时机（计时器结束、网络请求成功、用户点击DOM），然后由 事件触发线程 将异步对应的 回调函数 加入到消息队列中，消息队列中的回调函数等待被执行。

同时，JS引擎线程会维护一个 执行栈，同步代码会依次加入执行栈然后执行，结束会退出执行栈。

如果执行栈里的任务执行完成，即执行栈为空的时候（即JS引擎线程空闲），事件触发线程才会从消息队列取出一个任务（即异步的回调函数）放入执行栈中执行。

> 消息队列是类似队列的数据结构，遵循先入先出(FIFO)的规则。

```text
1. 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
2. 主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
3. 一但"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
4. 主线程不断重复上面的第三步。

只要主线程空了，就会去读取"任务队列"，这就是JavaScript的运行机制。这个过程会不断重复，这种机制就被称为事件循环（event loop）机制。
```

![img](https://pic4.zhimg.com/80/v2-595fdd0e4697bed589dc4b30f2c60aeb_720w.jpg)

上面说到了异步，JavaScript 中有同步代码与异步代码。，一种是同步任务（synchronous），另一种是异步任务（asynchronous）。同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；异步任务指的是，不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

具体来说，异步执行的运行机制如下。（同步执行也是如此，因为它可以被视为没有异步任务的异步执行。）

同步：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
console.log('hello 0')

console.log('hello 1')

console.log('hello 2')

// hello 0
// hello 1
// hello 2
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

它们会依次执行，执行完了后便会返回结果（打印结果）。

异步：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
setTimeout(() => {
  console.log('hello 0')
}, 1000)

console.log('hello 1')

// hello 1
// hello 0
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

上面的 `setTimeout` 函数便不会立刻返回结果，而是发起了一个异步，setTimeout 便是异步的发起函数或者是注册函数，() => {...} 便是异步的回调函数。

异步一般是以下：

- 网络请求
- 计时器
- DOM时间监听

## 宏任务与微任务

Promise同样是用来处理异步的：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
console.log('script start')

setTimeout(function() {
    console.log('timer over')
}, 0)

Promise.resolve().then(function() {
    console.log('promise1')
}).then(function() {
    console.log('promise2')
})

console.log('script end')

// script start
// script end
// promise1
// promise2
// timer over
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

"promise 1" "promise 2" 在 "timer over" 之前打印了？

这里有一个新概念：`macro-task`（宏任务） 和 `micro-task`（微任务）。

所有任务分为 `macro-task` 和 `micro-task`:

- macro-task：主代码块、setTimeout、setInterval等（可以看到，事件队列中的每一个事件都是一个 macro-task，现在称之为宏任务队列）
- micro-task：Promise、process.nextTick等

JS引擎线程首先执行主代码块。

每次执行栈执行的代码就是一个宏任务，包括任务队列(宏任务队列)中的，因为执行栈中的宏任务执行完会去取任务队列（宏任务队列）中的任务加入执行栈中，即同样是事件循环的机制。

在执行宏任务时遇到Promise等，会创建微任务（.then()里面的回调），并加入到微任务队列队尾。

micro-task必然是在某个宏任务执行的时候创建的，而在下一个宏任务开始之前，浏览器会对页面重新渲染(`task` >> `渲染` >> `下一个task`(从任务队列中取一个))。同时，在上一个宏任务执行完成后，渲染页面之前，会执行当前微任务队列中的所有微任务。

也就是说，在某一个macro-task执行完后，在重新渲染与开始下一个宏任务之前，就会将在它执行期间产生的所有micro-task都执行完毕（在渲染前）。

这样就可以解释 "promise 1" "promise 2" 在 "timer over" 之前打印了。"promise 1" "promise 2" 做为微任务加入到微任务队列中，而 "timer over" 做为宏任务加入到宏任务队列中，它们同时在等待被执行，但是微任务队列中的所有微任务都会在开始下一个宏任务之前都被执行完。

> 在node环境下，process.nextTick的优先级高于Promise，也就是说：在宏任务结束后会先执行微任务队列中的nextTickQueue，然后才会执行微任务中的Promise。

执行机制：

1. 执行一个宏任务（栈中没有就从事件队列中获取）
2. 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
3. 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
4. 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
5. 渲染完毕后，JS引擎线程继续，开始下一个宏任务（从宏任务队列中获取）

![img](https://pic3.zhimg.com/80/v2-d6406cc50f2f5f2c9080101e1f07bd7e_720w.jpg)

### 宏任务 macro-task(Task)

一个event loop有一个或者多个task队列。task任务源非常宽泛，比如ajax的onload，click事件，基本上我们经常绑定的各种事件都是task任务源，还有数据库操作（IndexedDB ），需要注意的是setTimeout、setInterval、setImmediate也是task任务源。总结来说task任务源：

- script
- setTimeout
- setInterval
- setImmediate
- I/O
- requestAnimationFrame
- UI rendering

### 微任务 micro-task(Job)

microtask 队列和task 队列有些相似，都是先进先出的队列，由指定的任务源去提供任务，不同的是一个 event loop里只有一个microtask 队列。另外microtask执行时机和Macrotasks也有所差异

- process.nextTick
- promises
- Object.observe
- MutationObserver

### 宏任务和微任务的区别

- 宏队列可以有多个，微任务队列只有一个,所以每创建一个新的settimeout都是一个新的宏任务队列，执行完一个宏任务队列后，都会去checkpoint 微任务。
- 一个事件循环后，微任务队列执行完了，再执行宏任务队列
- 一个事件循环中，在执行完一个宏队列之后，就会去check 微任务队列

### 宏任务与微任务示例

### 1、主线程上添加宏任务和微任务

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
console.log('-------开始--------');

setTimeout(() => {
  console.log('setTimeout');  
}, 0);

new Promise((resolve, reject) => {
  for (let i = 0; i < 5; i++) {
    console.log(i);
  }
  resolve()
}).then(()=>{
  console.log('Promise'); 
})

console.log('-------结束--------');

//-------开始--------
//0
//1
//2
//3
//4
//-------结束--------
//Promise
//setTimeout
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

> 解析

第一轮事件循环：

- 整体script作为第一个宏任务进入主线程，遇到console.log，输出`-------开始--------`。
- 遇到setTimeout，其回调函数被分发到宏任务Event Queue中。我们暂且记为`setTimeout1`。
- 遇到Promise，new Promise直接执行，循环依次输出0、1、2、3、4、。then被分发到微任务Event Queue中。我们记为`then1`。
- 继续往下，遇到clg,直接输出`-------结束--------`，到此第一轮事件循环即将结束，会先看当前循环有没有产生出微任务，有依次按产生顺序执行。
- 发现有`then1`，输出 `Promise`，当前微任务执行完毕，到此，第一轮事件循环结束。

发现 `setTimeout1`宏任务，开始第二轮事件循环：

- 遇到clg,直接输出`setTimeout`，没有微任务，第二轮事件循环结束。

所有宏任务执行完毕，整个程序执行完毕

### 2 、在微任务中创建微任务

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
setTimeout(()=> console.log('setTimeout4'))

new Promise(resolve => {
  resolve()
  console.log('Promise1')
}).then(()=> {
  console.log('Promise3')
  Promise.resolve().then(() => {
    console.log('before timeout')
  }).then(() => {
    Promise.resolve().then(() => {
      console.log('also before timeout')
    })
  })
})

console.log('结束')

//Promise1
//结束
//Promise3
//before timeout
//also before timeout
//setTimeout4
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

> 解析

第一轮事件循环：

- 遇到setTimeout，其回调函数被分发到宏任务Event Queue中。我们暂且记为`setTimeout1`
- 遇到Promise，new Promise直接执行，输出`Promise1`。then被分发到微任务Event Queue中。我们记为`then1`(这里注意不要看then里面的内容)。
- 遇到console.log，输出`结束`
- 执行微任务`then1`,遇到clg,输出`Promise3`,遇到 Promise.resolve().then，then被分发到微任务Event Queue中。我们记为`then2`
- 执行 `then2`，clg输出`before timeout`，生成微任务`then3`
- 执行 `then3`，clg输出`also before timeout`,至此微任务，执行完毕,第一轮事件循环结束

发现 `setTimeout1`宏任务，开始第二轮事件循环：

- console.log，输出`setTimeout4`,无微任务，第二轮事件循环结束

### 3、微任务队列中创建宏任务

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
new Promise((resolve) => {
  console.log('new Promise(macro task 1)');
  resolve();
}).then(() => {
  console.log('micro task 1');
  setTimeout(() => {
    console.log('setTimeout1');
  }, 0)
})

setTimeout(() => {
  console.log('setTimeout2');
}, 500)

console.log('========== 结束==========');

//new Promise(macro task 1)
//========== 结束==========
//micro task 1
//setTimeout1
//setTimeout2
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

> 解析

第一轮事件循环：

- 遇到Promise，new Promise直接执行，输出`new Promise(macro task 1)`。then被分发到微任务Event Queue中。我们记为`then1`。
- 遇到setTimeout，其回调函数被分发到宏任务Event Queue中。记为`宏set1`
- clg输出`========== 结束==========`
- 执行微任务`then1`,clg输出`micro task 1`，遇到setTimeout,生成宏任务,记为`宏set2`，至此微任务，执行完毕,第一轮事件循环结束

发现有两个定时器宏任务，这里优先执行`宏set2`(为什么优先执行，下面详细解释)，开始第二轮事件循环：

- clg输出`setTimeout1`，无微任务，第二轮事件循环结束

执行`宏set1`，开始第三轮事件循环：

- clg输出`setTimeout2`，无微任务，第三轮事件循环结束

为什么会优先`宏set2`

尽管 `宏set1`先被定时器触发线程处理，但是`宏set2` 的callback会先加入消息队列。

上面，`宏set2`的延时为 0ms，HTML5标准规定 setTimeout 第二个参数不得小于4（不同浏览器最小值会不一样），不足会自动增加，所以 "setTimeout2" 还是会在 "setTimeout1" 之后。

就算延时为 0ms，只是`宏set2`的回调函数会立即加入消息队列而已，回调的执行还是得等执行栈为空（JS引擎线程空闲）时执行。

> 其实 setTimeout 的第二个参数并不能代表回调执行的准确的延时事件，它只能表示回调执行的最小延时时间，因为回调函数进入消息队列后需要等待执行栈中的同步任务执行完成，执行栈为空时才会被执行。

### 4、宏任务中创建微任务

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
setTimeout(() => {
  console.log('timer_1');
  setTimeout(() => {
    console.log('timer_3')
  }, 0) 
  new Promise(resolve => {
    resolve()
    console.log('new promise')
  }).then(() => {
    console.log('promise then')
  })
}, 0)

setTimeout(() => {
  console.log('timer_2')
}, 0)

console.log('结束')

//结束
// timer_1
//new promise
//promise then
// timer_2
//timer_3
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

> 解析

第一轮事件循环：

- 创建`宏set1`
- 创建`宏set2`
- console.log输出 “结束”
- 无微任务，当前事件循环结束

执行`宏set1`，开始第二事件循环：

- console.log输出 “timer_1”
- 创建`宏set3`
- new Promise，直接输出 'new promise'，创建微任务`then1`
- 执行微任务`then1`，输出 'promise then'
- 无微任务，当前事件循环结束

执行`宏set2`，开始第三事件循环：

- clg 输出 'timer_2'
- 无微任务，当前事件循环结束

执行`宏set3`，开始第四事件循环：

- clg 输出 'timer_3'
- 无微任务，当前事件循环结束

### 事件冒泡+事件循环

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
 <div class="outer">
    <div class="inner"></div>
  </div>

var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

  function onClick() {
    console.log('inner');

    setTimeout(function () {
      console.log('inner-timeout');
    }, 0);

    Promise.resolve().then(function () {
      console.log('inner-promise');
    });

  }
  function onClick2() {
    console.log('outer');

    setTimeout(function () {
      console.log('outer-timeout');
    }, 0);

    Promise.resolve().then(function () {
      console.log('outer-promise');
    });

  }

  inner.addEventListener('click', onClick);
  outer.addEventListener('click', onClick2);

// inner
// inner-promise
// outer
// outer-promise
// inner-timeout
// outer-timeout
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

事件冒泡是从内往外触发的，所以：

```text
（1）点击 inner，onClick 函数入执行栈执行，打印 "click"。执行完后执行栈为空，因为事件冒泡的缘故，事件触发线程会将向上派发事件的任务放入宏任务队列。
（2）遇到 setTimeout，在最小延迟时间后，将回调放入宏任务队列。遇到 promise，将 then 的任务放进微任务队列
（3）此时，执行栈再次为空。开始清空微任务，打印 "promise"
（4）此时，执行栈再次为空。从宏任务队列拿出一个任务执行，即前面提到的派发事件的任务，也就是冒泡。
（5）事件冒泡到 outer，执行回调，重复上述 "click"、"promise" 的打印过程。
（6）从宏任务队列取任务执行，这时我们的宏任务队列已经累计了两个 setTimeout 的回调了，所以他们会在两个 Event Loop 周期里先后得到执行。
```

## async+await

- - *async 返回的是一个promise generator + co*
  - *await => yield 如果产出的是一个promise 会调用这个promise.then方法*

 

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
    async function f1() {
            await f2()
            console.log('f1结束')
        }
        async function f2() {
            await f3()
            console.log('f2结束')
        }
        async function f3() {
            console.log('f3结束')
        }
        f1()
        new Promise(res=>{
            console.log('new Promise')
            res()
        }).then(res=>{
            console.log('promise第一个then')
        }).then(res=>{
            console.log('promise第二个then')
        })

//f3结束
//new Promise
//f2结束
//promise第一个then
//f1结束
//promise第二个then
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

> 解析

- - `f1`跟`f2`里面的`await`返回都是`promise`,所以我们可以转换成`promise`

```
 
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
 async function f1() {
            //await f2()
            //console.log('f1结束')
        new Promise((resolv,reject)=>resolve(f2())).then(()=>{
             console.log('f1结束')
        })
        }
        async function f2() {
            //await f3()
            //console.log('f2结束')
             new Promise((resolv,reject)=>resolve(f3())).then(()=>{
             console.log('f2结束')
        })
        }
        async function f3() {
            console.log('f3结束')
        }
        f1()
        new Promise(res=>{
            console.log('new Promise')
            res()
        }).then(res=>{
            console.log('promise第一个then')
        }).then(res=>{
            console.log('promise第二个then')
        })
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

- 执行 f1() 的时候，直接执行resolve里面的f2方法;
- 执行 f2() ，同上，进入到 f3执行；
- f3 只有同步代码clg，直接打印 `f3结束`;
- 此时，f2里面的resoleve()执行完成，遇到 .then 产生第一个`then1` 微任务；执行f1()到此先放停，往下执行
- new Promise 直接打印 `new Promise` ,创建第二个`then2`微任务,
- 当前宏任务里面代码执行完毕，清空微任务队列,
- 执行`then1` ,打印`f2结束`，此时f2 执行完毕，也就是 f1 的resolve()执行完毕,创建第三个`then3`微任务
- 执行`then2`,打印 `promise第一个then`,创建微任务`then4`
- 执行`then3`,打印`f1结束`;
- 执行`then4`,打印`promise第二个then`,
- 微任务队列清空，当前事件循环结束

## 总结

- 从上往下，同步直接执行，异步分发MacroTask或者microtask
- 碰到MacroTask直接执行，并且把回调函数放入MacroTask执行队列中（下次事件循环执行）；碰到microtask直接执行。把回调函数放入microtask执行队列中（本次事件循环执行）
- 当同步任务执行完毕后，去执行微任务microtask。（microtask队列清空）
- 由此进入下一轮事件循环：执行宏任务 MacroTask （setTimeout，setInterval，callback）

最后我们来分析一段较复杂的代码，看看你是否真的掌握了js的执行机制：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
console.log('1');

setTimeout(function() {
    console.log('2');
    Promise.resolve().then(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
Promise.resolve().then(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
   Promise.resolve().then(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

答案：1、7、6、8、2、4、3、5、9、11、10、12