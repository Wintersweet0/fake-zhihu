<template>
  <div id="main">
    <div class="main-left">
      
      <el-card class="box-card" body-style="padding: 0;">
        
        <router-view></router-view>
      </el-card>
      <comment-dialog ></comment-dialog>
    </div>
    
  </div>
</template>

<script>
import CommentDialog from '../components/comment/CommentDialog.vue';
export default {
  name: "Answer",
  components: {
    CommentDialog,
  }
}
</script>

<style scoped>
#main {
  width: 1000px;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.main-left {
  margin-top: 52px;
  width: 694px;
}

.right {
  margin-top: 52px;
  width: 296px;
}

.clearfix{
  text-align: left;
}

.clearfix a {
  color: black;
  margin-right: 40px;
}

.clearfix .router-link-active {
  color: #0084ff !important;
}

.el-card {
  margin-bottom: 10px;
}
</style>
