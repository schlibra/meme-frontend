<script setup>
import AdminSidebar from "@/components/AdminSidebar.vue";
import AdminTop from "@/components/AdminTop.vue";
import { ref } from "vue"
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";
import {AdminUrl} from "@/api/url.js";
import {InfoFilled} from "@element-plus/icons-vue";
import confirm from "@/lib/confirmLib.js";
import {Get, Post} from "@/lib/axiosLib.js";

const dataLoading = ref(false)
const upload = ref(null)

function backupData() {
  dataLoading.value = true
  Get(AdminUrl.backupUrl, {}, {
    ok(_, data) {
      let part = new Uint8Array(data.length)
      for (let i = 0; i < data.length; ++i) {
        part[i] = data.charCodeAt(i)
      }
      let blob = new Blob([part], {
        type: "application/octet-stream",

      })
      let url = URL.createObjectURL(blob)
      window.open(url, "_blank")
    },
    bad(res) {
      alertError(res, "备份失败")
    },
    error(err) {
      axiosError(err, "备份失败")
    },
    final() {
      dataLoading.value = false
    }
  })
}
function restoreData() {
  dataLoading.value = true
  confirm("是否还原备份，该操作会覆盖原有数据，将无法恢复", "还原备份", {
    confirm() {
      let file = upload.value.files[0]
      Post(AdminUrl.backupUrl, {
        file
      }, {
        ok(res) {
          alertSuccess(res, "备份还原成功", ()=>location.reload())
        },
        bad(res) {
          alertError(res, "备份还原失败", ()=>location.reload())
        },
        error(err) {
          axiosError(err, "备份还原失败", ()=>location.reload())
        },
        final() {
          dataLoading.value = false
        }
      }, "multipart/form-data")
      console.log(file)
    }
  })
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <AdminSidebar default-active="13" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <AdminTop title="备份与恢复" />
      </el-header>
      <el-scrollbar height="calc(100vh - 30px)">
        <el-main>
          <h2>备份与恢复</h2>
          <el-form label-position="top" v-loading="dataLoading">
            <el-form-item label="备份数据">
              <el-button type="primary" @click="backupData">备份数据</el-button>
            </el-form-item>
            <el-form-item label="恢复备份">
              <el-space direction="vertical" alignment="normal" wrap>
                <input type="file" placeholder="上传备份文件" ref="upload" />
                <el-button type="warning" @click="restoreData">恢复备份</el-button>
                <el-text type="info"><el-icon><InfoFilled /></el-icon> 恢复备份将覆盖现有数据</el-text>
              </el-space>
            </el-form-item>
          </el-form>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">

</style>