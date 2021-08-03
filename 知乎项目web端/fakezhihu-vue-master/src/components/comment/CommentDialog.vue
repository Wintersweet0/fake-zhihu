<template>
  <div>
    <!-- 评论功能弹出框 -->
    <el-dialog title="评论" :visible.sync="commentDialogVisible" width="1000px">
      <div class="main-song-list" style="height: 360px; overflow: hidden scroll; width: 100%">
        <el-table :data="commentlist" style="width: 100%" :stripe="true" :show-header="false">
          <el-table-column type="id" width="60px"></el-table-column>
          <el-table-column prop="Username" label="用户ID">
            <template slot-scope="scoped">
              <div class="music-img-title">
                <el-image :src="scoped.row.pic" style="width:32px; height: 31px; border-radius: 8px">
                  <div slot="placeholder" class="image-slot">
                    <i class="el-icon-picture" style="font-size: 50px; color: #f1f1f1"></i>
                  </div>
                </el-image>
                <span style="margin-left: 10px">{{ scoped.row.Username }}</span>
                <span style="width: 10px">：</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="Content" label="评论内容" width="770%"></el-table-column>
          <!-- <el-table-column prop="time" label="时长" width="100"></el-table-column> -->
        </el-table>
      </div>
      <br />
      <span>
        <el-input v-model="commentForm.comment" placeholder="请输入评论" style="margin-left: 5%; width: 70%"></el-input>
        <el-button style="margin-left: 3%" type="primary" @click="addComment()">发 送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {get, post} from '../../axios/apis'
import {eventBus} from '../../main.js'
export default {
  name: 'CommentDialog',
  data(){
    return{
      commentDialogVisible: false,//控制评论框弹出
      //评论的结构（用数组表示），模仿Newmusic.vue
      commentItem: null,
      commentlistIndex: 0,
      commentlist: [],
      commentForm: {
        comment: '',
      },
    }
  },
  methods: {
    async getComment(){
      this.commentlist = []
      let param = {
        answerid: this.commentItem.answer.id
      }
      await get('/comment/get_commentlist', param).then((res) => {
        const arrData = []
        res.data.data.forEach((item) => {
          const arr = {}
          arr.id = item.comment.id
          arr.pic  = 'http://116.62.222.212/api/user/view/'+item.user.id.toString()
          arr.Username = item.user.username
          arr.Content = item.comment.content
          arrData.push(arr)
        })
        this.commentlist = arrData
      })
    },
    async addComment() {
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      if(tk){
        var form = new FormData()
        form.append('userid', tk.id)
        form.append('answerid', this.commentItem.answer.id)
        form.append('content', this.commentForm.comment)
        let headers= { 'Content-Type': 'multipart/form-data' }
        await post('/comment/create_comment', form, headers)
          .then(res => {
            console.log(res)
            if (res.data.code == 200) {
              this.$message.success("评论成功")
              this.getComment()
              this.commentForm.comment = ''
            }
            else {
              this.$message.error("评论失败")
            }
          }).catch(err => {
            console.log(err)
            if (typeof err.response != "undefined") {
              this.$message.error(err.response.data.msg)
            }
            else {
              console.log(err)
            }
          })
      }else{
        this.$router.push({ name: 'signup' });
      }
    },
  },
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
}
</script>

<style scoped>
.main-song-list .main-page {
  width: 350px;
  margin: 0 auto;
  height: 420px;;
  padding: 10px 0;
  box-sizing: border-box;
  margin-bottom: 10px;
  overflow: scroll;
}

.music-img-title {
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>