<template>
  <header class="main-header">
    <div class="header-content">
      <el-row :gutter="0">
        <!-- head上知乎的图片 -->
        <el-col :span="4">
          <router-link class="m-r-20"
                       :to="{name:'home'}">
            <img class="logo"
                 src="../assets/imgs/Mainlogo.jpg"
                 alt="" />
          </router-link>
        </el-col>
        <!-- 首页、发现、话题 -->
        <el-col :span="6"
                :pull="1">
          <el-menu :default-active="activeIndex"
                   class="m-r-20"
                   mode="horizontal"
                   @select="handleSelect">
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">发现</el-menu-item>
            <el-menu-item index="3">话题</el-menu-item>
          </el-menu>
        </el-col>
        <!-- 搜索框和放大镜
        <el-col :span="8"
                :pull="2">
          <div class="search">
            <el-input size="small"
                      class="m-r-10"
                      placeholder="请输入内容"
                      v-model="keywords">
              <el-button slot="append"
                         icon="el-icon-search"></el-button>

            </el-input>
          </div>
        </el-col> -->
        <!-- 提问的按钮 -->
        <el-col :span="2"
                :pull="2">
          <el-button size='small'
                     class="problemBtn"
                     type='primary'>提问</el-button>
        </el-col>
        <!-- 登录按钮 -->
        <el-col :span="4"
                :pull="1">
          <!-- 登录前 -->
          <div class="userInfo"
               v-if="!isLogin">
            <router-link :to="{name:'signup'}">登录</router-link>
          </div>
          <!-- 登录后 -->
          <div class="header-profile"
               v-if="isLogin">
               <el-popover
                  placement="bottom"
                  trigger="click">
                  <tab-bar-list 
                    class="bell-list" 
                    :bell="bell"
                    :key="timer">
                  </tab-bar-list>
                  <div class="header-profile-bell" slot="reference" @click="handleLoad">
                    <div class="bell-span"></div>
                  </div>
                </el-popover>
                
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
                </el-popover>
                <!-- 头像 -->
                <el-popover>
                <div class="header-profile-myself" slot="reference">
                  <a href="javascript:;">
                    <img :src="userInfo.avatarUrl" alt="" class="profile-img">
                  </a>
                </div>
                <profile-list class="profile-list">

                </profile-list>
                </el-popover>
            <!-- <i class="el-icon-bell m-r-40 icon-item"></i>
            <i class="el-icon-message m-r-40 icon-item"></i>
            <el-dropdown placement="bottom"
                         trigger="click"
                         class="hand-click">
              <span class="userAvatar">
                {{userInfo.username}}
                <el-avatar size="medium"
                           :src="userInfo.avatarUrl"></el-avatar>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="goToPersonalPage">
                    <span class="el-icon-user"></span>
                    我的主页
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <i class="el-icon-setting">设置</i>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <div @click="logout">
                    <span class="el-icon-switch-button"></span>
                    退出
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            
          </div>
        </el-col>
      </el-row>
    </div>
  </header>
</template>

<script>
import { get, post } from '../axios/apis';
export default {
  data () {
    return {
      activeIndex: '1',
      keywords: '',
      isLogin: false,
      userInfo: {
        id: '',
        username: '',
        introduction: '',
        sex: '',
        telephone: '',
        password: '',
        avatarUrl: ''
      },
    };
  },
  methods: {
    handleSelect (key) {
      console.log(key);
    },
    goToPersonalPage () {
      console.log('跳转到用户首页');
    },
    async logout () {
      await post('/api/users/logout').then((res) => {
        if (res.status === 200) {
          this.$Message.success('注销成功');
          this.loginName = "";
          this.$router.push({ name: 'signup' });
        } else {
          this.$Message.error('注销失败，请稍后再试');
        }
      });
    },
    //2021.4.18该改这儿了
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
    }
    // async checkLogin () {
    //   await get('/api/users/checkLogin').then((res) => {
    //     if (res.status === 200) {
    //       this.loginName = res.data.loginName
    //       this.isLogin = true;
    //     } else {
    //       this.$router.push({ name: 'signup' });
    //       this.isLogin = false;
    //     }
    //   });
    // }
  },
  mounted () {
    window.removeEventListener('beforeunload', this.checkLogin())
  },
};
</script>

<style scoped>
.header-content {
  /* width: 1032px; */
  height: 52px;
  padding: 10px;
  border-bottom: 5px solid rgb(249, 249, 249);
  margin: 0 auto;
}
/* 整体的下划线进行隐藏 */
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
/* 导航栏的间距等样式 */
.el-menu-item {
  padding: 0 20px;
  font-size: 16px;
  font-weight: bold;
}
.m-r-20 {
  height: 54px;
  margin-left: 40px;
}
.search,
.problemBtn {
  margin-top: 15px;
  margin-left: -20px;
}
.userInfo {
  margin-left: 20px;
  margin-top: 6px;
}
.icon-item,
.userAvatar {
  margin: 0 15px;
}
/* 个人信息那几个按钮 */
.header-profile{
  position: absolute;
  right:10px;
  min-width: 150px;
  height: 31px;
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
  background: url("../assets/imgs/header/header-bell-lighter.png") no-repeat;
  background-size: cover;
  cursor: pointer;
}
.bell-span:hover{
  background: url("../assets/imgs/header/header-bell-deeper.png") no-repeat;
  background-size: cover;
}
.header-profile-chat div{
  display:block;
  height: 25px;
  width: 25px;
  background: url("../assets/imgs/header/header-chat-lighter.png") no-repeat;
  background-size: cover;
  cursor: pointer;
}
.chat-span:hover{
  background: url("../assets/imgs/header/header-chat-deeper.png") no-repeat;
  background-size: cover;
}
.header-profile-myself{
  cursor: pointer;
}
</style>