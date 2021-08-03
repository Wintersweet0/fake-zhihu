<template>
  <div class="search-bar" ref="form">
    <form class="search-tool" >
      <div>
        <label class="search-main" v-if="true" ref="label">
          <input type="text" placeholder="点击搜索" class="search-input" @blur="onBlur" @focus="onFocus" ref="input">
          <div class="search-button">
            <a><img src="../../assets/imgs/search-icon.png" alt=""></a>
          </div>
        </label>
      </div>
    </form>
    <button class="ask-button" ref="askbutton" @click="showAskBar">提问</button>
    <div class="hot-list" v-show="activeSearch">
      <div class="hot-list-header">
        <div class="inner-text">
          知乎热搜
          <span></span>
        </div>
      </div>
      <ul class="hot-list-content" ref="list">
        <!-- <li>啊啊啊胜多负少</li>
        <li>士大夫首发式地方</li>
        <li> 首发申购大锅饭大概</li>
        <li>是的附属国豆腐干的</li>
        <li>士大夫士大夫大师傅但是</li> -->
      </ul>
      <div class="hot-list-bottom">
      </div>
    </div>
    <ask-bar ref="askbar"></ask-bar>
  </div>
</template>
<script>
import AskBar from './ChildHeaderProfile/AskBar';
export default {
  name:"SearchBar",
  data(){
    return {
    activeSearch:false,
    }
  },
  components: {
    AskBar,
  },
  methods:{
    onBlur(){
      this.$refs.label.style.width="326px"
      this.$refs.askbutton.style.opacity="1";
      this.$refs.askbutton.style.transform="scale(1)";
      this.$refs.form.style.background="#f6f6f6";
      this.$refs.input.style.background="#f6f6f6";
      setTimeout(() => {
        this.activeSearch=false;
      }, 200);
    },
    onFocus(){
      // console.log("焦点出现");
      this.$refs.label.style.width="400px";
      this.$refs.askbutton.style.opacity="0";
      this.$refs.askbutton.style.transform="scale(0)";
      this.$refs.form.style.background="white";
      this.$refs.input.style.background="white";
      setTimeout(() => {
        this.activeSearch=true;
      }, 300);
    },
    showAskBar(){
      let tk = JSON.parse(window.sessionStorage.getItem("token"))
      if(tk){
        this.$refs.askbar.askBarVisible = true;
      }else{
        this.$router.push({path:'/signup'})
      }
    }
  },
  mounted(){
    var listBox = document.getElementsByClassName("hot-list-content"),
    contentBox=listBox[0].getElementsByTagName("li");
    for(let i=0;i<contentBox.length;i++){
      contentBox[i].addEventListener("mouseenter",function(){
      this.style.background="#f6f6f6";
    });
    contentBox[i].addEventListener("mouseleave",function(){
      this.style.background="#fff";
    })
    }
  }
}
</script>
<style scoped>
  .search-bar{
    position: relative;
    /* width: 400px; */
    height: 34px;
    display:flex;
    align-items: center;
    background: #f6f6f6;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    /* float: left; */
    /* left:-30px; */
  }
  .search-main{
    display:flex;
    width: 326px;
    padding-left: 12px;
    padding-right: 0;
    transition: width linear .3s ;
    transition-delay: .1s;
  }
  .search-button{
    position: absolute;
    right:10px;
    cursor: pointer;
  }
  .search-button img{
    width: 18px;
    height: 18px;
  }
  .activeSearch{
    width:400;
  }
  .ask-button{
    position: absolute;
    transform:scale(1);
    z-index: 103;
    padding: 0 14px;
    width:60px;
    left:340px;
    /* float: left; */
    height: 34px;
    line-height: 34px;
    background-color: var(--color-lighter-blue);
    color:white;
    border: 1px solid;
    border-radius: 3px;
    font-size:14px;
    border-color: #0084ff;
    cursor: pointer;
    transition: opacity linear .2s ,
                transform linear .2s;
    transition-delay: .1s;
  }
  .childtabbar>button:hover{
    background-color: var(--color-deeper-blue);
  }
  .hot-list{
    position: absolute;
    z-index:200;
    top:100%;
    margin-top: 15px;
    background-color: #fff;
  }
  .hot-list-header{
    position: relative;
    width: 400px;
    height: 40px;
    border-radius: 5px 5px 0 0;
    border:1px solid #F1F1F1;
    border-bottom:0;
  }
  .inner-text{
    position: absolute;
    width: 350px;
    height: 40px;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    border-bottom:1px solid #F1F1F1;
    line-height: 40px;
    color:#8590A6;
    font-size: 15px;
  }
  .inner-text span{
    display:inline-block;
    height: 17px;
    width: 17px;
    background: url("../../assets/imgs/header/fire.jpg") no-repeat;
    background-size: cover;
    margin-left: 5px;
  }
  .hot-list-content{
    list-style:none;
  }
  .hot-list-content li{
    height: 35px;
    width: 400px;
    border-left:1px solid #F1F1F1;
    border-right:1px solid #F1F1F1;
    line-height: 35px;
    padding-left: 23px;
    font-size: 15px;
    color:black;
  }
  .hot-list-bottom{
    position: relative;
    width: 400px;
    height: 5px;
    border-radius: 0 0 5px 5px;
    border:1px solid #F1F1F1;
    border-top:0;
  }
</style>