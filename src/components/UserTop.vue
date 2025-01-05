<script setup>
import router from "@/router/index.js";
import {onMounted, ref} from "vue";
import {Get} from "@/lib/axiosLib.js";
import {alertError, axiosError} from "@/lib/requestAlert.js";
import {UserUrl} from "@/api/url.js";

const prop = defineProps(["title"])
const title = "用户中心 - " + prop.title
const shortTitle = prop.title
const user = ref({})

onMounted(() => {
  Get(UserUrl.infoUrl, {}, {
    ok(_, data) {
      user.value = data
    },
    bad(res) {
      alertError(res, "数据获取失败", ()=>router.push("/login"))
    },
    error(err) {
      axiosError(err, "数据获取失败", ()=>location.reload())
    }
  })
})

function gotoHome() {
  router.push({
    path: "/"
  })
}
</script>

<template>
  <el-page-header class="header" title="返回首页" @back="gotoHome">
    <template #content>
      <span class="hidden-xs-only">{{ title }}</span>
      <span class="hidden-sm-and-up">{{ shortTitle }}</span>
    </template>
    <template #title>
      <span class="hidden-xs-only">返回首页</span>
    </template>
    <template #extra>
      <el-space>
        <el-avatar size="small" :src="user['avatar']" />
        <el-text>{{ user["nickname"] }}</el-text>
      </el-space>
    </template>
  </el-page-header>
</template>

<style scoped lang="scss">
.header {
  margin-top: 8px;
}
</style>