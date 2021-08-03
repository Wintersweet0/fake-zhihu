<template>
  <div>
    <!-- Form -->
    <el-dialog title="写回答" :visible.sync="answerBarVisible" :append-to-body="true">
      <el-form :model="askForm">
        <el-form-item label="回答内容" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入您想说的"
            v-model="askForm.introduction">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="answerBarVisible = false">取 消</el-button>
        <el-button type="primary" @click="releaseQuestion">发布回答</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get, post } from '../../axios/apis';
export default {
  data() {
    return {
      answerBarVisible: false,
      askForm: {
        title: '',
        introduction: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      //标签
      topics: [
        // {
        //   id: 'HTML',
        //   name: 'HTML'
        // }, {
        //   id: 'CSS',
        //   name: 'CSS'
        // }, {
        //   id: 'JavaScript',
        //   name: 'JavaScript'
        // }

      ],
      topic: null,
    };
  },
  methods: {
    getTopicList(){
      get('/question/get_topiclist').then((res) => {
        this.topics = res.data.data
      })
    },
    async releaseAnswer(){
      
      this.answerBarVisible = false
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      let formData = new FormData();
      formData.append("title", this.askForm.title)
      formData.append("userid", tk.id)
      formData.append("introduction", this.askForm.introduction)
      formData.append("topicid", this.topic.id)
      let headers = { 'Content-Type': 'multipart/form-data'}
      
      post('/question/create_question', formData, headers).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    }
  },
  mounted(){
    this.getTopicList()
  }
};
</script>
<style scoped>

</style>