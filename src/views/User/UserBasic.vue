<script setup>
import UserSidebar from "@/components/UserSidebar.vue";
import {computed, onMounted, ref} from "vue";
import router from "@/router/index.js";
import axios from "axios";
import {UserUrl} from "@/api/url.js";
import UserTop from "@/components/UserTop.vue";
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";
import {getToken} from "@/lib/tokenLib.js";

const token = getToken()
const edit = ref(false)
const user = ref({sex: "", birth: 0})
const nowYear = new Date().getFullYear()
const loading = ref(true)

const birth = computed({
  get() {
    let date = new Date()
    date.setFullYear(user.value.birth)
    return date
  },
  set(date) {
    user.value.birth = date.getFullYear()
  }
})

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
        alertError(res, "数据获取失败", ()=> router.push("/login"))
      }
    }).catch(err=>{
      axiosError(err, "数据获取失败", ()=>location.reload())
    }).finally(()=> loading.value = false)
  } else {
    router.push("/login")
  }
})

function update() {
  edit.value = false
  loading.value = true
  axios.put(UserUrl.infoUrl, user.value, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res=>{
    if (res.data.code === 200) {
      alertSuccess(res, "更新成功")
    } else {
      alertError(res, "更新失败")
    }
  }).catch(err=>{
    axiosError(err, "更新失败");
  }).finally(()=> loading.value = false)
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <UserSidebar default-active="1" />
    </el-aside>
    <el-container>
      <el-header height="30px">
        <UserTop title="基本设置" />
      </el-header>
      <el-scrollbar height="calc(100vh - 30px)">
        <el-main>
          <h2>基本设置</h2>
          <el-form label-position="top" v-loading="loading">
            <el-form-item label="用户头像" class="label">
              <el-avatar size="large" :src="user['avatar']" />
            </el-form-item>
            <el-form-item label="用户ID" class="label">
              <el-input v-if="edit" v-model="user['userId']" disabled />
              <el-text v-else>{{ user["userId"] }}</el-text>
            </el-form-item>
            <el-form-item label="用户名" class="label">
              <el-input v-if="edit" v-model="user.username" disabled />
              <el-text v-else>{{ user.username }}</el-text>
            </el-form-item>
            <el-form-item label="昵称" class="label">
              <el-input v-if="edit" v-model="user.nickname" />
              <el-text v-else>{{ user.nickname }}</el-text>
            </el-form-item>
            <el-form-item label="邮箱" class="label">
              <el-space>
                <el-input v-if="edit" v-model="user.email" />
                <el-text v-if="edit" type="info">修改后需要验证邮箱才能使用邮箱登录</el-text>
                <el-text v-else>{{ user.email }}</el-text>
                <el-tag v-if="user['verified'] === 'Y' && !edit" type="success">已验证</el-tag>
                <el-tag v-if="user['verified'] !== 'Y' && !edit" type="danger">未验证</el-tag>
              </el-space>
            </el-form-item>
            <el-form-item label="性别" class="label">
              <el-input v-if="edit" v-model="user.sex" />
              <el-text v-else>{{ user.sex }}</el-text>
            </el-form-item>
            <el-form-item label="出生年份" class="label">
              <el-date-picker type="year" v-if="edit" v-model="birth" />
              <el-text v-show="!loading" v-else>{{ user.birth }}（{{ nowYear - user.birth }}岁）</el-text>
            </el-form-item>
            <el-form-item label="个人介绍" class="label">
              <el-input type="textarea" v-if="edit" v-model="user.description" />
              <el-text v-else>{{ user.description }}</el-text>
            </el-form-item>
            <el-button type="primary" @click="edit = true" v-show="!edit">编辑</el-button>
            <el-button type="primary" @click="update" v-show="edit">保存</el-button>
          </el-form>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.el-form {
  .el-text {
    margin-left: 8px;
    font-size: 12px;
  }
}
h2 {
  margin-top: 0;
}
.el-scrollbar {
  width: 100%;

}
</style>