<script setup>
import UserSidebar from "@/components/UserSidebar.vue";
import UserTop from "@/components/UserTop.vue";
import { ref, onMounted } from "vue";
import {Get} from "@/lib/axiosLib.js";
import {ThirdPartyUrl, UserUrl} from "@/api/url.js";

const user = ref({})
const dataLoading = ref(true)

onMounted(()=>{
  Get(UserUrl.infoUrl, {}, {
    ok(_, data) {
      user.value = data
    },
    bad(res) {

    },
    error(err) {

    },
    final() {
      dataLoading.value = false
    }
  })
})
function bindThirdParty(path) {
  localStorage.setItem("thirdPartyLoginAction", "bind")
  localStorage.setItem("thirdPartyLoginName", path)
  setTimeout(()=>location.href = ThirdPartyUrl.beforeUrl + path, 200)
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <UserSidebar default-active="7" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <UserTop title="账号绑定" />
      </el-header>
      <el-main>
        <h2>账号绑定</h2>
        <el-form v-loading="dataLoading" label-position="top">
          <el-form-item label="当前账号">
            <el-text type="info">{{ user.nickname }}（{{ user.username }}）</el-text>
          </el-form-item>
          <el-form-item label="思刻通行证">
            <el-space direction="horizontal" v-if="user.sckurBind === 'Y'">
              <el-avatar :src="'data:image/png;base64,' + user['sckurAvatar']" />
              <el-text>{{ user['sckurNickname'] }}@{{ user['sckurUsername'] }}</el-text>
              <el-button>解绑</el-button>
            </el-space>
            <el-space direction="horizontal" v-else>
              <el-text type="info">未绑定</el-text>
              <el-button @click="bindThirdParty('sckur')">绑定</el-button>
            </el-space>
          </el-form-item>
          <el-form-item label="Github账号">
            <el-space direction="horizontal" v-if="user.githubBind === 'Y'">
              <el-avatar :src="'data:image/png;base64,' + user['githubAvatar']" />
              <el-text>{{ user['githubNickname'] }}@{{ user['githubUsername'] }}</el-text>
              <el-button>解绑</el-button>
            </el-space>
            <el-space direction="horizontal" v-else>
              <el-text type="info">未绑定</el-text>
              <el-button @click="bindThirdParty('github')">绑定</el-button>
            </el-space>
          </el-form-item>
          <el-form-item label="Gitee账号">
            <el-space direction="horizontal" v-if="user.giteeBind === 'Y'">
              <el-avatar  :src="'data:image/png;base64,' + user['giteeAvatar']" />
              <el-text>{{ user['giteeNickname'] }}@{{ user['giteeUsername'] }}</el-text>
              <el-button>解绑</el-button>
            </el-space>
            <el-space direction="horizontal" v-else>
              <el-text type="info">未绑定</el-text>
              <el-button @click="bindThirdParty('gitee')">绑定</el-button>
            </el-space>
          </el-form-item>
          <el-form-item label="Gitlab账号">
            <el-space direction="horizontal" v-if="user.gitlabBind === 'Y'">
              <el-avatar :src="'data:image/png;base64,' + user['gitlabAvatar']" />
              <el-text>{{ user['gitlabNickname'] }}@{{ user['gitlabUsername'] }}</el-text>
              <el-button>解绑</el-button>
            </el-space>
            <el-space direction="horizontal" v-else>
              <el-text type="info">未绑定</el-text>
              <el-button @click="bindThirdParty('gitlab')">绑定</el-button>
            </el-space>
          </el-form-item>
          <el-form-item label="微软账号">
            <el-space direction="horizontal" v-if="user.microsoftBind === 'Y'">
              <el-avatar :src="'data:image/png;base64,' + user['microsoftAvatar']" />
              <el-text>{{ user['microsoftNickname'] }}（{{ user['microsoftUsername'] }}）</el-text>
              <el-button>解绑</el-button>
            </el-space>
            <el-space direction="horizontal" v-else>
              <el-text type="info">未绑定</el-text>
              <el-button @click="bindThirdParty('microsoft')">绑定</el-button>
            </el-space>
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