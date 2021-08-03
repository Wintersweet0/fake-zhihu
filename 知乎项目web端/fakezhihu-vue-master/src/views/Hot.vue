<template>
  <div id="hot" ref="list">
    <el-row type="flex" class="row-bg">
      <el-col span="1" style="width:15px"></el-col>
      <el-button type="info" @click="getList(item.id)" v-for="(item, index) in topics" :key="index">
        {{item.name}}
      </el-button>
    </el-row>
    <div class="card" v-for="(item, index) in hotList" :key="index">
      <a class="user">
        <el-image
          style="width: 20px; height: 20px; border-radius: 2px;"
          :src="item.user.avatarUrl"
          fit="fit"
        ></el-image>
        <span style="padding-left: 10px; font-size: 14px;">{{item.user.username}}</span>
        <el-button 
          type="primary"
          class="followbtn"
          size="small"
          round
          @click="followPeople(item)"
          >点击关注
        </el-button>
      </a>
      <a class="title">
        <h3>{{item.answer.title}}</h3>
      </a>
      <div class="content">
        <a class="text" >
          {{checkText(item)}}
          <a class="all" v-if="item.showAll" @click="item.showAll=false">
            阅读全文
            <i class="el-icon-arrow-down"></i>
          </a>
        </a>
        <!-- <a :href="item.link" class="image" v-if="item.picture">
          <el-image
            style="width: 190px; height: 105px; border-radius: 4px;"
            :src="item.picture"
            fit="fit"
          ></el-image>
        </a> -->
      </div>
      <div class="footer">
        <div class="left">
          <el-button @click="notLoveAnswer(item)" type="info" v-show="item.love" size="mini">取消喜欢</el-button>
          <el-button @click="loveAnswer(item)" type="primary" v-show="!item.love" size="mini">{{item.answer.love}}喜欢</el-button>
        </div>
        <div class="right">
          <a style="display:relative; margin-left:10px">
            {{item.answer.date}}
          </a>
          <!-- <a>
            <i class="el-icon-magic-stick"></i>
            {{item.answer.love}} 喜欢
          </a> -->
          <a @click="openCommentDialog(item)">
            <i class="el-icon-s-comment"></i>
            查看评论
          </a>
          <a @click="collectArticle(item)">
            <i class="el-icon-star-on"></i>收藏
          </a>
          <!-- <a>
            <i class="el-icon-s-promotion"></i>分享
          </a> -->
        </div>
      </div>
    </div>
    <div class="card" v-loading="loading" style="height: 80px;" v-show="loading"></div>
  </div>
</template>

<script>
import { get, post,put,del } from '../axios/apis';
import {eventBus} from '../main.js'
export default {
  name: "Hot",
  data() {
    return {
      hotListId: [],
      hotList: [
        // {
        //   link:'?',
        //   title:'独立宣言',
        //   picture:'虎',
        //   content:'ok兄弟们，全体目光向我看齐啊',
        //   comment:'10',
        // },
        // {
        //   link:'?',
        //   title:'独立宣言',
        //   picture:'虎',
        //   content:'ok兄弟们，全体目光向我看齐啊',
        //   comment:'10',
        // },
        // {
        //   link:'?',
        //   title:'独立宣言',
        //   picture:'虎',
        //   content:'ok兄弟们，全体目光向我看齐啊',
        //   comment:'10',
        // },
      ],
      topics: [
        // {
        //   id: 'HTML',
        //   name: 'HTML'
        // },
        // {
        //   id: 'CSS',
        //   name: 'CSS'
        // },
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
      eventBus.$emit('hotSaid', true)
      eventBus.$emit('hotItem', item)
    },
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
    async followPeople(item){
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      let formData = new FormData();
      formData.append("userid", tk.id)
      formData.append("followid", item.user.id)
      let headers = { 'Content-Type': 'multipart/form-data'}
      await post('/user/follow_user', formData, headers).then((res) => {
        if(res.data.code == 200){
          this.$Message.success(res.data.msg)
        }else{
          this.$Message.error(res.data.msg)
        }
      })
    },
    async collectArticle(item){
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
    // checkText(str) {
    //   let l = str.replace(/[\u0391-\uFFE5]/g, "aa").length //先把中文替换成两个字节的英文，在计算长度
    //   if (l > 130) return str.substring(0, 130) + "..."
    //   return str
    // },
    async getTopicList(){
      await get('/question/get_topiclist').then((res) => {
        this.topics = res.data.data
        console.log(this.topics)
      })
    },
    async getList(topicid) {
      this.hotListId = []
      this.hotList = []
      this.loading = true
      let param = {
        topicid: topicid
      }
      await get('/answer/get_topicanswer', param).then((res) => {
        res.data.data.forEach(element => {
          if(element.data.answer.isarticle == 1){
            this.hotListId.push(element.data.answer.id)
          }
        });
      })
      let param2 = {
        idlist: this.hotListId.join(",")
      }
      await get('/answer/get_answerlist', param2).then((res) => {
        // this.hotList = res.data.data
        res.data.data.forEach((element) => {
          element.user.avatarUrl = 'http://116.62.222.212/api/user/view/'+element.user.id.toString()
          element.showAll = true
          console.log(element.user.avatarUrl)
          this.hotList.push(element)
        })
      })
      this.loading = false
      // if (!this.lock) {
      //   this.lock = true
      //   this.loading = true
      //   this.$api.getHotList().then(res => {
      //     res.data.forEach(item => {
      //       this.hotList.push(item)
      //     })
      //     this.loading = false
      //     this.lock = false
      //   })
      // }
    },
    async getAll() {
      console.log(this.topics)
      for(let i = 0; i < this.topics.length; i++){
        let param = {
          topicid: this.topics[i].id
        }
        await get('/answer/get_topicanswer', param).then((res) => {
          res.data.data.forEach(element => {
            if(element.data.answer.isarticle == 1){
              this.hotListId.push(element.data.answer.id)
            }
          });
        })
      }
      console.log(this.hotListId)
      let param2 = {
        idlist: this.hotListId.join(",")
      }
      await get('/answer/get_answerlist', param2).then((res) => {
        res.data.data.forEach((element) => {
          element.user.avatarUrl = 'http://116.62.222.212/api/user/view/'+element.user.id.toString()
          element.showAll = true
          console.log(element.user.avatarUrl)
          this.hotList.push(element)
        })
      })
      this.loading = false
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
  async mounted() {
    await this.getTopicList()
    await this.getAll()
    // this.getList()
    window.addEventListener("scroll", this.handleScroll)
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll)
  }
}
</script>

<style scoped>
.followbtn{
  display:relative;
  float:right;
  margin-left: 10px
}
a {
  color: black;
  text-decoration: none;
}

.card {
  padding: 20px;
  border-bottom: 1px solid #f0f2f7;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.card h3{
  float: left;
}

.row-bg {
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f7;
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
  margin-left: 20px;
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
  box-sizing: border-box;
}

.el-button:hover {
  background-color: rgba(0, 132, 255, 0.15);
}

i {
  padding-right: 5px;
}

.right a {
  margin-right: 25px;
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
