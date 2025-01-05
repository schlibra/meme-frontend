<script setup>
import UserSidebar from "@/components/UserSidebar.vue";
import UserTop from "@/components/UserTop.vue";
import {getToken, removeToken} from "@/lib/tokenLib.js";
import {onMounted, ref} from "vue";
import router from "@/router/index.js";
import axios from "axios";
import {UserUrl} from "@/api/url.js";
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";
import displayUtil from "@/lib/displayUtil.js";
import {repeat} from "lodash-es";
import confirm from "@/lib/confirmLib.js";

const token = getToken()
const user = ref({})
const loading = ref(true)
const verifying = ref(false)
const code = ref("")
const changePasswordDialog = ref(false)
const oldPassword = ref("")
const newPassword = ref("")
const cfmPassword = ref("")

let emailToken = "";


onMounted(()=>{
  if (token) {
    axios.get(UserUrl.infoUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res=>{
      if (res.data.code === 200) {
        user.value = res.data.data
      } else {
        alertError(res, "数据获取失败", ()=>router.push("/login"))
      }
    }).catch(err=>{
      axiosError(err, "数据获取失败", ()=>location.reload())
    }).finally(()=>{
      loading.value = false
    })
  } else {
    router.push("/login")
  }
})
function sendCode() {
  loading.value = true
  axios.post(UserUrl.sendCodeUrl, {
    email: user.value["email"],
    action: "verify"
  }).then(res=>{
    if (res.data.code === 200) {
      alertSuccess(res, "发送成功")
      emailToken = res.data.token
      verifying.value = true
    } else {
      alertError(res, "发送失败")
    }
  }).catch(err=>{
    axiosError(err, "发送失败")
  }).finally(()=>loading.value=false)
}
function verify() {
  if (code.value.length) {
    loading.value = true
    axios.post(UserUrl.verifyUrl, {
      code: code.value
    }, {
      headers: {
        Authorization: `Bearer ${emailToken}`
      }
    }).then(res=>{
      if (res.data.code === 200) {
        alertSuccess(res, "更新成功", () => location.reload())
      } else {
        alertError(res, "更新失败")
      }
    }).catch(err=>{
      axiosError(err, "更新失败")
    }).finally(()=>loading.value=false)
  } else {
    alertError("验证码不能为空", "验证失败")
  }
}
function changePasswordSubmit() {
  if (oldPassword.value.length && newPassword.value.length && cfmPassword.value.length) {
    if (newPassword.value === cfmPassword.value) {
      loading.value = true
      axios.put(UserUrl.passwordUrl, {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        cfmPassword: cfmPassword.value
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res=>{
        if (res.data.code === 200) {
          alertSuccess(res, "修改成功", ()=>{
            removeToken()
            confirm("是否重新登录账号？", "重新登录", {
              confirm() {
                router.push("/login")
              },
              cancel() {
                router.push("/")
              },
              close() {
                router.push("/")
              }
            })
          })
        } else {
          alertError(res, "修改失败")
        }
      }).catch(err=>{
        axiosError(err, "修改失败")
      }).finally(()=>{
        loading.value=false
        changePasswordDialog.value = false
      })
    } else {
      alertError("两次密码不一致", "修改失败")
    }
  } else {
    alertError("密码不能为空", "修改失败")
  }
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset">
      <UserSidebar default-active="2" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px">
        <UserTop title="安全设置" />
      </el-header>
      <el-main>
        <h2>安全设置</h2>
        <el-form v-loading="loading" label-position="top">
          <el-form-item label="当前用户">
            <el-text type="info">{{ user.nickname }}（{{ user.username }}）</el-text>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-text type="info">
              <el-space wrap>
                <span>{{ user.email }}</span>
                <el-tag v-if="user['verified'] === 'Y'" type="success">已验证</el-tag>
                <el-tag v-else type="danger">未验证</el-tag>
                <el-button @click="sendCode" :size="displayUtil.isXs ? 'small' : 'default'" v-if="user['verified'] !== 'Y'">发送验证码</el-button>
              </el-space>
            </el-text>
          </el-form-item>
          <el-form-item label="邮箱验证码" v-if="verifying">
            <el-space>
              <el-input v-model="code" />
              <el-button @click="verify">验证邮箱</el-button>
            </el-space>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-space>
              <el-text type="info">{{ repeat("*", 8) }}</el-text>
              <el-button @click="changePasswordDialog = true">修改密码</el-button>
            </el-space>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="changePasswordDialog">
    <template #header>
      <span>修改密码</span>
    </template>
    <template #default>
      <el-form label-position="top" v-loading="loading">
        <el-form-item label="原密码">
          <el-input v-model="oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="newPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="cfmPassword" type="password" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="changePasswordDialog = false">取消</el-button>
      <el-button @click="changePasswordSubmit" type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
h2 {
  margin-top: 0;
}
</style>