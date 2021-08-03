<template>
  <div id="follow" ref="list">
    <div class="card" v-for="(item, index) in followList" :key="index">
      <a class="user">
        <el-image
          style="width: 20px; height: 20px; border-radius: 2px;"
          :src="item.user.avatarUrl"
          fit="fit"
        ></el-image>
        <span style="padding-left: 10px; font-size: 14px;">{{item.user.username}}</span>
      </a>
      <a class="title" :href="item.link">
        <h3>{{item.title}}</h3>
      </a>
      <div class="content">
        <a :href="item.link" class="image" v-if="item.picture">
          <el-image
            style="width: 190px; height: 105px; border-radius: 4px;"
            :src="item.picture"
            fit="fit"
          ></el-image>
          <span style="padding-left: 10px; font-size: 14px;">{{item.user.username}}</span>
        </a>
        <a class="text">
          {{checkText(item)}}
          <a class="all" v-if="item.showAll" @click="item.showAll=false">
            阅读全文
            <i class="el-icon-arrow-down"></i>
          </a>
        </a>
      </div>
      <div class="footer">
        <div class="left">
          <el-button @click="notLoveAnswer(item)" type="info" v-show="item.love" size="mini">取消喜欢</el-button>
          <el-button @click="loveAnswer(item)" type="primary" v-show="!item.love" size="mini">{{item.answer.love}}喜欢</el-button>
        </div>
        <div class="right">
          <a @click="openCommentDialog(item)">
            <i class="el-icon-s-comment"></i>
            查看评论
          </a>
          <a @click="collectAnswer(item)">
            <i class="el-icon-star-on"></i>收藏
          </a>
        </div>
      </div>
    </div>
    <div class="card" v-loading="loading" style="height: 40px;" v-show="loading"></div>
  </div>
</template>

<script>
import {get,put,del} from '../../axios/apis'
import {eventBus} from '../../main.js'
export default {
  name: "Follow",
  data() {
    return {
      followId: [],
      followList: [
        {
          link:'?',
          title:'独立宣言',
          username: '二次元虎哥',
          picture:'虎',
          content:'ok兄弟们，全体目光向我看齐啊',
          comment:'10',
        },
      ],
      lock: false,
      loading: true
    }
  },
  methods: {
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
    openCommentDialog(item){
      eventBus.$emit('followSaid', true)
      eventBus.$emit('followItem', item)
    },
    checkText(item) {
      var input = item.answer.content;
      input = input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,'').replace(/<[^>]+?>/g,'').replace(/\s+/g,' ').replace(/ /g,' ').replace(/>/g,' ');
      let l = input.length
      if(item.showAll == true){
        if (l > 130) return input.substring(0, 130) + "..."
        return input
      }else{
        return input
      }
    },
    async getAll() {
      this.followId = []
      this.followList = []
      this.loading = true;
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      let param = {userid: tk.id}
      await get('/user/follow_list', param).then((res) => {
        res.data.data.forEach(element => {
          this.followId.push(element.id)
        });
      })
      console.log(this.followId)
      
      for(let i = 0; i<this.followId.length; i++){
        let param2 = {
          userid: this.followId[i]
        }
        await get('/answer/get_lovelist', param2).then((res) => {
          res.data.data.forEach((element) => {
            element.user.avatarUrl = 'http://116.62.222.212/api/user/view/'+element.user.id.toString()
            element.showAll = true
            let param3 = {
              userid: tk.id,
              answerid: element.answer.id
            }
            put('/answer/judge_love', param3).then((res2) => {
              console.log('love='+res2.data.data)
              element.love = res2.data.data
            })
            this.followList.push(element)
          })
        })
      }
      this.loading = false
    },
    async collectAnswer(item){
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      if(tk){
        let param = {
          userid: tk.id,
          answerid: item.answer.id 
        }
        await put('/answer/collection_answer', param).then((res) => {
          if(res.data.code == 200){
            this.$Message.success("收藏成功")
          }else{
            this.$Message.error(res.data.msg)
          }
        })
      }else{
        this.$router.push({ name: 'signup' });
      }
    },
    // handleScroll() {
    //   let scrollTop =
    //     window.pageYOffset ||
    //     document.documentElement.scrollTop ||
    //     document.body.scrollTop
    //   let listHeight =
    //     this.$refs.list.offsetHeight -
    //     document.body.offsetHeight +
    //     this.$refs.list.offsetTop
    //   if (scrollTop > listHeight) {
    //     this.getList()
    //   }
    // }
  },
  mounted() {
    this.getAll()
    window.addEventListener("scroll", this.handleScroll)
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll)
  }
}
</script>

<style scoped>
a {
  color: black;
  text-decoration: none;
}

.card {
  padding: 20px;
  border-bottom: 1px solid #f0f2f7;
  display: flex;
  flex-direction: column;
}

.card h3{
  float: left;
}

.content {
  text-align: left;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.title {
  margin-bottom: 5px;
}

.title:hover {
  color: #175199;
}

.text {
  font-size: 15px;
  flex: 1 1;
}

.text:hover {
  color: #646464;
}

.image {
  margin-right: 20px;
}

.footer {
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.el-button {
  color: #0084ff;
  background: rgba(0, 132, 255, 0.1);
  border-color: transparent;
  padding: 10px;
}

.el-button:hover {
  background-color: rgba(0, 132, 255, 0.15);
}

i {
  padding-right: 5px;
}

.right a {
  margin-left: 25px;
  font-size: 15px;
  color: #73859a;
  cursor: pointer;
}

.right a:hover {
  color: #62788e;
}

.all {
  color: #175199;
  font-size: 14px;
}

.all:hover {
  color: #646464;
}

.user {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
