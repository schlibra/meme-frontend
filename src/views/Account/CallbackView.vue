<script setup>
import { onMounted, ref } from 'vue'
import {Post} from "@/lib/axiosLib.js";
import {axiosError} from "@/lib/requestAlert.js";
import {ThirdPartyUrl} from "@/api/url.js";
import {setToken} from "@/lib/tokenLib.js";
import router from "@/router/index.js";

const vars = ref({
  thirdPartyLoginUsername: "",
  thirdPartyLoginToken: "",
  thirdPartyLoginError: "",
})

const action = localStorage.getItem("thirdPartyLoginAction")
const platform = localStorage.getItem("thirdPartyLoginName")
const message = ref("正在执行下一步操作")

onMounted(()=>{
  vars.value = VARS
  if (vars.value.thirdPartyLoginError) {
    message.value = vars.value.thirdPartyLoginError
    setTimeout(()=>{
      localStorage.removeItem("thirdPartyLoginAction")
      localStorage.removeItem("thirdPartyLoginName")
      if (action === "login") {
        location.href = "/"
      } else if (action === "bind") {
        location.href = "/user/bind"
      }
    }, 2000)
  } else {
    Post(ThirdPartyUrl.afterUrl + platform, {
      action,
      platform,
      username: vars.value.thirdPartyLoginUsername,
      token: vars.value.thirdPartyLoginToken,
    }, {
      ok(res) {
        message.value = res.data.msg
        setTimeout(()=>{
          if (action === "login") {
            setToken(res)
            location.href = "/"
          } else if (action === "bind") {
            location.href = "/user/bind"
          }
        }, 2000)
      },
      bad(res) {
        vars.value.thirdPartyLoginError = "Y"
        message.value = res.data.msg
        setTimeout(()=>{
          if (action === "login") {
            location.href = "/"
          } else if (action === "bind") {
            location.href = "/user/bind"
          }
        }, 2000)
      },
      error(err) {
        message.value = axiosError(err, "", null, true)
      },
      final() {
        localStorage.removeItem("thirdPartyLoginAction")
        localStorage.removeItem("thirdPartyLoginName")
      }
    })
  }
})
</script>

<template>
  <el-result :icon="vars.thirdPartyLoginError ? 'error' : 'success'" :title="vars.thirdPartyLoginError ? '登录失败' : '登录成功'">
    <template #sub-title>
      <el-space direction="vertical">
        <p v-if="!vars.thirdPartyLoginError">{{ platform }}平台用户{{ vars.thirdPartyLoginNickname }}（{{ vars.thirdPartyLoginUsername }}）登录成功</p>
        <p>{{ message }}</p>
      </el-space>
    </template>
  </el-result>
</template>

<style scoped lang="scss">

</style>