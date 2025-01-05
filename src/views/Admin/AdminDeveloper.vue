<script setup>

import AdminSidebar from "@/components/AdminSidebar.vue";
import AdminTop from "@/components/AdminTop.vue";
import {ref} from "vue";
import {alertSuccess} from "@/lib/requestAlert.js";
import confirm from "@/lib/confirmLib.js";

const devMode = ref(cookie.get("dev") === "Y");

function devModeChange() {
  if (devMode.value) {

    confirm("是否开启开发者模式？开启后将可以打开浏览器开发者工具", "关闭开发者模式", {
      confirm() {
        cookie.set("dev", "Y")
        alertSuccess("开发者模式已开启，刷新后生效。开启后页面加载速度可能会变慢", "开启成功", ()=>location.reload())
      },
      cancel() {
        devMode.value = false
      }
    })
  } else {
    confirm("是否关闭开发者模式？关闭后将无法打开浏览器开发者工具", "关闭开发者模式", {
      confirm() {
        cookie.remove("dev")
        alertSuccess("开发者模式已关闭，刷新后生效。若当前已打开浏览器开发者工具，请先关闭浏览器开发者工具后再刷新", "关闭成功", () => location.reload())
      },
      cancel() {
        devMode.value = true
      }
    })
  }
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <AdminSidebar default-active="13" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <AdminTop title="开发者选项" />
      </el-header>
      <el-main>
        <h2>开发者选项</h2>
        <el-form label-position="top">
          <el-form-item label="开发者模式">
            <el-switch v-model="devMode" active-text="开启" inactive-text="关闭" @click="devModeChange" />
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
h2 {
  margin-top: 0;
}
</style>