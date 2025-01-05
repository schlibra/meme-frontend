<script setup>
import {ChatLineRound, Expand, Fold, Key, Link, Lock, Star, User} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import displayUtil from "@/lib/displayUtil.js";
import router from "@/router/index.js";

const prop = defineProps(["defaultActive"])
const defaultActive = prop.defaultActive
const expand = ref(false)

onMounted(()=> {
  expand.value = displayUtil.isXs
  window.addEventListener("resize", ()=>expand.value = displayUtil.isXs)
})

function gotoBasic() {
  router.push("/user/basic")
}
function gotoSecurity() {
  router.push("/user/security")
}
function gotoPermission() {
  router.push("/user/permission")
}
function gotoPicture() {
  router.push("/user/picture")
}
function gotoScore() {
  router.push("/user/score")
}
function gotoComment() {
  router.push("/user/comment")
}
function gotoBind() {
  router.push("/user/bind")
}
</script>

<template>
  <el-menu :default-active="defaultActive" class="menu" :collapse="expand">
    <el-menu-item disabled>
      <h3 v-if="expand"><el-icon><User /></el-icon></h3>
      <h3 v-else>用户中心</h3>
    </el-menu-item>
    <el-menu-item index="1" @click="gotoBasic">
      <el-icon><Menu /></el-icon>
      <span>基本设置</span>
    </el-menu-item>
    <el-menu-item index="2" @click="gotoSecurity">
      <el-icon><Lock /></el-icon>
      <span>安全设置</span>
    </el-menu-item>
    <el-menu-item index="3" @click="gotoPermission">
      <el-icon><Key /></el-icon>
      <span>用户权限</span>
    </el-menu-item>
    <el-menu-item index="4" @click="gotoPicture">
      <el-icon><Picture /></el-icon>
      <span>图片列表</span>
    </el-menu-item>
    <el-menu-item index="5" @click="gotoScore">
      <el-icon><Star /></el-icon>
      <span>评分列表</span>
    </el-menu-item>
    <el-menu-item index="6" @click="gotoComment">
      <el-icon><ChatLineRound /></el-icon>
      <span>评论列表</span>
    </el-menu-item>
    <el-menu-item index="7" @click="gotoBind">
      <el-icon><Link /></el-icon>
      <span>账号绑定</span>
    </el-menu-item>
    <el-menu-item @click="expand = !expand">
      <el-icon v-if="expand"><Expand /></el-icon>
      <el-icon v-else><Fold /></el-icon>
      <span>收缩侧栏</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="scss">
.menu {
  height: 100vh;
  .el-menu-item {
    padding-right: 32px;
  }
}
</style>