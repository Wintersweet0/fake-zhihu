<template>
  <div id="follow" ref="list">
    <div class="card" v-for="(item, index) in followList" :key="index">
      <a class="user">
        <el-image
          style="width: 60px; height: 60px; border-radius: 4px; cursor: pointer;"
          :src="item.avatarUrl"
          fit="fit"
        ></el-image>
        <span
          style="
            padding-left: 10px;
            font-size: 18px;
            font-weight: 600;
            height: 30px;
            cursor: pointer;
          "
          >{{ item.username }}</span
        >
      </a>
      <span
        style="
          position: absolute;
          margin-top: 30px;
          margin-left: 70px;
          font-size: 15px;
          height: 30px;
          color: #646464;
        "
        >{{ checkText(item.introduction) }}</span
      >
      <span
        style="
          position: absolute;
          margin-top: 30px;
          margin-left: 500px;
        ">
        <button
          type="button"
          class="btn"
          @click="deleteFollow(item, index)"
        >
          取消关注
        </button>
      </span>
      <!-- <div class="footer">
        <div class="right">
          <a> {{ item.comment }} 回答 </a>
          <a> {{ item.comment }} 关注者 </a>
        </div>
      </div> -->
      
    </div>
    <div
      class="card"
      v-loading="loading"
      style="height: 40px"
      v-show="loading"
    ></div>
  </div>
</template>

<script>
import { get, del} from '../../axios/apis';
export default {
  name: "FollowPeople",
  data() {
    return {
      followList: [
        // {
        //   link: "?",
        //   title: "独立宣言",
        //   username: "二次元虎哥哥哥",
        //   picture: "虎",
        //   content: "ok兄弟们，全体目光向我看齐啊",
        //   comment: "10",
        // },
        // {
        //   link: "?",
        //   title: "独立宣言",
        //   username: "二次元虎哥",
        //   picture: "虎",
        //   content: "ok兄弟们，全体目光向我看齐啊",
        //   comment: "10",
        // },
        // {
        //   link: "?",
        //   title: "独立宣言",
        //   username: "二次元虎哥",
        //   picture: "虎",
        //   content: "ok兄弟们，全体目光向我看齐啊",
        //   comment: "10",
        // },
        // {
        //   link: "?",
        //   title: "独立宣言",
        //   username: "二次元虎哥",
        //   picture: "虎",
        //   content: "ok兄弟们，全体目光向我看齐啊",
        //   comment: "10",
        // },
      ],
      loading: true,
    };
  },
  methods: {
    checkText(str) {
      let l = str.replace(/[\u0391-\uFFE5]/g, "aa").length; //先把中文替换成两个字节的英文，在计算长度
      if (l > 130) return str.substring(0, 130) + "...";
      return str;
    },
    async getList() {
      this.followList = []
      this.loading = true;
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      let param = {userid: tk.id}
      await get('/user/follow_list', param).then((res) => {
        res.data.data.forEach(element => {
          element.avatarUrl = 'http://116.62.222.212/api/user/view/'+element.id.toString()
          this.followList.push(element)
        });
      })
      this.loading = false;
    },
    async deleteFollow(item, index){
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      let param = {
        userid: tk.id,
        followid: item.id
      }
      console.log(param)
      await del('/user/cancel_follow', param).then((res) => {
        if(res.data.code == 200){
          this.$Message.success(res.data.msg)
          this.followList.splice(index, 1)
        }else{
          this.$Message.error(res.data.msg)
        }
      })
    }
    // handleScroll() {
    //   let scrollTop =    //     window.pageYOffset ||
    //     document.documentElement.scrollTop ||
    //     document.body.scrollTop;
    //   let listHeight =
    //     this.$refs.list.offsetHeight -
    //     document.body.offsetHeight +
    //     this.$refs.list.offsetTop;
    //   if (scrollTop > listHeight) {
    //     this.getList();
    //   }
    // },
  },
  mounted() {
    this.getList();
    //尝试做一个类似真正知乎的hover
    // let btn = document.getElementsByClassName("btn")
    // for(let i = 0; i < btn.length; i++){
    //   btn.addEventListener("mou")
    // }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
a {
  color: black;
  text-decoration: none;
}

.card {
  padding: 20px;
  border-bottom: 1px solid #f0f2f7;
  display: flex;
  flex-direction: column;
}

.card h3 {
  float: left;
}

.content {
  text-align: left;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.title {
  margin-bottom: 5px;
}

.title:hover {
  color: #175199;
}

.text {
  font-size: 15px;
  flex: 1 1;
}

.text:hover {
  color: #646464;
}

.image {
  margin-right: 20px;
}

.footer {
  margin-top: 5px;
  margin-left: 60px;
  display: flex;
  align-items: center;
}

.btn{
  font-size: 14px;
  line-height: 32px;
  text-align: center;
  width:96px;
  cursor: pointer;
  color: #fff;
  background-color: #76839b;
  border-color: #76839b;
  border-radius: 3px;
  border: 1px solid;
}

.el-button {
  color: #0084ff;
  background: rgba(0, 132, 255, 0.1);
  border-color: transparent;
  padding: 10px;
}

.el-button:hover {
  background-color: rgba(0, 132, 255, 0.15);
}

i {
  padding-right: 5px;
}

.right a {
  margin-left: 10px;
  font-size: 15px;
  color: #73859a;
  cursor: pointer;
}

.right a:hover {
  color: #62788e;
}

.all {
  color: #175199;
  font-size: 14px;
}

.all:hover {
  color: #646464;
}

.user {
  display: flex;
  margin-bottom: 10px;
  width: 476px;
}
</style>
