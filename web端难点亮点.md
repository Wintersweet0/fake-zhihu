# 技术难点和亮点：



[TOC]

### 通过EventBus进行兄弟间组件通讯

随着应用程序越来越庞大，通过父组件来传递所有内容会把事情变得越来越棘手。不过我们还有另一种选择，那就是使用eventBus架起兄弟之间通讯的桥梁。接下来看看我们是如何利用这一点一完成兄弟组件之间的数据通讯。

我们同样基于上面的示例来做修改。接下来的示例中，`ParentCard`组件包含了`SisterCard`和`BrotherCard`两个子组件，而且这两个子组件是兄弟组件。

首先在`main.js`文件中定义一个新的`eventBus`对象，其实他是一个全新的Vue实例：

```
// main.js
import Vue from 'vue'
import App from './App'

export const eventBus = new Vue()
new Vue({
    el: '#app',
    render: h => h(App)
})
```

接着在新创建的`BrotherCard`组件导入`main.js`：

```
<!-- BrotherCard.vue -->
<script>
    import { eventBus } from '../main'
</script>
```

`eventBus`实例现在将成为`BrotherCard`组件中发出事件的实例。现在我们可以使用`eventBus.$emit`来替代上例中的`this.$emit`。`eventBus`是一个Vue实例，而且`eventBus`有这个`$emit`方法，这就是我们能够这么用的原因。这样做同样会触发相同的自定义事件名称和消息。

```
methods: {
    messageSister() {
        eventBus.$emit('brotherSaid', '妈妈说，该做作业了！(^_^)!!!')
    }
}
```

同样可以在`SisterCard`组件中引入`eventBus`：

```
<script>
    import { eventBus } from '../main'
</script>
```

将`created()`生命周期钩子添加到`SisterCard`组件。在`created()`钩子中添加`eventBus`启动自定义事件的侦听器。当使用`SisterCard`组件时，该侦听器将开始运行并且会保持运行。下面的代码只是侦听`brotherSaid`自定义事件，然后触发回调，将作为自定义事件有效负载传递的消息分配给`fromBrother`。

```
created() {
    eventBus.$on('brotherSaid', (message) => {
        this.fromBrother = message
    })
}
```

这样就可以有条件地显示来自`BrotherCard`的信息：

```
<div v-if="fromBrother" class="alert" v-html="fromBrother"></div>
```



### 父子组件通信

#### 父组件向子组件传值

接下来我们通过一个例子，说明父组件如何向子组件传递值：在子组件Users.vue中如何获取父组件App.vue中的数据 `users:["Henry","Bucky","Emily"]`

```
//App.vue父组件
<template>
  <div id="app">
    <users v-bind:users="users"></users>//前者自定义名称便于子组件调用，后者要传递数据名
  </div>
</template>
<script>
import Users from "./components/Users"
export default {
  name: 'App',
  data(){
    return{
      users:["Henry","Bucky","Emily"]
    }
  },
  components:{
    "users":Users
  }
}
//users子组件
<template>
  <div class="hello">
    <ul>
      <li v-for="user in users">{{user}}</li>//遍历传递过来的值，然后呈现到页面
    </ul>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  props:{
    users:{           //这个就是父组件中子标签自定义名字
      type:Array,
      required:true
    }
  }
}
</script>
```

**总结：父组件通过props向下传递数据给子组件。注：组件中的数据共有三种形式：data、props、computed**

#### 子组件向父组件传值（通过事件形式）

接下来我们通过一个例子，说明子组件如何向父组件传递值：当我们点击“Vue.js Demo”后，子组件向父组件传递值，文字由原来的“传递的是一个值”变成“子向父组件传值”，实现子组件向父组件值的传递。

```
// 子组件
<template>
  <header>
    <h1 @click="changeTitle">{{title}}</h1>//绑定一个点击事件
  </header>
</template>
<script>
export default {
  name: 'app-header',
  data() {
    return {
      title:"Vue.js Demo"
    }
  },
  methods:{
    changeTitle() {
      this.$emit("titleChanged","子向父组件传值");//自定义事件  传递值“子向父组件传值”
    }
  }
}
</script>
// 父组件
<template>
  <div id="app">
    <app-header v-on:titleChanged="updateTitle" ></app-header>//与子组件titleChanged自定义事件保持一致
   // updateTitle($event)接受传递过来的文字
    <h2>{{title}}</h2>
  </div>
</template>
<script>
import Header from "./components/Header"
export default {
  name: 'App',
  data(){
    return{
      title:"传递的是一个值"
    }
  },
  methods:{
    updateTitle(e){   //声明这个函数
      this.title = e;
    }
  },
  components:{
   "app-header":Header,
  }
}
</script>
```

