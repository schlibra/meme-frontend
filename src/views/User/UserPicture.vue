<script setup>
import UserSidebar from "@/components/UserSidebar.vue";
import UserTop from "@/components/UserTop.vue";
import {getToken} from "@/lib/tokenLib.js";
import {onMounted, ref} from "vue";
import router from "@/router/index.js";
import axios from "axios";
import {PicsUrl, UserUrl} from "@/api/url.js";
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";
import confirm from "@/lib/confirmLib.js";

const token = getToken()
const user = ref({})
const picList = ref([])
const urlList = ref([])
const picTotal = ref(0)
const mainLoading = ref(true)
const picLoading = ref(true)
const pageSize = ref(20)
const currentPage = ref(1)
const editDialog = ref(false)
const editId = ref(0)
const editName = ref("")
const editDescription = ref("")
const editLoading = ref(false)
const editImage = ref(null)

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
    }).finally(()=>mainLoading.value = false)
    axios.get(UserUrl.picsUrl + "?pageSize=20&pageNum=1", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res=>{
      if (res.data.code === 200) {
        picList.value = res.data.data
        picTotal.value = res.data.count
        urlList.value = []
        picList.value.forEach(item=>{
          urlList.value.push(item.url)
        })
      } else {
        alertError(res, "数据获取失败", ()=>router.push("/login"))
      }
    }).catch(err=>{
      axiosError(err, "数据获取失败", ()=>location.reload())
    }).finally(()=>picLoading.value = false)
  } else {
    router.push("/login")
  }
})
function reload() {
  picLoading.value = true
  axios.get(UserUrl.picsUrl + `?pageSize=${pageSize.value}&pageNum=${currentPage.value}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res=>{
    if (res.data.code === 200) {
      picList.value = res.data.data
      picTotal.value = res.data.count
      urlList.value = []
      picList.value.forEach(item=>{
        urlList.value.push(item.url)
      })
    } else {
      alertError(res, "数据获取失败", ()=>router.push("/login"))
    }
  }).catch(err=>{
    axiosError(err, "数据获取失败", ()=>location.reload())
  }).finally(()=>picLoading.value = false)
}
function editPic(index) {
  editId.value = picList.value[index]["picId"]
  editName.value = picList.value[index].name
  editDescription.value = picList.value[index].description
  editDialog.value = true
}
function editSubmit() {
  let pic = editId.value
  let name = editName.value
  let description = editDescription.value
  let image = editImage.value["files"][0]
  editLoading.value = true
  axios.put(UserUrl.picsUrl, {
    pic,
    name,
    description,
    image
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res=>{
    if (res.data.code === 200) {
      alertSuccess(res, "更新成功", ()=>{
        reload()
        editDialog.value = false
      })
    } else {
      alertError(res, "更新失败")
    }
  }).catch(err=>{
    axiosError(err, "更新失败")
  }).finally(()=> {
    editLoading.value = false
  })
}
function restorePic(index) {
  confirm(`是否还原图片“${picList.value[index].name}”`, "还原图片", {
    confirm() {
      picLoading.value = true
      axios.patch(UserUrl.picsUrl, {
        pic: picList.value[index]["picId"]
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res=>{
        if (res.data.code === 200) {
          alertSuccess(res, "还原成功", reload)
        } else {
          alertError(res, "还原失败")
        }
      }).catch(err=>{
        axiosError(err, "还原失败")
      }).finally(()=>picLoading.value=false)
    }
  })
}
function deletePic(index) {
  confirm(`是否删除图片“${picList.value[index].name}”`, "删除图片", {
    confirm() {
      picLoading.value = true
      axios.delete(`${UserUrl.picsUrl}?pic=${picList.value[index]["picId"]}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res=>{
        if (res.data.code === 200) {
          alertSuccess(res, "删除成功", reload)
        } else {
          alertError(res, "删除失败")
        }
      }).catch(err=>{
        axiosError(err, "删除失败")
      }).finally(()=>picLoading.value=false)
    }
  })
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <UserSidebar default-active="4" />
    </el-aside>
    <el-container>
      <el-header height="30px">
        <UserTop title="图片列表" />
      </el-header>
      <el-main>
        <h2>图片列表</h2>
        <el-form label-position="top" v-loading="mainLoading">
          <el-form-item label="当前用户">
            <el-text type="info">{{ user.nickname }}</el-text>
          </el-form-item>
          <el-form-item label="图片列表">
            <el-table :data="picList" v-loading="picLoading" max-height="50vh">
              <el-table-column label="id" prop="picId" width="50" />
              <el-table-column label="图片预览">
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <el-image :src="picList[scope.$index].url" :preview-src-list="urlList" preview-teleported :initial-index="scope.$index" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="图片名称" prop="name" />
              <el-table-column label="图片描述" prop="description" />
              <el-table-column label="图片评分" width="150">
                <template #default="scope">
                  <el-rate disabled v-model="picList[scope.$index]['score']" />
                </template>
              </el-table-column>
              <el-table-column label="上传时间" prop="create" />
              <el-table-column label="更新时间" prop="update" />
              <el-table-column label="图片状态">
                <template #default="scope">
                  <el-tag v-if="picList[scope.$index].delete" type="danger">已删除</el-tag>
                  <el-tag v-else type="success">正常</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template #default="scope">
                  <el-button type="primary" @click="editPic(scope.$index)" v-if="user['updatePic'] === 'Y'">编辑</el-button>
                  <el-button type="warning" v-if="picList[scope.$index].delete && user['restorePic'] === 'Y'" @click="restorePic(scope.$index)">还原</el-button>
                  <el-button type="danger" @click="deletePic(scope.$index)" v-if="!picList[scope.$index].delete && user['deletePic'] === 'Y'">删除</el-button>
                  <el-text v-if="user['updatePic']!=='Y'&&!(picList[scope.$index].delete&&user['restorePic']==='Y')&&!picList[scope.$index].delete&&user['deletePic']!=='Y'" type="info">没有权限操作</el-text>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :total="picTotal"
                           v-model:page-size="pageSize" v-model:current-page="currentPage"
                           :page-sizes="[20, 40, 60]" layout="sizes, prev, pager, next, jumper, total"
                           @current-change="reload" @size-change="reload" />
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="editDialog">
    <template #header>
      <span>编辑图片</span>
    </template>
    <template #default>
      <el-form v-loading="editLoading" label-position="top">
        <el-form-item label="图片ID">
          <el-text type="info">{{ editId }}</el-text>
        </el-form-item>
        <el-form-item label="图片名称">
          <el-input v-model="editName" />
        </el-form-item>
        <el-form-item label="图片描述">
          <el-input v-model="editDescription" />
        </el-form-item>
        <el-form-item label="更换图片">
          <el-space direction="vertical">
            <el-image :src="`${PicsUrl.imageUrl}/${editId}`" style="width: 100px;height: 100px;" />
            <input type="file" ref="editImage" />
          </el-space>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="editDialog = false">取消</el-button>
      <el-button type="primary" @click="editSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
h2 {
  margin-top: 0;
}
</style>