<template>
  <div>
    <!-- Form -->
    <el-dialog title="提问" :visible.sync="askBarVisible" :append-to-body="true">
      <el-form :model="askForm">
        <el-form-item label="问题内容" :label-width="formLabelWidth">
          <el-input v-model="askForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="准确地描述问题更容易得到解答"
            v-model="askForm.introduction">
          </el-input>
        </el-form-item>
        <el-form-item label="问题标签" :label-width="formLabelWidth">
          <el-select
            v-model="topic"
            filterable
            value-key="id"
            allow-create
            default-first-option
            placeholder="请选择文章标签">
            <el-option
              v-for="item in topics"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="askBarVisible = false">取 消</el-button>
        <el-button type="primary" @click="releaseQuestion">发布问题</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get, post } from '../../../axios/apis';
export default {
  data() {
    return {
      askBarVisible: false,
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
    async releaseQuestion(){
      if(!this.topic.id){
        let createTopic = new FormData();
        createTopic.append("name", this.topic)
        let header = { 'Content-Type': 'multipart/form-data'}
        await post("/question/create_topic", createTopic, header).then((res) => {
          this.topic = res.data.data
        })
      }
      this.askBarVisible = false
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