<script setup lang="ts">
import AdminSidebar from "@/components/AdminSidebar.vue";
import AdminTop from "@/components/AdminTop.vue";
import {computed, onMounted, Ref, ref} from 'vue'
import {Get} from "@/lib/axiosLib.js";
import {AdminUrl} from "@/api/url.js";
import {alertError, axiosError} from "@/lib/requestAlert.js";
import Picture from "@/model/picture";
import User from "@/model/user";

const pic = ref([])
const picList = ref([])
const userList = ref([])
const mainLoading = ref(true)
const pageTotal = ref(0)
const editPictureData: Ref<Picture> = ref({})
const editPicDialog = ref(false)

const picNameSearch = ref("")
const picDescSearch = ref("")

const searchList = computed(()=>
  pic.value.filter((data: Picture)=>
      (!picNameSearch.value||data.name.toLowerCase().includes(picNameSearch.value.toLowerCase())) &&
      (!picDescSearch.value||data.description.toLowerCase().includes(picDescSearch.value.toLowerCase())))
)
const reload = () => location.reload()

onMounted(()=>{
  getUserList()
  getList()
})
function getUserList() {
  Get(AdminUrl.userUrl, {}, {
    ok(_, data) {
      data.forEach((item: any)=>{
        userList.value.push({
          text: item.nickname,
          value: item.userId
        })
      })
    },
    bad(res) {
      alertError(res, "用户列表获取失败", ()=>location.reload())
    },
    error(err) {
      axiosError(err, "用户列表获取失败", ()=>location.reload())
    },
    final(){}
  })
}
function getList() {
  Get(AdminUrl.pictureUrl, {
    pageSize: 20,
    pageNum: 1
  }, {
    ok(res, data) {
      picList.value = []
      pic.value = data
      pageTotal.value = res.data.count
      pic.value.forEach((item: Picture)=>{
        picList.value.push(item.url)
      })
    },
    bad(res) {
      alertError(res, "图片获取失败", reload)
    },
    error(err) {
      axiosError(err, "图片获取失败", err)
    },
    final() {
      mainLoading.value = false
    }
  })
}
function userFilter(value: number, row: User) {
  return row.userId === value
}
function editPicture(row: Picture) {
  editPictureData.value = row
  editPicDialog.value = true
}
function updatePicture() {

}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <AdminSidebar default-active="6" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <AdminTop title="图片管理" />
      </el-header>
      <el-main v-loading="mainLoading">
        <h2>图片管理</h2>
        <el-form label-position="top">
          <el-form-item label="图片列表">
            <el-table :data="searchList" max-height="calc(100vh - 180px)">
              <el-table-column label="图片id" prop="picId" width="100" sortable />
              <el-table-column prop="name" width="220">
                <template #header>
                  <el-input size="small" placeholder="搜索图片名称" v-model="picNameSearch">
                    <template #prepend>
                      <el-text>图片名称</el-text>
                    </template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="description" width="300">
                <template #header>
                  <el-input size="small" placeholder="搜索图片描述" v-model="picDescSearch">
                    <template #prepend>
                      <el-text>图片描述</el-text>
                    </template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="图片" width="150">
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <el-image :src="scope.row.url" :preview-src-list="[scope.row.url]" preview-teleported :initial-index="1" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="图片压缩方式" width="150" :filters="[{text: '未压缩', value: 'no'}]" :filter-method="() => true">
                <template #default>
                  <el-tag type="warning">未压缩</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="上传用户" :filters="userList" :filter-method="userFilter" width="200">
                <template #default="scope">
                  <el-text>{{ scope.row.nickname }}（{{ scope.row.userId }}）</el-text>
                </template>
              </el-table-column>
              <el-table-column label="图片状态">
                <el-tag type="success">正常</el-tag>
              </el-table-column>
              <el-table-column label="评论数量" prop="commentCount" />
              <el-table-column label="图片评分" width="200">
                <template #default="scope">
                  <el-rate v-model="scope.row.score" show-score :score-template="scope.row.score ? scope.row.score + '分' : '无评分'" disabled />
                </template>
              </el-table-column>
              <el-table-column label="上传时间" prop="create" sortable width="200" />
              <el-table-column label="修改时间" prop="update" sortable width="200" />
              <el-table-column label="删除时间" prop="delete" sortable width="200">
                <template #default="scope">
                  <span v-if="scope.row.delete">{{ scope.row.delete }}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button type="warning" @click="editPicture(scope.row)">编辑</el-button>
                  <el-button type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="editPicDialog">
    <template #header>
      <span>编辑图片</span>
    </template>
    <template #default>
      <el-form label-position="top">
        <el-form-item label="图片id">
          <el-input v-model="editPictureData.picId" disabled />
        </el-form-item>
        <el-form-item label="图片名称">
          <el-input v-model="editPictureData.name" />
        </el-form-item>
        <el-form-item label="图片描述">
          <el-input v-model="editPictureData.description" type="textarea" />
        </el-form-item>
        <el-form-item label="图片内容">
          <el-image :src="editPictureData.url" size="200" />
          <input type="file" />
        </el-form-item>
        <el-form-item label="图片压缩方式">
          <el-select>
            <el-option disabled label="请选择图片压缩方式" />
            <el-option value="no" label="不压缩" />
            <el-option value="gzip" label="gzip压缩" />
            <el-option value="bzip" label="bzip压缩" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否审核">
          <el-switch v-model="editPictureData.verified" active-value="Y" inactive-value="N" />
        </el-form-item>
        <el-form-item label="是否删除">
          <el-switch />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button>取消</el-button>
      <el-button @click="updatePicture">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
h2 {
  margin-top: 0;
}
</style>