<script setup>
import UserTop from "@/components/UserTop.vue";
import UserSidebar from "@/components/UserSidebar.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import { UserUrl } from "@/api/url.js";
import router from "@/router/index.js";
import {alertError, alertSuccess, axiosError, axiosOk } from "@/lib/requestAlert.js";
import confirm from "@/lib/confirmLib.js";
import {Delete, Get, Patch} from "@/lib/axiosLib.js";

const token = getToken()
const user = ref("")
const mainLoading = ref(true)
const scoreList = ref([])
const dataLoading = ref(true)
const pageSize = ref(20)
const pageNum = ref(1)
const total = ref(0)
const updateDialog = ref(false)
const updateId = ref("")
const updateScore = ref(0)
const updateName = ref("")
const updateLoading = ref(false)

onMounted(()=>{
  if (token) {
    axios.get(UserUrl.infoUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res=>{
      if (axiosOk(res)) {
        user.value = res.data.data
      } else {
        alertError(res, "数据获取失败", ()=>router.push("/login"))
      }
    }).catch(err=>{
      axiosError(err, "数据获取失败", ()=>location.reload())
    }).finally(()=>mainLoading.value=false)
    getList()
  } else {
    router.push("/login")
  }
})
function getList() {
  Get(UserUrl.scoreUrl, {
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }, {
    ok(res, data) {
      scoreList.value = data
      total.value = res.data.count
    },
    bad(res) {
      alertError(res, "数据获取失败", ()=>router.push("/login"))
    },
    error(err) {
      axiosError(err, "数据获取失败", ()=>location.reload())
    },
    final() {
      dataLoading.value = false
    }
  })
}
function editScore(index) {
  updateId.value = scoreList.value[index]["scoreId"]
  updateScore.value = scoreList.value[index].score
  updateName.value = scoreList.value[index].name
  updateDialog.value = true
}
function updateSubmit() {
  updateLoading.value = true
  axios.put(UserUrl.scoreUrl, {
    id: updateId.value,
    score: updateScore.value
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res=>{
    if (axiosOk(res)) {
      alertSuccess(res, "评分更新成功", getList)
    } else {
      alertError(res, "评分更新失败")
    }
  }).catch(err=>{
    axiosError(err, "评分更新失败")
  }).finally(()=>{
    updateLoading.value = false
    updateDialog.value = false
  })
}
function deleteScore(index) {
  confirm("是否删除这条评分", "删除评分", {
    confirm() {
      dataLoading.value = true
      Delete(UserUrl.scoreUrl, {
        id: scoreList.value[index]["scoreId"]
      }, {
        ok(res) {
          alertSuccess(res, "删除成功", getList)
        },
        bad(res) {
          alertError(res, "删除失败")
        },
        error(err) {
          alertError(err, "删除失败")
        },
        final() {
          dataLoading.value = false
        }
      })
    }
  })
}
function restoreScore(index) {
  confirm("是否还原这条评分", "还原评分", {
    confirm() {
      dataLoading.value = true
      Patch(UserUrl.scoreUrl, {
        id: scoreList.value[index]["scoreId"]
      }, {
        ok(res) {
          alertSuccess(res, "还原成功", getList)
        },
        bad(res) {
          alertError(res, "还原失败")
        },
        error(err) {
          axiosError(err, "还原失败")
        },
        final() {
          dataLoading.value = false
        }
      })
    }
  })
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <UserSidebar default-active="5" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <UserTop title="评分列表" />
      </el-header>
      <el-main>
        <h2>评分列表</h2>
        <el-form label-position="top" v-loading="mainLoading">
          <el-form-item label="当前用户">
            <el-text type="info">{{ user["nickname"] }} （{{ user["username"] }}）</el-text>
          </el-form-item>
          <el-form-item label="评分列表">
            <el-table v-loading="dataLoading" :data="scoreList" max-height="50vh">
              <el-table-column label="id" prop="scoreId" width="50" />
              <el-table-column label="图片预览" width="150">
                <template #default="scope">
                  <el-image :src="scoreList[scope.$index].url" />
                </template>
              </el-table-column>
              <el-table-column label="图片名称" prop="name" />
              <el-table-column label="我的评分">
                <template #default="scope">
                  <el-rate v-model="scoreList[scope.$index].score" disabled show-score score-template="{value} 分" />
                </template>
              </el-table-column>
              <el-table-column label="评分状态">
                <template #default="scope">
                  <el-tag type="danger" v-if="scoreList[scope.$index].delete">已删除</el-tag>
                  <el-tag type="success" v-else>正常</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button @click="editScore(scope.$index)" v-if="user['updateScore'] === 'Y'" type="primary">编辑</el-button>
                  <el-button @click="restoreScore(scope.$index)" type="warning" v-if="scoreList[scope.$index].delete&&user['restoreScore']==='Y'">还原</el-button>
                  <el-button @click="deleteScore(scope.$index)" type="danger" v-if="!scoreList[scope.$index].delete&&user['deleteScore']==='Y'">删除</el-button>
                  <el-text type="info" v-if="user['updateScore']!=='Y'&&!(scoreList[scope.$index].delete&&user['restoreScore']==='Y')&&scoreList[scope.$index].delete&&user['deleteScore']!=='Y'">没有权限操作</el-text>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :total="total"
                           v-model:page-size="pageSize" v-model:current-page="pageNum"
                           :page-sizes="[20, 40, 60]" layout="sizes, prev, pager, next, jumper, total"
                           @current-change="getList" @size-change="getList" />
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="updateDialog">
    <template #header>
      <span>修改评分</span>
    </template>
    <template #default>
      <el-form label-position="top">
        <el-form-item label="评分id">
          <el-input v-model="updateId" disabled />
        </el-form-item>
        <el-form-item label="图片名称">
          <el-input v-model="updateName" disabled />
        </el-form-item>
        <el-form-item label="图片评分">
          <el-rate v-model="updateScore" allow-half show-score score-template="{value} 分" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="updateDialog = false">取消</el-button>
      <el-button @click="updateSubmit" type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
h2 {
  margin-top: 0;
}
</style>