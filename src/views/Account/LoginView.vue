<script setup>
import {UserUrl, CaptchaUrl, ThirdPartyUrl} from "@/api/url.js";
import {onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";
import {setToken} from "@/lib/tokenLib.js";
import sckur from '@/assets/sckur.png'
import {useDark} from "@vueuse/core";
import githubDark from '@/assets/github-dark.png'
import githubLight from '@/assets/github-light.png'
import gitee from '@/assets/gitee.png'
import gitlab from '@/assets/gitlab.svg'
import microsoft from '@/assets/microsoft.ico'
import md5 from 'md5'
import CryptoJS from 'crypto-js'
globalThis.CryptoJS = CryptoJS

const username = ref("");
const password = ref("");
const captcha = ref("")
const captchaUrl = ref(CaptchaUrl)
const usernameRef = ref(null)
const passwordRef = ref(null)
const captchaRef = ref(null)
const formLoading = ref(false)
const setting = ref({})
const isDark = ref(useDark())

onMounted(()=>{
  setting.value = VARS
})

function loginHandler() {
  if (username.value.length && password.value.length) {
    formLoading.value = true
    let now = Math.round(new Date().getTime() / 1000) + ""
    let _secret = md5(md5(now) + md5(username.value) + md5(password.value))
    let secret = ""
    for (let i = 0;i < 32; i++) {
      secret += now.substring(i % 10, i % 10 + 1) + _secret.substring(i, i + 1)
    }
    axios.post(UserUrl.loginUrl, {
      username: username.value,
      password: password.value,
      captcha: captcha.value,
      secret
    }).then(res=>{
      if (res.data.code===200) {
        setToken(res)
        alertSuccess(res, "登录成功", () => router.push("/"))
      } else {
        alertError(res, "登录失败")
      }
    }).catch(err=>{
      axiosError(err, "登录失败");
    }).finally(() => formLoading.value = false)
  } else {
    alertError("账号密码不能为空", "登录失败")
  }
}
function enterHandler() {
  if (username.value.length === 0) {
    usernameRef.value.focus()
  } else if (password.value.length === 0) {
    passwordRef.value.focus()
  } else if (VARS.enableCaptcha === "Y") {
     if (captcha.value.length === 0) {
       captchaRef.value.focus()
     } else {
       loginHandler()
     }
  }else {
    loginHandler()
  }
}
function reloadCaptcha() {
  captchaUrl.value = `${CaptchaUrl}?${Math.random()}`
}
function googleLoginSuccess(response) {
  console.log(response)
}
function gotoThirdPartyLogin(path) {
  localStorage.setItem("thirdPartyLoginAction", "login")
  localStorage.setItem("thirdPartyLoginName", path)
  setTimeout(()=>location.href = ThirdPartyUrl.beforeUrl + path, 200)
}
</script>


<template>
  <main>
    <el-row justify="center" align="middle" class="row">
      <el-col :xs="22" :sm="18" :md="14" :lg="10" :xl="6">
        <el-card v-loading="formLoading">
          <template #header>
            <h1>登录</h1>
          </template>
          <template #default>
            <el-form label-width="auto" label-position="top">
              <el-scrollbar height="40vh">
                <el-form-item label="用户名">
                  <el-input autofocus ref="usernameRef" v-model="username" placeholder="输入账号或邮箱" @keydown.enter="enterHandler" />
                </el-form-item>
                <el-form-item label="密码">
                  <el-input ref="passwordRef" type="password" v-model="password" placeholder="输入密码" @keydown.enter="enterHandler" />
                </el-form-item>
                <el-form-item label="图片验证码" v-if="setting.enableCaptcha === 'Y'">
                  <el-row :gutter="8">
                    <el-col :span="14">
                      <el-input v-model="captcha" ref="captchaRef" @keydown.enter="enterHandler" />
                    </el-col>
                    <el-col :span="10">
                      <el-image :src="captchaUrl" @click="reloadCaptcha" class="pointer" />
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-row class="down-row">
                  <el-col :span="12">
                    <el-link href="/forget">忘记密码</el-link>
                  </el-col>
                  <el-col :span="12" class="right">
                    <el-link href="/register">注册账号</el-link>
                  </el-col>
                </el-row>
                <el-divider>使用第三方平台登录</el-divider>
                <el-row style="width: 100%;">
                  <el-col :span="24" v-if="setting.enableSckur">
                    <el-button style="height: 50px;width: 100%;" size="large" @click="gotoThirdPartyLogin('sckur')">
                      <el-space direction="horizontal">
                        <el-image style="height: 30px;" :src="sckur" />
                        <span>使用思刻通行证登录</span>
                      </el-space>
                    </el-button>
                  </el-col>
                  <el-col :span="24" v-if="isDark && setting.enableGithub">
                    <el-button style="height: 50px;width: 100%;" size="large" @click="gotoThirdPartyLogin('github')">
                      <el-space direction="horizontal">
                        <el-image style="height: 30px;" :src="githubDark" />
                        <span>使用Github账号登录</span>
                      </el-space>
                    </el-button>
                  </el-col>
                  <el-col :span="24" v-if="!isDark && setting.enableGithub">
                    <el-button style="height: 50px;width: 100%;" size="large" @click="gotoThirdPartyLogin('github')">
                      <el-space direction="horizontal">
                        <el-image style="height: 30px;" :src="githubLight" />
                        <span>使用Github账号登录</span>
                      </el-space>
                    </el-button>
                  </el-col>
                  <el-col :span="24" v-if="setting.enableGitee">
                    <el-button style="height: 50px;width: 100%;" size="large" @click="gotoThirdPartyLogin('gitee')">
                      <el-space direction="horizontal">
                        <el-image style="height: 30px;" :src="gitee" />
                        <span>使用Gitee账号登录</span>
                      </el-space>
                    </el-button>
                  </el-col>
                  <el-col :span="24" v-if="setting.enableGitlab">
                    <el-button style="height: 50px;width: 100%;" size="large" @click="gotoThirdPartyLogin('gitlab')">
                      <el-space direction="horizontal">
                        <el-image style="height: 30px;" :src="gitlab" />
                        <span>使用Gitlab账号登录</span>
                      </el-space>
                    </el-button>
                  </el-col>
                  <el-col :span="24" v-if="setting.enableMicrosoft">
                    <el-button style="height: 50px;width: 100%;" size="large" @click="gotoThirdPartyLogin('microsoft')">
                      <el-space direction="horizontal">
                        <el-image style="height: 30px;" :src="microsoft" />
                        <span>使用微软账号登录</span>
                      </el-space>
                    </el-button>
                  </el-col>
                </el-row>
              </el-scrollbar>
            </el-form>
          </template>
          <template #footer>
            <el-button class="login" type="primary" @click="loginHandler" size="large">登录</el-button>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </main>
</template>

<style scoped lang="scss">
main {
  height: 100vh;
  background: url("@/assets/bg.jpg") round;
  .pointer {
    cursor: pointer;
  }
  .row {
    height: 100vh;
  }
  .login {
    margin-top: 16px;
  }
  .down-row {
    margin: 0 16px;
    .right{
      text-align: right;
    }
  }
}
</style>