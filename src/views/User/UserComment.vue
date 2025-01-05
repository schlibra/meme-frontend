<script setup>
import UserSidebar from "@/components/UserSidebar.vue";
import UserTop from "@/components/UserTop.vue";
import {onMounted, ref} from "vue";
import {Delete, Get, Patch, Put} from "@/lib/axiosLib.js";
import {UserUrl} from "@/api/url.js";
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";
import router from "@/router/index.js";
import confirm from "@/lib/confirmLib.js";

const userInfo = ref({});
const mainLoading = ref(true)
const commentLoading = ref(true)
const pageSize = ref(20)
const pageNum = ref(1)
const total = ref(0);
const commentList = ref([])
const editDialog = ref(false)
const editCommentId = ref('')
const editImageName = ref('')
const editCommentContent = ref('')

onMounted(()=>{
  Get(UserUrl.infoUrl, {}, {
    ok(_, data) {
      userInfo.value = data
    },
    bad(res) {
      alertError(res, "用户信息获取失败", ()=>router.push("/login"))
    },
    error(err) {
      axiosError(err, "数据获取失败", ()=>location.reload())
    },
    final() {
      mainLoading.value = false
    }
  })
  getList()
})
function getList() {
  commentLoading.value = true
  Get(UserUrl.commentUrl, {
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }, {
    ok(res, data) {
      total.value = res.count
      commentList.value = data
    },
    bad(res) {
      alertError(res, "数据获取失败")
    },
    error(err) {
      axiosError(err, "数据获取失败")
    },
    final() {
      commentLoading.value = false
    }
  })
}
function editComment(index) {
  editCommentId.value = commentList.value[index]['commentId']
  editImageName.value = commentList.value[index]['name']
  editCommentContent.value = commentList.value[index]['comment']
  editDialog.value = true
}
function deleteComment(index) {
  let commentId = commentList.value[index]['commentId']
  confirm('是否删除这条评论', '删除评论', {
    confirm() {
      commentLoading.value = true
      Delete(UserUrl.commentUrl, {
        commentId
      }, {
        ok(res) {
          alertSuccess(res, "删除成功", getList)
        },
        bad(res) {
          alertError(res, "删除失败", getList)
        },
        error(err) {
          axiosError(err, "删除失败", getList)
        },
        final() {
          commentLoading.value = false
        }
      })
    }
  })
}
function restoreComment(index) {
  let commentId = commentList.value[index]['commentId']
  confirm('是否还原这条评论', '还原评论', {
    confirm() {
      commentLoading.value = true
      Patch(UserUrl.commentUrl, {
        commentId
      }, {
        ok(res) {
          alertSuccess(res, '还原成功', getList)
        },
        bad(res) {
          alertError(res, '还原失败', getList)
        },
        error(err) {
          axiosError(err, '还原失败', getList)
        },
        final() {
          commentLoading.value = false
        }
      })
    }
  })
}
function editCommentSubmit() {
  editDialog.value = false
  commentLoading.value = true
  Put(UserUrl.commentUrl, {
    commentId: editCommentId.value,
    comment: editCommentContent.value
  }, {
    ok(res) {
      alertSuccess(res, '更新成功', getList)
    },
    bad(res) {
      alertError(res, '更新失败', getList)
    },
    error(err) {
      axiosError(err, '更新失败', getList)
    },
    final() {
      commentLoading.value = false
    }
  })
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset">
      <UserSidebar default-active="6" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <UserTop title="评论列表" />
      </el-header>
      <el-main>
        <h2>评论列表</h2>
        <el-form label-position="top" v-loading="mainLoading">
          <el-form-item label="当前用户">
            <el-text type="info">{{ userInfo.nickname }}（{{ userInfo.username }}）</el-text>
          </el-form-item>
          <el-form-item label="评论列表">
            <el-table :data="commentList">
              <el-table-column label="id" prop="commentId" />
              <el-table-column label="图片预览">
                <template #default="scope">
                  <el-image :src="commentList[scope.$index].url" />
                </template>
              </el-table-column>
              <el-table-column label="图片名称" prop="name" />
              <el-table-column label="评论内容" prop="comment" />
              <el-table-column label="评论状态">
                <template #default="scope">
                  <el-tag type="danger" v-if="commentList[scope.$index].delete">已删除</el-tag>
                  <el-tag type="success" v-else>正常</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button type="primary" @click="editComment(scope.$index)">编辑</el-button>
                  <el-button type="warning" @click="restoreComment(scope.$index)" v-if="commentList[scope.$index].delete">还原</el-button>
                  <el-button type="danger" @click="deleteComment(scope.$index)" v-else>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="editDialog">
    <template #header>
      <span>编辑评论</span>
    </template>
    <template #default>
      <el-form label-position="top">
        <el-form-item label="评论id">
          <el-input disabled v-model="editCommentId" />
        </el-form-item>
        <el-form-item label="图片名称">
          <el-input disabled v-model="editImageName" />
        </el-form-item>
        <el-form-item label="评论内容">
          <el-input type="textarea" v-model="editCommentContent" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="editDialog = false">取消</el-button>
      <el-button @click="editCommentSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
h2 {
  margin-top: 0;
}
</style>