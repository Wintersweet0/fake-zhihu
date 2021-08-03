<template>
<!-- 首页、发现、等你来答 -->
  <div class="childtabbar">
    <div class="main-icon" @click="mainClick">
      <a href="javascript:;">
        <img src="../../assets/imgs/main-icon.png" alt="">
      </a>
    </div>
    <div class="mainitem">
      <div v-for="(item,index) in titles"
       :key="index"
        class="itembar"
         :class="{'active':currentIndex===index}"
        @click="itemClick(index)">
        {{item}}
      </div>
    </div>
      <search-bar></search-bar>
    <header-profile></header-profile>
  </div>
</template>
<script>
import HeaderProfile from "./HeaderProfile"
import SearchBar from "./SearchBar"
import {eventBus} from '../../main.js'
export default {
  name:"ChildTabBar",
  components:{
    HeaderProfile,
    SearchBar
  },
  data(){
    return {
      titles:["首页","等你来答"],
      link:["/main","/answer"],
      currentIndex: 0,
      moveTop:false
    }
  },
  methods:{
    // scrollToTop() {
    //   var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    //   // console.log(scrollTop);
    // },
    itemClick(index){
      this.currentIndex=index;
      // console.log(this.link[index]);
      this.$router.push(this.link[index])
    },
    mainClick(){
      this.$router.push("/")
      this.currentIndex=0
    },
    onRouteChanged(){
      let that = this;
      that.path = that.$route.path;
      if (
        that.path.indexOf("/main") == -1 &&
        that.path.indexOf("/answer") == -1
      ){
        this.currentIndex = null;
      }
    },
  },
  created(){
    eventBus.$on('answerSaid', (message) => {
      this.currentIndex = message
    })
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "onRouteChanged",
  }
}
</script>
<style scoped>
.childtabbar{
  position: relative;
  width: 1032px;
  height: 52px;
  display:flex;
  align-items: center;
  /* justify-content: space-between; */
}
.main-icon{
  margin-top: 8px;
  /* float: left; */
  margin-left: 10px;
}
.main-icon img{
  height: 34px;
  width: 68px;
}
.mainitem{
  /* float:left; */
  display:flex;
  min-width: 250px;
  height: 52px;
  line-height: 52px;
  margin-left: 15px;
  margin-right: 10px;
}
.mainitem .itembar{
  /* padding:14px 0; */
  margin: 0 20px;
  cursor: pointer;
  color:#8590A6;
  font-size: 15px;
}
.mainitem .itembar:hover{
  color:#000;
}
.mainitem>.active{
  font-weight: 600;
  color:#000;
  border-bottom:3px solid var(--color-deeper-blue);
}
</style>