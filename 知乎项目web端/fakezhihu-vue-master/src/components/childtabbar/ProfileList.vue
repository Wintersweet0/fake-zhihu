<template>
  <div id="tab-bar-list">
    <div class="list-header">
    </div>
      <div class="profile-list-content" v-if="listVisible">
        <div @click="topeople()"><img src="../../assets/imgs/header/profile/myself.png" alt=""><span>我的主页</span></div>
        <!-- <div><img src="../../assets/imgs/header/profile/writer.png" alt=""><span>创作者中心</span></div>
        <div><img src="../../assets/imgs/header/profile/wheel.png" alt=""><span>设置</span></div> -->
        <div @click="logout"><img src="../../assets/imgs/header/profile/close.png" alt=""><span>退出</span></div>
      </div>
    <div class="list-bottom">
    </div>
  </div>
</template>
<script>
export default {
  name:"TabBarList",
  props:["isLogin"],
  data(){
    return{
      listVisible: true,
    }
  },
  methods: {
    topeople(){
      this.$router.push("/people")
    },
    logout() {
      this.$emit("userLogout", false)
      this.$Message.success('账号已退出')
    },
  },
  mounted() {
    var listBox = document.getElementsByClassName("profile-list-content"),
    contentBox=listBox[0].getElementsByTagName("div");
    // console.log(contentBox,listBox);
    
    for(let i=0;i<contentBox.length;i++){
      // console.log(contentBox[i]);
      
      contentBox[i].addEventListener("mouseenter",function(){
        this.style.background="#f6f6f6";
      });
      contentBox[i].addEventListener("mouseleave",function(){
        this.style.background="#fff";
      })
      contentBox[i].addEventListener("click",function(){
        this.listVisible = false
      })
    }
  },
}
</script>
<style scoped>
  /* #tab-bar-list{
    position: absolute;
    top:100%;
  } */
  .list-header{
    /* position: relative; */
    width: 148px;
    height: 7px;
    display:flex;
    align-items: center;
    border-radius: 5px 5px 0 0;
    border:1px solid #F1F1F1;
    /* margin-top: 15px; */
    background: white;
    border-bottom:0;
  }
  /* .list-header:before{
    position: absolute;
    content:"";
    height: 0;
    width: 0;
    border-style:solid;
    border-color: transparent transparent #F1F1F1 transparent;
    border-width:10px;
    left:50%;
    top:-20px;
    transform:translate(-50%);
  }
  .list-header:after{
    position: absolute;
    content:"";
    height: 0;
    width: 0;
    border-style:solid;
    border-color: transparent transparent #fff transparent;
    border-width:9px;
    left:50%;
    top:-18px;
    transform:translate(-50%);
  } */
  .profile-list-content{
    width: 148px;
    height: 72px;
    overflow-x:hidden;
    overflow-y: auto;
    border:solid 1px #F1F1F1;
    border-bottom:0;
    border-top:0;
  }
  .profile-list-content div{
    height: 36px;
    width: 148px;
    /* text-align: center; */
    line-height: 36px;
    /* vertical-align: middle; */
    cursor: pointer;
    font-size: 15px;
    background-color: #fff;
  }
  .profile-list-content div img{
    height: 19px;
    width: 16px;
    margin-left: 15px;
    margin-right: 5px;
    padding-top: 3px;
  }
  .list-bottom{
    width: 148px;
    height: 7px;
    border:solid 1px #F1F1F1;
    border-top:0;
    border-radius: 0 0 5px 5px;
    border-top:0;
  }
</style>