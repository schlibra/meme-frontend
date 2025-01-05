<script setup>
import AdminSidebar from "@/components/AdminSidebar.vue";
import AdminTop from "@/components/AdminTop.vue";
import {onMounted, ref} from "vue";
import {Delete, Get, Post, Put} from "@/lib/axiosLib.js";
import {AdminUrl} from "@/api/url.js";
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";
import {CircleCheckFilled, CircleCloseFilled} from "@element-plus/icons-vue";
import router from "@/router/index.js";
import confirm from "@/lib/confirmLib.js";
import {setToken} from "@/lib/tokenLib.js";

const user = ref([])
const group = ref([])
const mainLoading = ref(true)
const dataLoading = ref(true)

const updateDialog = ref(false)
const updateUserId = ref("")
const updateUsername = ref("")
const updatePassword = ref("")
const updateNickname = ref("")
const updateEmail = ref("")
const updateVerified = ref(false)
const updateGroupId = ref("")
const updateBan = ref(false)
const updateReason = ref("")
const updateBirth = ref(new Date())
const updateSex = ref("")
const updateDescription = ref("")

const createDialog = ref(false)
const createUsername = ref("")
const createPassword = ref("")
const createNickname = ref("")
const createEmail = ref("")
const createVerified = ref(false)
const createGroupId = ref("")
const createBan = ref(false)
const createReason = ref("")
const createBirth = ref(new Date())
const createSex = ref("")
const createDescription = ref("")

const groupFilterList = ref([])

