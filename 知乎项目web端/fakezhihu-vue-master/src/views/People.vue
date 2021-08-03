<template>
<!-- 我的主页，包括提问的动态、关注列表 -->
  <div id="people">
    <div class="people-main">
      <el-card class="box-card" body-style="padding: 0;">
        <div slot="header" class="clearfix">
          <router-link :to="{name: 'Follow'}">关注动态</router-link>
          <router-link :to="{name: 'Collection'}">收藏回答</router-link>
          <router-link :to="{name: 'Article'}">收藏文章</router-link>
          <router-link :to="{name: 'FollowPeople'}">关注用户</router-link>
        </div>
        <router-view></router-view>
      </el-card>
      <comment-dialog ></comment-dialog>
    </div>

  </div>
</template>
<script>
import CommentDialog from '../components/comment/CommentDialog.vue';
export default {
  name: "People",
  components: {
    CommentDialog,
  },
  data() {
    return {
      activeName: 'second'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
}
</script>
<style scoped>
#people{
  width: 1000px;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.people-main{
  margin-top: 52px;
  width: 694px;
}
.clearfix{
  text-align: left;
  cursor: pointer;
  color:#8590A6;
}
.clearfix a {
  color: black;
  margin-right: 40px;
  color:#000;
}
.router-link-active{
  color: #0084ff !important;
}

.clearfix a:hover{
  color:#000;
}
</style>
