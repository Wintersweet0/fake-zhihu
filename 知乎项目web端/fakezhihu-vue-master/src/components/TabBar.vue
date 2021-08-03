<template>
  <div class="tabbar">
    <child-tab-bar></child-tab-bar>
  </div>
</template>
<script>

import ChildTabBar from "./childtabbar/ChildTabBar"

export default {
  name:"TabBar",
  components:{
    ChildTabBar
  }
}
</script>
<style scoped>
  .tabbar{
    /* position: relative; */
    position: fixed;
    z-index: 100;
    min-width: 1032px;
    width: 100%;
    /* overflow: hidden; */
    background: #fff;
    box-shadow:0 1px 3px rgba(26,26,26,.1);
    /* width:100vw; */
    /* height: 52px; */
    /* border-bottom:1px solid gray; */
    display:flex;
    justify-content: center;
  }
</style>