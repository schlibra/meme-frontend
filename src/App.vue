<script setup>
import { RouterView } from 'vue-router'
import { useCookies } from "vue3-cookies";
const {cookies} = useCookies()
import DisableDevtool from 'disable-devtool'
import {alertError} from "@/lib/requestAlert.js";
DisableDevtool({
  ignore() {
    return cookies.get("dev") === "Y"
  }
})
globalThis.dev = () => {
  if (cookies.get("dev") === "Y") {
    cookies.remove("dev")
    location.reload()
  } else {
    if (["127.0.0.1", "localhost"].includes(location.hostname)) {
      cookies.set("dev", "Y")
      location.reload()
    } else {
      alertError("不支持的操作", "当前状态不支持进行该操作")
    }
  }
}
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
