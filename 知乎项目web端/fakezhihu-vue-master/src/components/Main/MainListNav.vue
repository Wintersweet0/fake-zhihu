<template>
  <div id="main">
    <div class="main-left">
      <el-card class="box-card" body-style="padding: 0;">
        <div slot="header" class="clearfix">
          <router-link :to="{name: 'Recommend'}">推荐</router-link>
          <router-link :to="{name: 'Follow'}">关注</router-link>
          <router-link :to="{name: 'Hot'}">热榜</router-link>
        </div>
        <router-view></router-view>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type'],
  data () {
    return {
      routerNametoIndex: {
        home: '1',
        hot: '2',
      },
      activeIndex: '1',
    };
  },
  mounted () {
    this.activeIndex = this.routerNametoIndex[this.$route.name];
  }
};
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
  width: 694px;
}
.clearfix a {
  color: black;
  margin-right: 40px;
}
.router-link-active {
  color: #0084ff !important;
}
.el-card {
  margin-bottom: 10px;
}
</style>