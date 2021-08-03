<template>
  <div id="recommend" ref="list">
    <el-row type="flex" class="row-bg">
      <el-col style="width:15px"></el-col>
      <el-button type="info" @click="getList(item.id)" v-for="(item, index) in topics" :key="index">
        {{item.name}}
      </el-button>
    </el-row>
    <div class="card" v-for="(item, index) in recommendList" :key="index">
      <a class="title" >
        <h3>{{item.title}}</h3>
      </a>
      <div class="content">
        <!-- <a :href="item.link" class="image" v-if="item.picture">
          <el-image
            style="width: 190px; height: 105px; border-radius: 4px;"
            :src="item.picture"
            fit="fit"
          ></el-image>
        </a> -->
        <a class="text">
          {{item.introduction}}
          <a class="all" v-if="item.showAll" @click="item.showAll=false">
            阅读简介
            <i class="el-icon-arrow-down"></i>
          </a>
        </a>
      </div>
      <div class="footer">
        <div class="left">
          <el-button type="primary" icon="el-icon-edit" @click="showAnswerBar">写回答</el-button>
            <el-dialog title="写回答" :visible.sync="answerBarVisible" :append-to-body="true">
                <el-form :model="answerForm">
                    <el-form-item label="回答内容" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入您想说的"
                        v-model="answerForm.content">
                    </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="answerBarVisible = false">取 消</el-button>
                    <el-button type="primary" @click="releaseAnswer(item)">发布回答</el-button>
                </div>
            </el-dialog>
        </div>
      </div>
    </div>
    <div class="card" v-loading="loading" style="height: 40px;" v-show="loading"></div>
  </div>
</template>

<script>
// import AnswerBar from './AnswerBar'
import { get, post } from '../../axios/apis'
import {eventBus} from '../../main.js'
export default {
  name: "recommend",
  data() {
    return {
      recommendListId: [],
      recommendList: [
        // {
        //   link:'?',
        //   title:'独立宣言',
        //   picture:'虎',
        //   content:'ok兄弟们，全体目光向我看齐啊',
        //   comment:'10',
        // },
      ],
      topics:[],
      formLabelWidth: '120px',
      answerBarVisible: false,
      answerForm: {
        content: '',
      },
      loading: true
    }
  },
  components: {
      
  },
  methods: {
    unique(arr) {
        const map = new Map()
        return arr.filter( item => !map.has(JSON.stringify(item)) && map.set(JSON.stringify(item), 1))
    },
    openCommentDialog(){
      eventBus.$emit('recommendSaid', true)
    },
    // checkText(item) {
    //   var input = item.introduction;
    //   input = input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,'').replace(/<[^>]+?>/g,'').replace(/\s+/g,' ').replace(/ /g,' ').replace(/>/g,' ');
    //   console.log(input)
    //   let l = input.length
    //   if(item.showAll == true){
    //     if (l > 130) return input.substring(0, 130) + "..."
    //     return input
    //   }else{
    //     return input
    //   }
    // },
    // checkText(str) {
    //   let l = str.replace(/[\u0391-\uFFE5]/g, "aa").length //先把中文替换成两个字节的英文，在计算长度
    //   if (l > 130) return str.substring(0, 130) + "..."
    //   return str
    // },
    showAnswerBar(){
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      if(tk){
        this.answerBarVisible = true;
      }else{
        this.$router.push({path:'/signup'})
      }
    },
    async releaseAnswer(item){
      
      this.answerBarVisible = false
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      let formData = new FormData();
      formData.append("userid", tk.id)
      formData.append("questionid", item.id)
      formData.append("topicid", item.topicid)
      formData.append("content", this.answerForm.content)
      let headers = { 'Content-Type': 'multipart/form-data'}
      
      await post('/answer/create_answer', formData, headers).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    async getTopicList(){
      await get('/question/get_topiclist').then((res) => {
        this.topics = res.data.data
      })
    },
    async getList(topicid) {
      this.recommendListId = []
      this.recommendList = []
      this.loading = true
      let param = {
        topicid: topicid
      }
      await get('/answer/get_topicanswer', param).then((res) => {
        res.data.data.forEach(element => {
          if(element.data.answer.isarticle == 0){
            this.recommendList.push(element.data.question)
          }
        });
        this.recommendList = this.unique(this.recommendList)
        // this.recommendList=Array.from(new Set(this.recommendListId))
        // console.log(this.recommendListId)
      })
    //   let param2 = {
    //     idlist: this.recommendListId.join(",")
    //   }
    //   this.recommendListId.join(",").forEach
      
    //   await get('/answer/get_answerlist', param2).then((res) => {
    //     // this.recommendList = res.data.data
    //     console.log(res.data)
    //     res.data.data.forEach((element) => {
    //       element.user.avatarUrl = 'http://116.62.222.212/api/user/view/'+element.user.id.toString()
    //       element.showAll = true
    //       console.log(element.user.avatarUrl)
    //       this.recommendList.push(element)
    //     })
    //   })
      this.loading = false
    },
    async getAll() {
      this.recommendListId = []
      this.recommendList = []
      for(let i = 0; i < this.topics.length; i++){
        let param = {
          topicid: this.topics[i].id
        }
        await get('/answer/get_topicanswer', param).then((res) => {
          console.log(res.data)
          res.data.data.forEach(element => {
            if(element.data.answer.isarticle == 0){
              this.recommendList.push(element.data.question)
            }
          });
        })
      }
      this.recommendList = this.unique(this.recommendList)
    //   let param2 = {
    //     idlist: this.recommendListId.join(",")
    //   }
    //   await get('/answer/get_answerlist', param2).then((res) => {
    //     res.data.data.forEach((element) => {
    //       element.user.avatarUrl = 'http://116.62.222.212/api/user/view/'+element.user.id.toString()
    //       element.showAll = true
    //       console.log(element.user.avatarUrl)
    //       this.recommendList.push(element)
    //     })
    //   })
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
    window.addEventListener("scroll", this.handleScroll)
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll)
  }
}
</script>

<style scoped>
.user {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.row-bg {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f7;
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
</style>
