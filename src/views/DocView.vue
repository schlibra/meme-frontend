<script setup lang="ts">
import { GithubOutlined } from "@ant-design/icons-vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import { axiosError } from "@/lib/requestAlert";

interface user {
  username: string,
  work: string,
  followers: number,
  following: number,
  public_repos: number,
  nickname: string
}

const contrib = ref([
  {
    username: "schlibra",
    work: "项目负责人、前端开发、后端开发、需求编写、数据库设计",
    nickname: ""
  },
  {
    username: "yaoyangyaha",
    work: "前后端开发、程序测试、需求编写和完成需求、简介与文档主编<br />"
  }
])
onMounted(()=> {
  console.log(contrib.value.length)
  for (let i = 0; i < contrib.value.length; ++i) {
    let _user = contrib.value[i]
    console.log(_user)
    axios.get(`https://api.github.com/users/${_user.username}`).then(res => {
      console.log(res.data)
      _user.followers = res.data.followers
      _user.following = res.data.following
      _user.public_repos = res.data.public_repos
      _user.nickname = res.data.name
      contrib.value[i] = _user
    }).catch(err => {
      axiosError(err, "数据获取失败")
    })
  }
})
</script>

<template>
  <el-row justify="center" align="middle">
    <el-col :span="24">
      <el-result icon="info" title="关于项目">
        <template #extra>
          <h1>IURT meme 2.0</h1>
          <el-steps direction="vertical" :active="3">
            <el-step title="项目简介">
              <template #description>
                <el-text size="large">
                  <span>IURT meme 2.0梗图收集展示程序，用于记录群友发的有趣的内容，项目灵感来源于</span>
                  <el-link href="https://github.com/modcrafts/a60-shop"><GithubOutlined /><span>modcrafts/a60-shop</span></el-link>
                  <span>，后来将项目重构，使程序中的图片更容易管理</span>
                </el-text>
              </template>
            </el-step>
            <el-step title="引用的框架和开源项目">
              <template #description>
                <ul>
                  <li><el-link>ThinkPHP</el-link></li>
                  <li><el-link>Vue</el-link></li>
                  <li><el-link>Element Plus</el-link></li>
                </ul>
              </template>
            </el-step>
            <el-step title="参与人员">
              <template #description>
                <el-space>
                  <el-card v-for="user in contrib" style="width: 200px;">
                    <template #header>
                      <el-space>
                        <el-avatar :src="`https://avatars.githubusercontent.com/${user.username}`" />
                        <el-link :href="`https://github.com/${user.username}`">{{ user.nickname }}  @{{ user.username }}</el-link>
                      </el-space>
                    </template>
                    <template #default>
                      <el-descriptions :column="1">
                        <el-descriptions-item label="关注者数量">{{ user.following }}</el-descriptions-item>
                        <el-descriptions-item label="被关注数量">{{ user.followers }}</el-descriptions-item>
                        <el-descriptions-item label="开源仓库数量">{{ user.public_repos }}</el-descriptions-item>
                      </el-descriptions>
                    </template>
                    <template #footer>
                      <el-text v-html="user.work" />
                    </template>
                  </el-card>
                </el-space>
              </template>
            </el-step>
          </el-steps>
        </template>
      </el-result>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
h1 {
  text-align: center;
  width: 100%;
  font-size: 40px;
}
.el-row {
  width: 100%;
  height: 100%;
}
</style>