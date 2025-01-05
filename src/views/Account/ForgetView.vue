<script setup>
import {UserUrl} from "@/api/url.js";
import {ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import { Back } from "@element-plus/icons-vue";
import {alertSuccess, alertError, axiosError} from "@/lib/requestAlert.js";

const username = ref("");
const password = ref("");
const confirm = ref("");
const email = ref("");
const code = ref("");
const formLoading = ref(false);

let emailToken;

function sendCodeHandler() {
  if (email.value.length) {
    formLoading.value = true
    axios.post(UserUrl.sendCodeUrl, {
      email: email.value,
      action: "forget"
    }).then(res=>{
      if (res.data.code === 200) {
        emailToken = res.data.token
        alertSuccess(res, "发送成功")
      } else {
        alertError(res, "发送失败")
      }
    }).catch(err=>{
      axiosError(err, "发送失败")
    }).finally(()=> formLoading.value = false)
  } else {
    alertError("邮箱地址不能为空", "发送失败")
  }
}

function forgetHandler() {
  if (username.value.length && confirm.value.length &&
      password.value.length && email.value.length &&
      code.value.length) {
    if (password.value === confirm.value) {
      formLoading.value = true
      axios.post(UserUrl.forgetUrl, {
        username: username.value,
        password: password.value,
        email: email.value,
        code: code.value
      }, {
        headers: {
          Authorization: `Bearer ${emailToken}`
        }
      }).then(res => {
        if (res.data.code === 200) {
          alertSuccess(res, "密码重置成功", ()=> router.push("/login"))
        } else {
          alertError(res, "密码重置失败")
        }
      }).catch(err => {
        axiosError(err, "密码重置失败");
      }).finally(() => formLoading.value = false)
    } else {
      alertError("两次密码不一致", "密码重置失败")
    }
  } else {
    alertError("字段不能为空", "密码重置失败")
  }
}
function gotoLogin() {
  router.push("/login")
}
</script>

<template>
  <main >
    <el-row justify="center" align="middle" class="row">
      <el-col :xs="22" :sm="18" :md="14" :lg="10" :xl="6">
        <el-card v-loading="formLoading">
          <template #header>
            <h1><el-icon class="back" @click="gotoLogin"><Back /></el-icon> 重置密码</h1>
          </template>
          <template #default>
            <el-form label-width="auto" label-position="top">
              <el-form-item label="用户名">
                <el-input v-model="username" placeholder="输入用户名" />
              </el-form-item>
              <el-form-item label="新密码">
                <el-input type="password" v-model="password" placeholder="输入新密码" />
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input type="password" v-model="confirm" placeholder="再次输入密码" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-row style="width: 100%;" :gutter="8">
                  <el-col :span="20">
                    <el-input type="text" v-model="email" placeholder="输入邮箱" />
                  </el-col>
                  <el-col :span="4">
                    <el-button type="info" @click="sendCodeHandler">发送验证码</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="邮箱验证码">
                <el-input type="text" v-model="code" placeholder="输入邮箱验证码" />
              </el-form-item>
            </el-form>
          </template>
          <template #footer>
            <el-button class="register" type="primary" @click="forgetHandler" size="large">重置密码</el-button>
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
  .row {
    height: 100vh;
  }
  .register {
    margin-top: 16px;
  }
  .right{
    text-align: right;
  }
  .back {
    cursor: pointer;
  }
}
</style>