onMounted(()=>{
  loadList()
})
function loadList() {
  Get(AdminUrl.groupUrl, {}, {
    ok(_, data) {
      group.value = data
      groupFilterList.value = []
      group.value.forEach(item=>{
        groupFilterList.value.push({
          text: item.groupName,
          value: item.groupId
        })
      })
      console.log(groupFilterList)
    },
    bad(res) {
      alertError(res, "数据获取失败", ()=>router.push("/"))
    },
    error(err) {
      axiosError(err, "数据获取失败", ()=>location.reload())
    },
    final() {
      mainLoading.value = false
    }
  })
  Get(AdminUrl.userUrl, {}, {
    ok(_, data) {
      user.value = data
    },
    bad(res) {
      alertError(res, "数据获取失败", ()=>router.push("/"))
    },
    error(err) {
      axiosError(err, "数据获取失败", ()=>location.reload())
    },
    final() {
      dataLoading.value = false
    }
  })
}
function editUser(user) {
  updateDialog.value = true
  updateUserId.value = user["userId"]
  updateUsername.value = user["username"]
  updatePassword.value = ""
  updateNickname.value = user["nickname"]
  updateEmail.value = user["email"]
  updateVerified.value = user["verified"] === "Y"
  updateGroupId.value = user["groupId"]
  updateBan.value = user["ban"] === "Y"
  updateReason.value = user["reason"]
  let birthDate = new Date()
  birthDate.setFullYear(user["birth"])
  updateBirth.value = birthDate
  updateSex.value = user["sex"]
  updateDescription.value = user["description"]
}
function deleteUser(user) {
  let username = user.username
  let nickname = user.nickname
  let userId = user.userId
  dataLoading.value = true
  confirm(`是否删除用户“${nickname}(${username})”？`, "删除用户", {
    confirm() {
      Delete(AdminUrl.userUrl, {
        userId
      }, {
        ok(res) {
          alertSuccess(res, "删除成功", loadList)
        },
        bad(res) {
          alertError(res, "删除失败", loadList)
        },
        error(err) {
          axiosError(err, "删除失败", ()=>location.reload())
        },
        final() {
          dataLoading.value = false
        }
      })
    }
  })
}
function updateSubmit() {
  updateDialog.value = false
  dataLoading.value = true
  Put(AdminUrl.userUrl, {
    userId: updateUserId.value,
    username: updateUsername.value,
    password: updatePassword.value,
    nickname: updateNickname.value,
    email: updateEmail.value,
    verified: updateVerified.value ? "Y" : "N",
    groupId: updateGroupId.value,
    ban: updateBan.value ? "Y" : "N",
    reason: updateReason.value,
    birth: updateBirth.value.getFullYear(),
    sex: updateSex.value,
    description: updateDescription.value,
  }, {
    ok(res) {
      alertSuccess(res, "更新成功", loadList)
    },
    bad(res) {
      alertError(res, "更新失败", loadList)
    },
    error(err) {
      axiosError(err, "更新失败", ()=>location.reload())
    },
    final() {
      dataLoading.value = false
    }
  })
}
function createSubmit() {
  createDialog.value = false
  dataLoading.value = true
  Post(AdminUrl.userUrl, {
    username: createUsername.value,
    password: createPassword.value,
    nickname: createNickname.value,
    email: createEmail.value,
    verified: createVerified.value ? "Y" : "N",
    groupId: createGroupId.value,
    ban: createBan.value ? "Y" : "N",
    reason: createReason.value,
    birth: createBirth.value.getFullYear(),
    sex: createSex.value,
    description: createDescription.value,
  }, {
    ok(res) {
      alertSuccess(res, "创建成功", loadList)
    },
    bad(res) {
      alertError(res, "创建失败", loadList)
    },
    error(err) {
      axiosError(err, "创建失败", ()=>location.reload())
    },
    final() {
      dataLoading.value = false
    }
  })
}
function switchUser(user) {
  let userId = user.userId
  let username = user.username
  let nickname = user.nickname
  confirm(`将要切换到用户${nickname}（${username}），切换成功后该用户原登录设备将会退出登录状态，是否继续？`, "是否切换用户", {
    confirm() {
      Post(AdminUrl.switchUser, {
        userId,
        username
      }, {
        ok(res) {
          alertSuccess(res, "切换成功", ()=>{
            setToken(res.data.token)
            location.reload()
          })
        },
        bad(res) {
          alertError(res, "切换失败")
        },
        error(err) {
          axiosError(err, "切换失败")
        }
      })
    }
  })
}
function userStatusFilter(value, row) {
  if (value === "ban" && row.ban === "Y")
    return true
  else if (value === "email" && row.verified !== "Y")
    return true
  else return value === "normal" && row.verified === "Y" && row.ban !== "Y";
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <AdminSidebar default-active="5" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <AdminTop title="用户管理" />
      </el-header>
      <el-scrollbar height="calc(100vh - 30px)">
        <el-main v-loading="mainLoading">
          <h2>用户管理</h2>
          <el-form label-position="top" v-loading="dataLoading">
            <el-form-item label="">
              <el-button type="primary" @click="createDialog = true">新增用户</el-button>
            </el-form-item>
            <el-form-item label="用户列表">
              <el-table :data="user">
                <el-table-column label="id" prop="userId" sortable />
                <el-table-column label="用户名" prop="username" sortable width="100" />
                <el-table-column label="昵称" prop="nickname" sortable />
                <el-table-column label="是否管理员" width="110" align="center" :filters="[{text: '是', value: 'Y'}, {text: '否', value: 'N'}]" :filter-method="(value, row) => row.admin === value">
                  <template #default="scope">
                    <el-icon color="green" v-if="scope.row.admin === 'Y'"><CircleCheckFilled /></el-icon>
                    <el-icon color="red" v-else><CircleCloseFilled /></el-icon>
                  </template>
                </el-table-column>
                <el-table-column label="用户组" :filters="groupFilterList" :filter-method="(value, row) => row.groupId === value">
                  <template #default="scope">
                    <el-tag :type="scope.row.admin === 'Y' ? 'success' : 'primary'">{{ scope.row.groupName }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="用户状态" width="100" :filters="[{text: '正常', value: 'normal'}, {text: '未验证', value: 'email'}, {text: '已封禁', value: 'ban'}]" :filter-method="userStatusFilter">
                  <template #default="scope">
                    <el-tag v-if="scope.row.ban === 'Y'" type="danger">已封禁：{{ scope.row.reason }}</el-tag>
                    <el-tag v-else-if="scope.row.verified !== 'Y'" type="warning">邮箱未验证</el-tag>
                    <el-tag v-else type="success">正常</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="注册时间" width="110" prop="create" sortable />
                <el-table-column label="操作" width="300">
                  <template #default="scope">
                    <el-button type="primary" @click="editUser(scope.row)">编辑</el-button>
                    <el-button type="warning" @click="switchUser(scope.row)">登录该账号</el-button>
                    <el-button type="danger" @click="deleteUser(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
  <el-dialog v-model="updateDialog">
    <template #header>
      <span>编辑用户</span>
    </template>
    <template #default>
      <el-form label-position="top">
        <el-form-item label="用户id">
          <el-input v-model="updateUserId" disabled />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="updateUsername" disabled />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="updatePassword" type="password" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="updateNickname" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="updateEmail" />
        </el-form-item>
        <el-form-item label="邮箱通过验证">
          <el-switch v-model="updateVerified" active-text="通过" inactive-text="未通过" />
        </el-form-item>
        <el-form-item label="用户组">
          <el-select v-model="updateGroupId">
            <el-option label="选择用户组" value="-1" disabled />
            <el-option v-for="item in group" :label="item.groupName" :value="item.groupId" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户是否封禁">
          <el-switch v-model="updateBan" active-text="封禁" inactive-text="正常" />
        </el-form-item>
        <el-form-item label="用户封禁原因">
          <el-input v-model="updateReason" :disabled="!updateBan" />
        </el-form-item>
        <el-form-item label="出生年份">
          <el-date-picker type="year" v-model="updateBirth" />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="updateSex" />
        </el-form-item>
        <el-form-item label="用户简介">
          <el-input v-model="updateDescription" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="updateDialog = false">取消</el-button>
      <el-button type="primary" @click="updateSubmit">确定</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="createDialog">
    <template #header>
      <span>新增用户</span>
    </template>
    <template #default>
      <el-form label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="createUsername" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="createPassword" type="password" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="createNickname" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="createEmail" />
        </el-form-item>
        <el-form-item label="邮箱通过验证">
          <el-switch v-model="createVerified" active-text="通过" inactive-text="未通过" />
        </el-form-item>
        <el-form-item label="用户组">
          <el-select v-model="createGroupId">
            <el-option label="选择用户组" value="-1" disabled />
            <el-option v-for="item in group" :label="item.groupName" :value="item.groupId" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户是否封禁">
          <el-switch v-model="createBan" active-text="封禁" inactive-text="正常" />
        </el-form-item>
        <el-form-item label="用户封禁原因">
          <el-input v-model="createReason" :disabled="!createBan" />
        </el-form-item>
        <el-form-item label="出生年份">
          <el-date-picker type="year" v-model="createBirth" />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="createSex" />
        </el-form-item>
        <el-form-item label="用户简介">
          <el-input v-model="createDescription" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="createDialog = false">取消</el-button>
      <el-button type="primary" @click="createSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
h2 {
  margin-top: 0;
}
</style>