<template>
    <div>
        <el-menu
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      :default-active="$route.path"
      :collapse="isCollapse"
      router
      active-text-color="#ffd04b">
      <el-menu-item index="/home/index">
        <i class="el-icon-eleme"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/home/course">
        <i class="el-icon-s-goods"></i>
        <span slot="title">私教课程</span>
      </el-menu-item>
      <el-menu-item index="/home/user">
        <i class="el-icon-s-goods"></i>
        <span slot="title">客户信息</span>
      </el-menu-item>
    </el-menu>
    </div>
</template>

<script>
  export default {
    created(){
        console.log(this.$route);
    },  
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    computed: {
      isCollapse(){
        return this.$store.state.isCollapse
      }
    }
  }
</script>
<style scoped lang="scss">
    ::v-deep .el-menu{
        border: 0 !important;
    }
</style>