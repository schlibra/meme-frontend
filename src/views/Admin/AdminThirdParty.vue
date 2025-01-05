<script setup>

import AdminSidebar from "@/components/AdminSidebar.vue";
import AdminTop from "@/components/AdminTop.vue";
import {onMounted, ref} from "vue";
import {Post} from "@/lib/axiosLib.js";
import {AdminUrl} from "@/api/url.js";
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";

const setting = ref({
  enableSckur: "N",
  sckurClientId: "",
  sckurApiKey: "",
  enableGitee: "N",
  giteeClientId: "",
  giteeClientSecret: "",
  enableGithub: "N",
  githubClientId: "",
  githubClientSecret: "",
  enableGitlab: "N",
  gitlabClientId: "",
  gitlabClientSecret: "",
  enableMicrosoft: "N",
  microsoftClientId: "",
  microsoftClientSecret: "",
})
onMounted(()=>{
  setting.value = VARS
})
function saveSetting() {
  Post(AdminUrl.thirdPartyUrl, setting.value, {
    ok(res) {
      alertSuccess(res, "保存成功", ()=>location.reload())
    },
    bad(res) {
      alertError(res, "保存失败")
    },
    error(err) {
      axiosError(err, "保存失败")
    }
  })
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <AdminSidebar default-active="3" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <AdminTop title="第三方平台" />
      </el-header>
      <el-scrollbar height="calc(100vh - 30px)">
        <el-main>
          <h2>第三方平台</h2>
          <el-form label-position="top">
            <el-form-item label="开启思刻通行证">
              <el-switch active-text="开启" inactive-text="关闭" v-model="setting.enableSckur" active-value="Y" inactive-value="N" />
            </el-form-item>
            <el-form-item label="思刻通行证ClientId" v-if="setting.enableSckur === 'Y'">
              <el-input v-model="setting.sckurClientId" />
            </el-form-item>
            <el-form-item label="思刻通行证ApiKey" v-if="setting.enableSckur === 'Y'">
              <el-input v-model="setting.sckurApiKey" />
            </el-form-item>
            <el-form-item label="开启Gitee">
              <el-switch active-text="开启" inactive-text="关闭" v-model="setting.enableGitee" active-value="Y" inactive-value="N" />
            </el-form-item>
            <el-form-item label="Gitee Client ID" v-if="setting.enableGitee === 'Y'">
              <el-input v-model="setting.giteeClientId" />
            </el-form-item>
            <el-form-item label="Gitee Client Secret" v-if="setting.enableGitee === 'Y'">
              <el-input v-model="setting.giteeClientSecret" />
            </el-form-item>
            <el-form-item label="开启Github">
              <el-switch active-text="开启" inactive-text="关闭" v-model="setting.enableGithub" active-value="Y" inactive-value="N" />
            </el-form-item>
            <el-form-item label="Github Client ID" v-if="setting.enableGithub === 'Y'">
              <el-input v-model="setting.githubClientId" />
            </el-form-item>
            <el-form-item label="Github Client Secret" v-if="setting.enableGithub === 'Y'">
              <el-input v-model="setting.githubClientSecret" />
            </el-form-item>
            <el-form-item label="开启Gitlab">
              <el-switch active-text="开启" inactive-text="关闭" v-model="setting.enableGitlab" active-value="Y" inactive-value="N" />
            </el-form-item>
            <el-form-item label="Gitlab Client ID" v-if="setting.enableGitlab === 'Y'">
              <el-input v-model="setting.gitlabClientId" />
            </el-form-item>
            <el-form-item label="Gitlab Client Secret" v-if="setting.enableGitlab === 'Y'">
              <el-input v-model="setting.gitlabClientSecret" />
            </el-form-item>
            <el-form-item label="开启微软账号">
              <el-switch active-text="开启" inactive-text="关闭" v-model="setting.enableMicrosoft" active-value="Y" inactive-value="N" />
            </el-form-item>
            <el-form-item label="Microsoft Client ID" v-if="setting.enableMicrosoft === 'Y'">
              <el-input v-model="setting.microsoftClientId" />
            </el-form-item>
            <el-form-item label="Microsoft Client Secret" v-if="setting.enableMicrosoft === 'Y'">
              <el-input v-model="setting.microsoftClientSecret" />
            </el-form-item>
            <el-button @click="saveSetting">保存</el-button>
          </el-form>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">

</style>