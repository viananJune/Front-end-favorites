## 前言

> 关于技术，只有不停重复学习，方能如扎如稳的前行。

## 1.函数柯里化

函数柯里化的是一个为多参函数实现递归降解的方式。其实现的核心是:

1.要思考如何缓存每一次传入的参数

2.传入的参数和目标函数的入参做比较

这里通过闭包的方式缓存参数，实现如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/852ac5c721334a1bafd8afca13307d76~tplv-k3u1fbpfcp-watermark.image)

使用方式如下： ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e759bd36f54948a7b9ca4e264232380d~tplv-k3u1fbpfcp-watermark.image)

> 函数柯里化仅仅只是上面求和的这种运用吗？？

👆这个问题，有必要去🤔一下。其实利用函数柯里化这种思想，我们可以更好的实现函数的封装。

就比如有监听某一事件那么就会有移除该事件的操作，那么就可以利用柯里化的思想去封装代码了。

或者说一个输入A有唯一并且对应的输出B，那么从更大的角度去思想这样的工程项目是更安全，独立的。也便于去维护。

## 2.关于数组

### 手写map方法

map()方法根据回调函数映射一个新数组

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43e300e8a5ac46c683f15c0717341339~tplv-k3u1fbpfcp-watermark.image)

### 手写filter方法

filter()方法返回一个数组，返回的每一项是在回调函数中执行结果true。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f4255f17a04491baa387691e9dbb441~tplv-k3u1fbpfcp-watermark.image)

> filter和map的区别： filter是映射出条件为true的item，map是映射每一个item。

### 手写reduce方法

reduce()方法循环迭代，回调函数的结果都会作为下一次的形参的第一个参数。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/805ad6182b9449cf9ac05cd8e913f439~tplv-k3u1fbpfcp-watermark.image)

### 手写every方法

every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

### 手写some方法

some() 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个Boolean类型的值。

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

### 手写find方法

find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cc12c3cb6fb4005afd2b897cb663b23~tplv-k3u1fbpfcp-watermark.image)

### 拉平数组

将嵌套的数组扁平化，在处理业务数据场景中是频率出现比较高的。那如何实现呢？

- 利用ES6语法flat(num)方法将数组拉平。

该方法不传参数默认只会拉平一层，如果想拉平多层嵌套的数组，需要传入一个整数，表示要拉平的层级。该返回返回一个新的数组，对原数组没有影响。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ad13c1f1e29491aa08560e83a16075d~tplv-k3u1fbpfcp-watermark.image)

- 利用reduce()方法将数组拉平。

利用reduce进行迭代，核心的思想是递归实现。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e60682ce33e1438c8eeacf604a52bc0b~tplv-k3u1fbpfcp-watermark.image)

- 模拟栈实现数组拉平

该方法是模拟栈，在性能上相对最优解。

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

## 3.图片懒加载 & 惰性函数

实现图片懒加载其核心的思想就是将img的src属性先使用一张本地占位符，或者为空。然后真实的图片路径再定义一个data-set属性存起来，待达到一定条件的时将data-img的属性值赋给src。

如下是通过`scroll`滚动事件监听来实现的图片懒加载，当图片都加载完毕移除事件监听，并且将移除html标签。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/379fefd92c694dc7bb32a80cecfd11ed~tplv-k3u1fbpfcp-watermark.image)

`scroll`滚动事件容易造成性能问题。那可以通过 `IntersectionObserver `自动观察img标签是否进入可视区域。

实例化 IntersectionObserver 实例，接受两个参数：callback是可见性变化时的回调函数，option是配置对象（该参数可选）。

当 img 标签进入可视区域时会执行实例化时的回调，同时给回调传入一个 entries 参数，保存着实例观察的所有元素的一些状态，比如每个元素的边界信息，当前元素对应的 DOM 节点，当前元素进入可视区域的比率，每当一个元素进入可视区域，将真正的图片赋值给当前 img 标签，同时解除对其的观察。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6d6757de0ef42ccb24ca6f04cee6177~tplv-k3u1fbpfcp-watermark.image)

如上是懒加载图片的实现方式。

> 值得思考的是，懒加载和惰性函数有什么不一样嘛？

我所理解的懒加载顾名思义就是需要了才去加载，懒加载正是惰性的一种，但惰性函数不仅仅是懒加载，它还可以包含另外一种方向。

惰性函数的另一种方向是在重写函数，每一次调用函数的时候无需在做一些条件的判断，判断条件在初始化的时候执行一次就好了，即下次在同样的条件语句不需要再次判断了，比如在事件监听上的兼容。

## 4.预加载

预加载顾名思义就是提前加载，比如提前加载图片。

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

当用户需要查看时，可直接从本地缓存中取。预加载的优点在于如果一张图片过大，那么请求加载图片一定会慢，页面会出现空白的现象，用户体验感就变差了，为了提高用户体验，先提前加载图片到本地缓存，当用户一打开页面时就会看到图片。

## 5.节流 & 防抖

针对高频的触发的函数，我们一般都会思考通过节流或者防抖去实现性能上的优化。

节流实现原理是通过定时器以和时间差做判断。定时器有延迟的能力，事件一开始不会立即执行，事件结束后还会再执行一次；而时间差事件一开始就立即执行，时间结束之后也会立即停止。

结合两者的特性封装节流函数：

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

函数节流不管事件触发有多频繁，都会保证在规定时间内一定会执行一次真正的事件处理函数。

防抖实现原理是通过定时器，如果在规定时间内再次触发事件会将上次的定时器清除，即不会执行函数并重新设置一个新的定时器，直到超过规定时间自动触发定时器中的函数。

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

