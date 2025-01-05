<script setup>
import router from '@/router'

function gotoHome() {
  router.push("/")
}
</script>

<template>
  <el-container>
    <el-row align="middle" justify="center" style="width: 100vw;height: 100vh;">
      <el-col>
        <el-empty>
          <template #description>
            <h3>404 Not Found</h3>
          </template>
          <template #default>
            <el-space wrap direction="vertical" size="large">
              <span>您访问的页面不存在</span>
              <el-button type="primary" @click="gotoHome">返回首页</el-button>
            </el-space>
          </template>
        </el-empty>
      </el-col>
    </el-row>
  </el-container>
</template>

<style scoped lang="scss">

</style>