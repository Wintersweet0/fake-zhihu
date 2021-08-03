<template>
<div>
  <tab-bar/>
  
  <div id="home">
    <router-view class="main_top"></router-view>
    <IndexRight></IndexRight>
    
    
  </div>
  <el-backtop>
      <el-tooltip effect="dark" content="回到顶部" placement="left">
        <button class="back_top" type="button">
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              d="M16.036 19.59a1 1 0 0 1-.997.995H9.032a.996.996 0 0 1-.997-.996v-7.005H5.03c-1.1 0-1.36-.633-.578-1.416L11.33 4.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.005z"
            />
          </svg>
        </button>
      </el-tooltip>
    </el-backtop>
</div>
</template>

<script>
// @ is an alias to /src
// import MainHeader from '@/components/MainHeader.vue';
import TabBar from '../components/TabBar.vue';
import IndexRight from './mainchildren/index-right.vue';
export default {
  name: 'Home',
  components: {
    // MainHeader,
    TabBar,
    IndexRight
  },
};
</script>

<style scoped>
#home {
  width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.back_top {
  padding: 8px;
  color: #73859a;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  box-shadow: 0 1px 3px rgba(26,26,26,.1);
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  border: none;
  background-color: white;
  text-align: center;
  justify-content: center;
}

.back_top:hover {
  background-color: #cdcdcd;
}
</style>
