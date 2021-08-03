<template>
<!-- 登录后个人信息相关 -->
<div>
  <div class="header-profile-logout"
        v-if="!isLogin">
    <!-- <el-popover
      >
      <router-link :to="{name:'signup'}">
        <img src="../../assets/imgs/header/header-profile-avatar.png" alt="" class="profile-img">
      </router-link>
    </el-popover> -->
    <el-popover>
      <div class="header-profile-myself" slot="reference">
        <router-link :to="{name:'signup'}">
          <img src="../../assets/imgs/header/header-profile-avatar.png" title="登录" class="profile-img">
          <p style="float: right; font-size: 90%; margin-left: 10px; margin-top: 10px">登录</p>
        </router-link>
      </div>
    </el-popover>
  </div>
  <div class="header-profile"
        v-if="isLogin">
      <!-- <el-popover
        placement="bottom"
        trigger="click">
        通知铃铛
        <tab-bar-list 
          class="bell-list" 
          :bell="bell"
          :key="timer">
        </tab-bar-list>
        <div class="header-profile-bell" slot="reference" @click="handleLoad">
          <div class="bell-span"></div>
        </div>
      </el-popover> -->
      
      <!-- 私信按钮
      <el-popover
          placement="bottom"
          trigger="click">
        <sec-tab-bar-list 
          class="chat-list"
          :chat="chat"
          >
        </sec-tab-bar-list>
        <div class="header-profile-chat" slot="reference">
          <div class="chat-span"></div>
        </div>
      </el-popover> -->
      <!-- 登录后的用户头像 -->
      <el-popover>
        <div class="header-profile-myself" slot="reference">
          <a href="javascript:;">
            <img :src="userInfo.avatarUrl" alt="" class="profile-img" style="width:32px; height: 31px; border-radius: 8px">
          </a>
        </div>
        <!-- 向子组件传值 -->
        <profile-list class="profile-list" :isLogin="isLogin" @userLogout="logoutUser($event)">

        </profile-list>
      </el-popover>
  </div>
</div>
</template>
<script>
import { get } from '../../axios/apis';
// import TabBarList from "./TabBarList"
// import SecTabBarList from "./SecTabBarList"
import ProfileList from "./ProfileList"


export default {
  name:"HeaderProfile",
  components:{
    // TabBarList,
    ProfileList,
    // SecTabBarList
  },
    data(){
    return{
      isLogin: false,
      bell:{
        list:[
          [],
          [],
          []
        ]
      },
      userInfo: {
        id: '',
        username: '',
        introduction: '',
        sex: '',
        telephone: '',
        password: '',
        avatarUrl: ''
      },
      chat:{
        list:[]
      },
      timer:""
    }
  },
  
  methods: {
    handleLoad(){
      this.timer=new Date().getTime()
    },
    async checkLogin () {
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      if (tk) {
        this.isLogin = true
        let param = {id: tk.id}
        await get('/user/get_user', param).then((res) => {
          this.userInfo = res.data.data
          this.userInfo.avatarUrl = 'http://116.62.222.212/api/user/view/'+res.data.data.id.toString()
        })
      } 
      // else {
      //   this.$router.push({ name: 'signup' });
      //   this.isLogin = false;
      // }
    },
    logoutUser(out){
      this.isLogin = out
      console.log("islogin: "+this.isLogin)
      this.userInfo = {}
      window.sessionStorage.removeItem("token")
    },
  },
  created(){
    this.checkLogin()
    // request().then(res=>{
    //   this.bell.list[0]=res.data.data.header.bell.list0;
    //   this.bell.list[1]=res.data.data.header.bell.list1;
    //   this.bell.list[2]=res.data.data.header.bell.list2;
    //   this.chat.list=res.data.data.header.chat.list0;
    //   console.log(res);
    //   console.log(this.bell.list[0])
    // })
  },
  mounted (){
    
  }
}
</script>
<style scoped>
  .header-profile{
    position: absolute;
    right:10px;
    min-width: 150px;
    height: 5px;
    /* background-color: pink; */
    /* position: absolute; */
    /* right:170px; */
    display:flex;
    justify-content: space-between;
    align-items: center;
    /* float:right; */
  }
  .header-profile-logout{
    position: absolute;
    right:10px;
    min-width: 150px;
    height: 5px;
    /* background-color: pink; */
    /* position: absolute; */
    /* right:170px; */
    display:flex;
    justify-content: space-between;
    align-items: center;
    /* float:right; */
  }
  .header-profile-bell div{
    /* display:block; */
    height: 22px;
    width: 22px;
    background: url("../../assets/imgs/header/header-bell-lighter.png") no-repeat;
    background-size: cover;
    cursor: pointer;
  }
  .bell-span:hover{
    background: url("../../assets/imgs/header/header-bell-deeper.png") no-repeat;
    background-size: cover;
  }
  .header-profile-chat div{
    display:block;
    height: 25px;
    width: 25px;
    background: url("../../assets/imgs/header/header-chat-lighter.png") no-repeat;
    background-size: cover;
    cursor: pointer;
  }
  .chat-span:hover{
    background: url("../../assets/imgs/header/header-chat-deeper.png") no-repeat;
    background-size: cover;
  }
  .header-profile-myself{
    cursor: pointer;
  }
  /* .profile-list{
    position: absolute;
    right:-20px;
  } */
</style>