## 6.实现new关键字

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

## 7.实现instanceof

instanceof 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/244c82895c274970951f22e89f8db147~tplv-k3u1fbpfcp-watermark.image)

## 8.实现call，apply，bind

- call

call函数实现的原理是借用方法，关键在于隐式改变`this`的指向。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/076d282713a14a87bdcab3fd24363be0~tplv-k3u1fbpfcp-watermark.image)

- apply

apply函数实现的原理和call是相同的，关键在于参数的处理和判断。

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

> call()方法的作用和 apply() 方法类似，区别就是call()方法接受的是参数列表，而apply()方法接受的是一个参数数组。

- bind

bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

实现的关键思路：

1.拷贝保存原函数，新函数和原函数原型链接

2.生成新的函数，在新函数里调用原函数

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

## 9.封装数据类型函数

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

## 10.自记忆函数

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

## 11.是否存在循环引用

![image.png](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="600"></svg>)

## 12.拷贝函数

拷贝数据一直是业务开发中绕不开的技巧，对于深浅拷贝数据之前写过一篇文章来讲述[聊聊深拷贝浅拷贝](https://juejin.cn/post/6854573222432604167#heading-6)。

- 通过深度优先思维拷贝数据（DFS）

深度优先是通过纵向的维度去思考问题，在处理过程中也考虑到对象环的问题。

解决对象环的核心思路是先存再拷贝。一开始先通过一个容器用来储存原来的对象再进行拷贝，在每一次拷贝之前去查找容器里是否已存在该对象。这样就切断了原来的对象和拷贝对象的联系。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c38dd78455d45b6911a0a94bfdcfacb~tplv-k3u1fbpfcp-watermark.image)

- 通过广度优先思维拷贝数据（BFS）

广度优先是通过横向的维度去思考问题，通过创造源队列和拷贝数组队列之间的关系实现拷贝。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b06f163566c24bcbb2452bace356ae28~tplv-k3u1fbpfcp-watermark.image)

## 13.Promise系列

之前写过一篇关于[Promise](https://juejin.cn/post/6882284830764040206)的学习分享。

### Promsie.all

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4a6da68557f4b29993eb78952428020~tplv-k3u1fbpfcp-watermark.image)

### Promsie.race

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f94c9cce1e841259e5644ac7b18f7d2~tplv-k3u1fbpfcp-watermark.image)

### Promsie.finally

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12e0dd3c6dc648baaa83a993ad761b7e~tplv-k3u1fbpfcp-watermark.image)

## 14.实现async-await

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1cea2038b2a41d59eeac1d2631cde77~tplv-k3u1fbpfcp-watermark.image)

## 15.实现简易订阅-发布

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77eb0b2d946945fa979142da1b547415~tplv-k3u1fbpfcp-watermark.image)

## 16.单例模式

单例模式：保证一个类仅有一个实例，并提供一个访问它的全局访问点。实现方法一般是先判断实例是否存在，如果存在直接返回，如果不存在就先创建再返回。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de49dbd437654fc8a955581543f3efa8~tplv-k3u1fbpfcp-watermark.image)

## 17.实现Object.create

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f5d0be66f0d49e3893b2adc2ecfb8f9~tplv-k3u1fbpfcp-watermark.image)

该方法是实现了已有对象和新建对象的原型是一个浅拷贝的过程。

## 18.实现 ES6 的 class 语法

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a833f910710e4173b4e22df1a143e976~tplv-k3u1fbpfcp-watermark.image)

使用Object.create()方法将子类的实例对象继承与父类的原型对象，通过Object.setPrototypeOf()能够实现从父类中继承静态方法和静态属性。

## 19.实现一个 compose 函数

compose函数是用来组合合并函数，最后输出值的思想。在redux源码中用于中间件的处理。

- 使用while循环实现

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/455dc0bded964054824f7a6e708ff120~tplv-k3u1fbpfcp-watermark.image)

- 使用reduce迭代实现

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4763de492dde42d3b2d903e6ba7a89b0~tplv-k3u1fbpfcp-watermark.image)

## 20.实现异步并行函数

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee729c4c6fcd491f9a28cf768e67c472~tplv-k3u1fbpfcp-watermark.image)

## 21.实现异步串行函数

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cb7d2bfe12c46c58152c249803abee4~tplv-k3u1fbpfcp-watermark.image)

## 22.私有变量的实现

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/405ca4777f314d1d9181322d8539138d~tplv-k3u1fbpfcp-watermark.image)

以上是es5实现的私有变量的封装，通过使用WeakMap可以扩展每个实例所对应的私有属性，私有属性在外部无法被访问，而且随this对象的销毁和消失。

这里有个小细节值得一提,请看如下的代码：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05682395fca04341936db50b38f636eb~tplv-k3u1fbpfcp-watermark.image)

如上是挂在到原型上的方法和每个实例独有的方法不同写法。它们有什么区别呢？（ps:可以手动打印）

调用原型上的方法那么私有变量的值是与最近一个实例调用原型方法的值。其上一个实例的值也是随之改变的，那么就出现问题了...

而使用WeakMap可以解决如上的问题：做到将方法挂在到原型，且不同时期同一个实例调用所产生的结果是一致的。

## 源代码

[javascript--](https://github.com/hhl-web/javascript--)，欢迎star

## 总结

我一直认为有输入就得有输出，那总结就是最好的输出方式了。因此有了一篇这样的文章，希望读者能静下来去手写并理解code的思路和运行过程，我想也会对js有更深入的理解。（ps:可以一起探讨）

如上的总结，如有新的内容也会持续更新...


