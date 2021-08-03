<template>
  <div class="editor">
    <el-container>
      <el-header class="editor-header">
        <editor-header @releaseArticles=releaseArticles />
      </el-header>
      <el-main class="editor-main">
        <div class="content m-t-50">
          <el-input v-model="title"
                    class="m-b-15 editor-title"
                    size="medium"
                    placeholder="请输入标题（最多50个字）" />
          <rich-text-editor ref="textEditor"
                            :content='content'
                            :placeHolder="placeHolder"
                            @updateContent=updateContent />
          <el-select
            style="margin-top: 20px"
            v-model="topic"
            value-key="id"
            filterable
            allow-create
            default-first-option
            placeholder="请选择文章标签">
            <el-option
              v-for="(item) in topics"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
          <!-- <el-upload v-if="imgUrl === ''"
                     class="img-upload"
                     drag
                     action="api/imgs/upload"
                     :on-success="uploadSuc"
                     accept=".jpg,.jpeg,.JPG,.JPEG,.png,.PNG">
            <i class="el-icon-upload"></i>
            <div>添加题图</div>
          </el-upload>
          <el-upload v-if="imgUrl === ''"
                     class="img-upload"
                     drag
                     action="api/imgs/upload"
                     :on-success="uploadSuc"
                     accept=".jpg,.jpeg,.JPG,.JPEG,.png,.PNG">
            <i class="el-icon-upload"></i>
            <div>添加题图</div>
          </el-upload> -->

          <!-- <img v-if="imgUrl !== ''"
               class="oldImg"
               :src="imgUrl"
               @click="$refs.hiddenUpload.click()" />
          <el-upload class="hidden"
                     action="api/imgs/upload"
                     :on-success="uploadSuc"
                     accept=".jpg,.jpeg,.JPG,.JPEG,.png,.PNG">
            <div ref="hiddenUpload"></div>
          </el-upload> -->
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import EditorHeader from '@/components/Editor/EditorHeader.vue';
import RichTextEditor from '@/components/Editor/RichTextEditor.vue';
import { get, post } from '../axios/apis';
// import { getCookies } from '../lib/utils.js';
// eslint-disable-next-line no-unused-vars
import { imgDec } from '../lib/config.js';
export default {
  name: "Editor",
  components: {
    EditorHeader,
    RichTextEditor,
  },
  data () {
    return {
      title: '',
      content: '',
      contentText: '',
      placeHolder: '请输入正文',
      imgUrl: '',
      //标签
      topics: [
        // {
        //   id: 1,
        //   name: 'HTML'
        // }, {
        //   id: 2,
        //   name: 'CSS'
        // }, {
        //   id: 3,
        //   name: 'JavaScript'
        // }
      ],
      topic: {
      },
    };
  },
  mounted () {
    this.getTopicList()
    //将富文本的默认图片上传方法改为imgHandler
    // this.$refs.myQuillEditor.quill.getModule('toolbar').addHandeler('image', this.imgHandler);
  },
  methods: {
    updateContent (content, contentText) {
      this.content = content;
      this.contentText = contentText;
    },
    // imgHandler (image) {
    //   if (image) {
    //     this.$refs.hiddenUploade.click();
    //   }
    // },
    // eslint-disable-next-line no-unused-vars
    // uploadSuc (response) {
    //   // eslint-disable-next-line no-unused-vars
    //   const url = '${imgDec}${respinse.fileName}';
    //   const fake = '../assets/imgs/logo.png';
    //   this.$refs.myQuillEditor.quill.insertEmbed(this.$refs.myQuillEditor.quill.getSelection(), 'image', fake)
    // },
    // releaseArticles () {
    //   //发布文章方法
    //   if (parseFloat(this.$route.params.articleId) !== 0) {
    //     //修改文章方法
    //   } else {
    //     this.createArticle(); //调用新建文章方法
    //   }
    // },
    getTopicList(){
      get('/question/get_topiclist').then((res) => {
        this.topics = res.data.data
        console.log(this.topics)
      })
    },
    releaseArticles () {
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      let formData = new FormData();
      formData.append("userid", tk.id)
      formData.append("content", this.content)
      formData.append("title", this.title)
      formData.append("topicid", this.topic.id)
      let headers = { 'Content-Type': 'multipart/form-data'}
      
      post('/answer/create_article', formData, headers).then((res) => {
        if (res.data.code === 200) {
          console.log(res.data.data)
          this.$Message.success(res.data.msg);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
.editor-header {
  padding: 0;
}
.editor-main {
  background-color: rgb(248, 248, 248);
  height: 100vh;
}
.content {
  width: 80%;
  margin: 0 auto;
}
.editor-title {
  margin-bottom: 30px;
}
</style>