<script setup>
import AdminSidebar from "@/components/AdminSidebar.vue";
import AdminTop from "@/components/AdminTop.vue";
import {onMounted, ref} from "vue";
import {InfoFilled, WarnTriangleFilled} from "@element-plus/icons-vue";
import {Post} from "@/lib/axiosLib.js";
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";
import {AdminUrl} from "@/api/url.js";

const setting = ref({
  enableEmail: "",
  smtpHost: "",
  smtpPort: "",
  smtpUsername: "",
  smtpPassword: "",
  smtpEncrypt: ""
})

onMounted(()=>{
  setting.value = VARS
})
function saveSetting() {
  Post(AdminUrl.securityUrl, setting.value, {
    ok(res) {
      alertSuccess(res, "保存成功", ()=>location.reload())
    },
    bad(res) {
      alertError(res, "保存失败", ()=>location.reload())
    },
    error(err) {
      axiosError(err, "保存失败", ()=>location.reload())
    }
  })
}
</script>

<template>
  <el-container>
    <el-aside style="width: unset;">
      <AdminSidebar default-active="2" />
    </el-aside>
    <el-container>
      <el-header style="height: 30px;">
        <AdminTop title="安全设置" />
      </el-header>
      <el-scrollbar height="calc(100vh - 30px)">
        <el-main>
          <h2>安全设置</h2>
          <el-form label-position="top">
            <el-form-item label="开启邮箱验证">
              <el-space wrap direction="vertical" alignment="normal">
                <el-switch v-model="setting.enableEmail" active-text="开启" inactive-text="关闭" active-value="Y" inactive-value="N" />
                <el-text type="info"><el-icon><InfoFilled /></el-icon>关闭后在注册时将不需要邮箱验证码，可能有刷注册的风险</el-text>
                <el-text type="info"><el-icon color="yellow"><WarnTriangleFilled /></el-icon>关闭后将无法使用找回密码功能</el-text>
              </el-space>
            </el-form-item>
            <el-form-item label="SMTP服务器" v-if="setting.enableEmail === 'Y'">
              <el-input v-model="setting.smtpHost" :disabled="!setting.enableEmail" />
            </el-form-item>
            <el-form-item label="SMTP用户名" v-if="setting.enableEmail === 'Y'">
              <el-input v-model="setting.smtpUsername" :disabled="!setting.enableEmail" />
            </el-form-item>
            <el-form-item label="SMTP密码" v-if="setting.enableEmail === 'Y'">
              <el-input v-model="setting.smtpPassword" :disabled="!setting.enableEmail" />
            </el-form-item>
            <el-form-item label="SMTP端口" v-if="setting.enableEmail === 'Y'">
              <el-input v-model="setting.smtpPort" :disabled="!setting.enableEmail" />
            </el-form-item>
            <el-form-item label="SMTP加密方式" v-if="setting.enableEmail === 'Y'">
              <el-select v-model="setting.smtpEncrypt" :disabled="!setting.enableEmail">
                <el-option value="tls" label="TLS加密" />
                <el-option value="ssl" label="SSL加密" />
                <el-option value="no" label="不加密" />
              </el-select>
            </el-form-item>
            <el-button @click="saveSetting">保存</el-button>
          </el-form>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
h2 {
  margin-top: 0;
}
</style>