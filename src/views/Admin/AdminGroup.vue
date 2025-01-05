<script setup>
import AdminSidebar from "@/components/AdminSidebar.vue";
import AdminTop from "@/components/AdminTop.vue";
import { onMounted, ref } from "vue";
import {Delete, Get, Post, Put} from "@/lib/axiosLib.js";
import {AdminUrl} from "@/api/url.js";
import {CircleCheckFilled, CircleCloseFilled, InfoFilled, Plus} from "@element-plus/icons-vue";
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";
import router from "@/router/index.js";
import confirm from "@/lib/confirmLib.js";

const groupList = ref([])
const defaultGroup = ref(-1)

const mainLoading = ref(true)
const dataLoading = ref(false)

const createDialog = ref(false)
const createGroupName = ref("")
const createAdmin = ref(false)
const createUploadPic = ref(false)
const createUpdatePic = ref(false)
const createDeletePic = ref(false)
const createRestorePic = ref(false)
const createSendComment = ref(false)
const createUpdateComment = ref(false)
const createDeleteComment = ref(false)
const createRestoreComment = ref(false)
const createSendScore = ref(false)
const createUpdateScore = ref(false)
const createDeleteScore = ref(false)
const createRestoreScore = ref(false)

const updateDialog = ref(false)
const updateGroupId = ref("")
const updateGroupName = ref("")
const updateAdmin = ref(false)
const updateUploadPic = ref(false)
const updateUpdatePic = ref(false)
const updateDeletePic = ref(false)
const updateRestorePic = ref(false)
const updateSendComment = ref(false)
const updateUpdateComment = ref(false)
const updateDeleteComment = ref(false)
const updateRestoreComment = ref(false)
const updateSendScore = ref(false)
const updateUpdateScore = ref(false)
const updateDeleteScore = ref(false)
const updateRestoreScore = ref(false)