**总结：子组件通过events给父组件发送消息，实际上就是子组件把自己的数据发送到父组件。**



### 登录持久化

直接使用session判断是否存在，若存在则继续进行操作，不存在跳到登录页。



### 图片显示与formdata

图片的获取与显示代码如下：

```
<img :src="userInfo.avatarUrl" alt="" class="profile-img" style="width:32px; height: 31px; border-radius: 8px">

<script>
this.userInfo.avatarUrl = 'http://116.62.222.212/api/user/view/'+res.data.data.id.toString()
</script>
```

注册用户的post方法使用了FormData()：

``` javascript
let formData = new FormData();

formData.append("username", this.registerForm.username)
formData.append("telephone", this.registerForm.telephone)
formData.append("introduction", this.registerForm.introduction)
formData.append("sex", this.registerForm.sex)
formData.append("password", this.registerForm.password)
formData.append("picture", this.registerForm.file)
let headers = { 'Content-Type': 'multipart/form-data' }

await post('/user/create_user',formData, headers)
```



### 富文本编辑器

vue-quill-editor

vue项目中，npm安装依赖

```javascript
npm install vue-quill-editor --save
```

两种引用方法，全局引用和局部引用

- 全局引用，项目入口文件中（main.js）注册



```jsx
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
```

- 局部引用，在需调用的vue页面中声明



```jsx
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  }
}
```

完成上述步骤之后即可使用，引用代码如下：

```html
<template>
  <div>
    <quill-editor class="rich-text-editor"
                  v-model="value"
                  ref="myQuillEditor"
                  :options="options"
                  @change="updateRichText($event)">
    </quill-editor>
  </div>
</template>
```



### 正则解析字符串

```javascript
checkText(item) {
    var input = item.answer.content;
    input = input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,'').replace(/<[^>]+?>/g,'').replace(/\s+/g,' ').replace(/ /g,' ').replace(/>/g,' ');
    console.log(input)
    let l = input.length
    if(item.showAll == true){
        if (l > 130) return input.substring(0, 130) + "..."
        return input
    }else{
        return input
    }
},
```



### 对以对象为元素的数组去重

```javascript
unique(arr) {
    const map = new Map()
    return arr.filter( item => !map.has(JSON.stringify(item)) && map.set(JSON.stringify(item), 1))
},
```



### 事件监听，主要是为了实现滚动加载

```javascript
window.addEventListener("scroll", this.handleScroll)
```



### 按钮的喜欢与取消喜欢的动画实现：

```html
<div class="left">
    <el-button @click="notLoveAnswer(item)" type="info" v-show="item.love" size="mini">取消喜欢</el-button>
    <el-button @click="loveAnswer(item)" type="primary" v-show="!item.love" size="mini">{{item.answer.love}}喜欢</el-button>
</div>
<script>
    async loveAnswer(item){
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      if(tk){
        let param = {
          userid: tk.id,
          answerid: item.answer.id
        }
        await put('/answer/love_answer', param).then((res) => {
          if(res.data.code == 200){
            item.answer.love = res.data.data.love
            item.love = true
            this.$Message.success(res.data.msg)
          }else{
            this.$Message.error(res.data.msg)
          }
        })
      }else{
        this.$router.push({name: 'signup'})
      }
    },
    async notLoveAnswer(item){
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      if(tk){
        let param = {
          userid: tk.id,
          answerid: item.answer.id
        }
        await del('/answer/cancel_like', param).then((res) => {
          if(res.data.code == 200){
            item.answer.love = res.data.data.love;
            item.love = false
            this.$Message.success(res.data.msg)
          }else{
            this.$Message.error(res.data.msg)
          }
        })
      }else{
        this.$router.push({name: 'signup'})
      }
    },
</script>
```





### 评论框对每个回答的适配

通过eventBus传入item，然后根据不同页面传来的item进行get和渲染：

```html
<comment-dialog ></comment-dialog>
import CommentDialog from '../components/comment/CommentDialog.vue';
```

```javascript
created() {
    eventBus.$on('recommendSaid', (message) => {
      this.commentDialogVisible = message
    }),
    eventBus.$on('recommendItem', (message) => {
      this.commentItem = message
      this.getComment()
    }),
    eventBus.$on('hotSaid', (message) => {
      this.commentDialogVisible = message
    }),
    eventBus.$on('hotItem', (message) => {
      this.commentItem = message
      this.getComment()
    }),
    eventBus.$on('followSaid', (message) => {
      this.commentDialogVisible = message
    }),
    eventBus.$on('followItem', (message) => {
      this.commentItem = message
      this.getComment()
    })
  }
```

