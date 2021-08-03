<template>
  <div class="main-content">
    <el-container class="container">
      <main-list-nav />
      <div class="sidebar">
        <main-sidebar />
      </div>
    </el-container>
  </div>
</template>

<script>
import MainListNav from '@/components/Main/MainListNav.vue';
import MainSidebar from '@/components/Main/MainSidebar.vue'
export default {
  name: 'MainList',
  components: {
    MainListNav,
    MainSidebar,
  },
};
</script>

<style>
.container {
  justify-content: center;
}
</style>