onMounted(()=>{
  loadList()
})
function loadList() {
  dataLoading.value = true
  Get(AdminUrl.groupUrl, {}, {
    ok(_, data) {
      groupList.value = data
      data.forEach(item=>{
        if (item.default === "Y") {
          defaultGroup.value = item.groupId
        }
      })
    },
    bad(res) {
      alertError(res, "数据获取失败", ()=>router.push("/"))
    },
    error(err) {
      axiosError(err, "数据获取失败", ()=>location.reload())
    },
    final() {
      mainLoading.value = false
      dataLoading.value = false
    }
  })
}
function updateDefaultGroup() {
  mainLoading.value = true
  Put(AdminUrl.groupUrl, {
    default: defaultGroup.value
  }, {
    ok(res) {
      alertSuccess(res, "修改成功", loadList)
    },
    bad(res) {
      alertError(res, "修改失败", loadList)
    },
    error(err) {
      axiosError(err, "修改失败", ()=>location.reload())
    },
    final() {
      mainLoading.value = false
    }
  })
}
function createSubmit() {
  createDialog.value = false
  dataLoading.value = true
  Post(AdminUrl.groupUrl, {
    groupName: createGroupName.value,
    admin: createAdmin.value ? "Y" : "N",
    uploadPic: createUploadPic.value ? "Y" : "N",
    updatePic: createUpdatePic.value ? "Y" : "N",
    deletePic: createDeletePic.value ? "Y" : "N",
    restorePic: createRestorePic.value ? "Y" : "N",
    sendComment: createSendComment.value ? "Y" : "N",
    updateComment: createUpdateComment.value ? "Y" : "N",
    deleteComment: createDeleteComment.value ? "Y" : "N",
    restoreComment: createRestoreComment.value ? "Y" : "N",
    sendScore: createSendScore.value ? "Y" : "N",
    updateScore: createUpdateScore.value ? "Y" : "N",
    deleteScore: createDeleteScore.value ? "Y" : "N",
    restoreScore: createRestoreScore.value ? "Y" : "N",
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
function deleteGroup(index) {
  let groupName = groupList.value[index].groupName
  let groupId = groupList.value[index].groupId
  confirm(`是否删除用户组“${groupName}”`, "删除用户组", {
    confirm() {
      dataLoading.value = true
      Delete(AdminUrl.groupUrl, {
        groupId
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
function editGroup(index) {
  updateGroupId.value = groupList.value[index]["groupId"]
  updateGroupName.value = groupList.value[index]["groupName"]
  updateAdmin.value = groupList.value[index]["admin"] === "Y"
  updateUploadPic.value = groupList.value[index]["uploadPic"] === "Y"
  updateUpdatePic.value = groupList.value[index]["updatePic"] === "Y"
  updateDeletePic.value = groupList.value[index]["deletePic"] === "Y"
  updateRestorePic.value = groupList.value[index]["restorePic"] === "Y"
  updateSendComment.value = groupList.value[index]["sendComment"] === "Y"
  updateUpdateComment.value = groupList.value[index]["updateComment"] === "Y"
  updateDeleteComment.value = groupList.value[index]["deleteComment"] === "Y"
  updateRestoreComment.value = groupList.value[index]["restoreComment"] === "Y"
  updateSendScore.value = groupList.value[index]["sendScore"] === "Y"
  updateUpdateScore.value = groupList.value[index]["updateScore"] === "Y"
  updateDeleteScore.value = groupList.value[index]["deleteScore"] === "Y"
  updateRestoreScore.value = groupList.value[index]["restoreScore"] === "Y"
  updateDialog.value = true
}
function updateSubmit() {
  updateDialog.value = false
  dataLoading.value = true
  Put(AdminUrl.groupUrl, {
    groupId: updateGroupId.value,
    groupName: updateGroupName.value,
    admin: updateAdmin.value ? "Y" : "N",
    uploadPic: updateUploadPic.value ? "Y" : "N",
    updatePic: updateUpdatePic.value ? "Y" : "N",
    deletePic: updateDeletePic.value ? "Y" : "N",
    restorePic: updateRestorePic.value ? "Y" : "N",
    sendComment: updateSendComment.value ? "Y" : "N",
    updateComment: updateUpdateComment.value ? "Y" : "N",
    deleteComment: updateDeleteComment.value ? "Y" : "N",
    restoreComment: updateRestoreComment.value ? "Y" : "N",
    sendScore: updateSendScore.value ? "Y" : "N",
    updateScore: updateUpdateScore.value ? "Y" : "N",
    deleteScore: updateDeleteScore.value ? "Y" : "N",
    restoreScore: updateRestoreScore.value ? "Y" : "N",
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
function isAdminFilter(value, row) {
  return row.admin === value
}
function isDefaultFilter(value, row) {
  return row.default === value
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <AdminSidebar default-active="4" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <AdminTop title="用户组管理" />
      </el-header>
      <el-scrollbar height="calc(100vh - 30px)">
      <el-main v-loading="mainLoading">
        <h2>用户组管理</h2>
        <el-form label-position="top" v-loading="dataLoading">
          <el-form-item>
            <el-button @click="createDialog = true" type="primary"><el-icon><Plus /></el-icon> 添加用户组</el-button>
          </el-form-item>
          <el-form-item label="默认用户组">
            <el-select v-model="defaultGroup" @change="updateDefaultGroup">
              <el-option label="请选择用户组" :value="-1" disabled />
              <el-option v-for="item in groupList" :label="item['groupName']" :value="item.groupId" />
            </el-select>
            <el-text type="info"><el-icon><InfoFilled /></el-icon> 该选项将改变新用户注册后的默认用户组；默认用户组不能删除</el-text>
          </el-form-item>
          <el-form-item label="用户组列表">
            <el-table :data="groupList">
              <el-table-column label="id" prop="groupId" sortable />
              <el-table-column label="用户组名称" prop="groupName" sortable width="120" />
              <el-table-column label="是否默认用户组" width="140" :filters="[{text: '是', value: 'Y'}, {text: '否', value: 'N'}]" :filter-method="isDefaultFilter">
                <template #default="scope">
                  <el-icon color="green" v-if="groupList[scope.$index]['default'] === 'Y'"><CircleCheckFilled /></el-icon>
                  <el-icon color="red" v-else><CircleCloseFilled /></el-icon>
                </template>
              </el-table-column>
              <el-table-column label="用户数量" prop="userCount" sortable width="110" />
              <el-table-column label="是否管理员" width="110" align="center" :filters="[{text: '是', value: 'Y'}, {text: '否', value: 'N'}]" :filter-method="isAdminFilter">
                <template #default="scope">
                  <el-icon color="green" v-if="groupList[scope.$index]['admin'] === 'Y'"><CircleCheckFilled /></el-icon>
                  <el-icon color="red" v-else><CircleCloseFilled /></el-icon>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template #default="scope">
                  <el-button type="primary" @click="editGroup(scope.$index)">编辑</el-button>
                  <el-button type="danger" @click="deleteGroup(scope.$index)" :disabled="scope.row.userCount">
                    <el-tooltip v-if="scope.row.userCount" content="用户组不为空" placement="top-start">删除</el-tooltip>
                    <span v-else>删除</span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
  <el-dialog v-model="createDialog">
    <template #header>
      <span>添加用户组</span>
    </template>
    <template #default>
      <el-form label-position="top">
        <el-form-item label="用户组名称">
          <el-input v-model="createGroupName" />
        </el-form-item>
        <el-space wrap :size="24">
          <el-form-item label="是否管理员">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createAdmin" />
          </el-form-item>
          <el-form-item label="上传图片">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createUploadPic" />
          </el-form-item>
          <el-form-item label="更新图片">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createUpdatePic" />
          </el-form-item>
          <el-form-item label="删除图片">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createDeletePic" />
          </el-form-item>
          <el-form-item label="还原图片">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createRestorePic" />
          </el-form-item>
          <el-form-item label="发送评论">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createSendComment" />
          </el-form-item>
          <el-form-item label="更新评论">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createUpdateComment" />
          </el-form-item>
          <el-form-item label="删除评论">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createDeleteComment" />
          </el-form-item>
          <el-form-item label="还原评论">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createRestoreComment" />
          </el-form-item>
          <el-form-item label="发布评分">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createSendScore" />
          </el-form-item>
          <el-form-item label="更新评分">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createUpdateScore" />
          </el-form-item>
          <el-form-item label="删除评分">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createDeleteScore" />
          </el-form-item>
          <el-form-item label="还原评分">
            <el-switch active-text="开启" inactive-text="关闭" v-model="createRestoreScore" />
          </el-form-item>
        </el-space>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="createDialog = false">取消</el-button>
      <el-button @click="createSubmit" type="primary">确定</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="updateDialog">
    <template #header>
      <span>编辑用户组</span>
    </template>
    <template #default>
      <el-form label-position="top">
        <el-form-item label="用户组id">
          <el-input v-model="updateGroupId" disabled />
        </el-form-item>
        <el-form-item label="用户组名称">
          <el-input v-model="updateGroupName" />
        </el-form-item>
        <el-space wrap :size="24">
          <el-form-item label="是否管理员">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateAdmin" />
          </el-form-item>
          <el-form-item label="上传图片">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateUploadPic" />
          </el-form-item>
          <el-form-item label="更新图片">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateUpdatePic" />
          </el-form-item>
          <el-form-item label="删除图片">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateDeletePic" />
          </el-form-item>
          <el-form-item label="还原图片">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateRestorePic" />
          </el-form-item>
          <el-form-item label="发送评论">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateSendComment" />
          </el-form-item>
          <el-form-item label="更新评论">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateUpdateComment" />
          </el-form-item>
          <el-form-item label="删除评论">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateDeleteComment" />
          </el-form-item>
          <el-form-item label="还原评论">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateRestoreComment" />
          </el-form-item>
          <el-form-item label="发布评分">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateSendScore" />
          </el-form-item>
          <el-form-item label="更新评分">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateUpdateScore" />
          </el-form-item>
          <el-form-item label="删除评分">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateDeleteScore" />
          </el-form-item>
          <el-form-item label="还原评分">
            <el-switch active-text="开启" inactive-text="关闭" v-model="updateRestoreScore" />
          </el-form-item>
        </el-space>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="updateDialog = false">取消</el-button>
      <el-button @click="updateSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
h2 {
  margin-top: 0;
}
</style>