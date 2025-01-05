<script setup>
import {onMounted, ref} from "vue";
import router from "@/router/index.js";
import {PicsUrl, UserUrl} from "@/api/url.js";
import {alertError, alertSuccess, axiosError} from "@/lib/requestAlert.js";
import {getToken, removeToken} from "@/lib/tokenLib.js";
import confirm from "@/lib/confirmLib.js";
import displayUtil from "@/lib/displayUtil.js";
import {Get, Post} from "@/lib/axiosLib.js";
import l from "@/lib/languageLib.js"
import {useLoadingStore} from "@/stores/LoadingStore.js";
import {usePictureStore} from "@/stores/PictureStore.js";
const user = ref({})
const loadingStore = useLoadingStore()
const pictureStore = usePictureStore()

const token = ref(getToken())
const strings = ref(["IURT meme 2.0"])  // 这里不要直接修改，部署后通过这里修改打字内容
const enableTyping = ref([true, "enableHomeType"])
const currentPage = ref(1)
const pageSize = ref(20)
const search = ref("")
const picList = ref([])
const imgList = ref([]);
const totalCount = ref(0);
const mainLoading = ref(true)
const showDrawer = ref(false)
const imgDetail = ref({})
const imgDetailScore = ref(0)
const detailLoading = ref(false)

const uploadDialog = ref(false);
const uploadName = ref("");
const uploadDescription = ref("");
const uploadFile = ref(null);
const uploadLoading = ref(false)

const randomPic = ref({})
const showRandom = ref(false)

const commentList = ref([])
const comment = ref('')

const setting = ref({})

onMounted(async () => {
  setting.value = VARS
  Get(UserUrl.infoUrl, {}, {
    ok(_, data) {
      user.value = data
    },
    bad(res) {
      token.value = ""
    },
    error(err) {
      axiosError(err, l("user.info.get_error"), reload)
    }
  })
  await pictureStore.getPic()
  Get(PicsUrl.picUrl, {}, {
    ok(res, data) {
      imgList.value = []
      picList.value = data
      totalCount.value = res.data.count
      data.forEach(item => {
        imgList.value.push(item.url)
      })
    },
    bad(res) {
      alertError(res, l("common.get_data_error"), () => location.reload())
    },
    error(err) {
      axiosError(err, l("common.get_data_error"), () => location.reload())
    },
    final() {
      loadingStore.mainLoading = false
    }
  })
})

function reload() {
  mainLoading.value = true
  Get(PicsUrl.picUrl, {
    pageSize: pageSize.value,
    pageNum: currentPage.value,
    name: search.value
  }, {
    ok(res, data) {
      imgList.value = [];
      picList.value = data
      totalCount.value = res.data.count
      data.forEach(item => {
        imgList.value.push(item.url)
      })
    },
    bad(res) {
      alertError(res, l("common.get_data_error"))
    },
    error(err) {
      axiosError(err, l("common.get_data_error"), () => location.reload())
    },
    final() {
      mainLoading.value = false
    }
  })
}

function randomImg() {
  Get(PicsUrl.randomUrl, {}, {
    ok(_, data) {
      randomPic.value = data
      showRandom.value = true
    }
  })
}

function gotoLogin() {
  router.push("/login")
}

function gotoUser() {
  router.push("/user/basic")
}

function gotoAdmin() {
  router.push("/admin/basic")
}

function randomDetail() {
  imgDetail.value = randomPic.value
  imgDetailScore.value = 0
  getCommentList()
  showDrawer.value = true
}

function openDetail(index) {
  imgDetail.value = picList.value[index]
  imgDetailScore.value = 0
  getCommentList()
  showDrawer.value = true
}

function uploadSubmit() {
  uploadLoading.value = true
  Post(PicsUrl.picUrl, {
    image: uploadFile.value["files"][0],
    name: uploadName.value,
    description: uploadDescription.value
  }, {
    ok(res) {
      alertSuccess(res, l("home.upload.success"), () => {
        reload()
        uploadDialog.value = false
        uploadFile.value["files"] = [];
        uploadName.value = ""
        uploadDescription.value = ""
      })
    },
    bad(res) {
      alertError(res, l("home.upload.error"))
    },
    error(err) {
      axiosError(err, l("home.upload.error"))
    },
    final() {
      uploadLoading.value = false
    }
  }, "multipart/form-data")
}

function logout() {
  confirm(l("home.logout.confirm"), l("home.logout.title"), {
    confirm() {
      loadingStore.mainLoading = true
      Post(UserUrl.logoutUrl, {}, {
        final() {
          loadingStore.mainLoading = false
          token.value = ""
          removeToken()
          confirm("已退出登录，是否前往登录页面", "前往登录", {
            confirm() {
              router.push("/login")
            },
            cancel: reload,
            close: reload
          })
        }
      })
    }
  })
}

function submitScore() {
  let score = imgDetailScore.value
  if (score) {
    confirm(`确定为图片“${imgDetail.value.name}”打${score}分吗`, "打分确认", {
      confirm() {
        detailLoading.value = true
        Post(PicsUrl.scoreUrl, {
          score,
          pic: imgDetail.value["picId"]
        }, {
          ok(res) {
            alertSuccess(res, "评分成功", () => {
              reload()
              imgDetail.value["scored"] = "Y"
              imgDetail.value["myScore"] = score
            })
          },
          bad(res) {
            alertError(res, "评分失败")
          },
          error(err) {
            axiosError(err, "评分失败")
          },
          final() {
            detailLoading.value = false
          }
        })
      }
    })
  } else {
    alertError("请先选择评分再点击提交", "评分失败")
  }
}

function getCommentList() {
  Get(PicsUrl.commentUrl, {
    pic: imgDetail.value["picId"]
  }, {
    ok(_, data) {
      commentList.value = data;
    },
    error: err => axiosError(err, "评论获取失败")
  })
}

function submitComment() {
  if (comment.value) {
    confirm(`确定在图片“${imgDetail.value.name}”的评论区下评论吗？`, "评论确认", {
      confirm() {
        detailLoading.value = true
        Post(PicsUrl.commentUrl, {
          comment: comment.value,
          pic: imgDetail.value["picId"],
          reply: 0
        }, {
          ok(res) {
            alertSuccess(res, "评论成功", () => {
              comment.value = ""
              reload()
              getCommentList()
            })
          },
          bad(res) {
            alertError(res, "评论失败")
          },
          error(err) {
            axiosError(err, "评论失败")
          },
          final() {
            detailLoading.value = false
          }
        })
      }
    })
  } else {
    alertError("请先输入评论内容后再提交", "评论失败")
  }
}

</script>

<template>
  <div class="typed">
    <vuetyped :strings="strings" :fade-out="true" :loop="enableTyping[0]" :cursor-char="enableTyping[0] ? '_' : ''">
      <h1 class="typing"></h1>
    </vuetyped>
    <h3 class="center" v-if="token">{{ l("home.welcome_user", user.nickname, user.username, user.groupName) }}<el-tag type="danger" v-if="!user['groupName']">{{ l("home.group_error") }}</el-tag>）</h3>
  </div>
  <div class="buttons hidden-xs-only">
    <el-button type="primary" @click="randomImg">{{ l("home.random") }}</el-button>
    <el-button type="info" v-if="!token" @click="gotoLogin">{{ l("home.login_user") }}</el-button>
    <el-button type="primary" v-if="token" @click="gotoUser">{{ l("home.user_center") }}</el-button>
    <el-button type="primary" v-if="token && user['uploadPic'] === 'Y'" @click="uploadDialog = true">{{ l("home.upload.title") }}</el-button>
    <el-button type="warning" v-if="user['admin'] === 'Y'" @click="gotoAdmin">{{ l("home.admin") }}</el-button>
    <el-button type="danger" v-if="token" @click="logout">{{ l("home.logout.title") }}</el-button>
  </div>
  <div class="buttons hidden-sm-and-up">
    <el-button size="small" type="primary" @click="randomImg">随机梗图</el-button>
    <el-button size="small" type="info" v-if="!token" @click="gotoLogin">登录账号</el-button>
    <el-button size="small" type="primary" v-if="token" @click="gotoUser">个人中心</el-button>
    <el-button size="small" type="primary" v-if="token && user['uploadPic'] === 'Y'" @click="uploadDialog = true">上传图片</el-button>
    <el-button size="small" type="warning" v-if="user['admin'] === 'Y'" @click="gotoAdmin">系统设置</el-button>
    <el-button size="small" type="danger" v-if="token" @click="logout">退出登录</el-button>
  </div>
  <el-input class="search" v-model="search" placeholder="搜索图片" @change="reload" />
  <el-divider />
  <el-scrollbar :height="displayUtil.isXs ? token ? 'calc(100vh - 470px)' : 'calc(100vh - 410px)' : token ? 'calc(100vh - 390px)' : 'calc(100vh - 330px)'">
    <el-row :gutter="8" class="main" v-loading="loadingStore.mainLoading">
      <el-col  :xs="24" :sm="12" :md="8" :lg="6" :xl="6" v-for="(img, index) in picList" :key="img.id">
        <el-card class="img-card">
          <template #header>
            <el-text truncated>{{ img.name }}</el-text>
          </template>
          <template #default>
            <el-image
              class="item-img" :src="img.url" :zoom-rate="1.2"
              :max-scale="7" :min-scale="0.2"
              :preview-src-list="imgList"
              :initial-index="index" fit="contain">
              <template #error>
                <el-empty description="图片加载失败咯" />
              </template>
            </el-image>
          </template>
          <template #footer>
            <el-space direction="vertical">
              <el-rate
                v-model="img.score" disabled show-score text-color="#ff9900"
                :score-template="img.score === 0 ? '暂无评分' : `${img.score}分`" />
              <el-button
                  type="primary"
                  @click="openDetail(index)">查看详情</el-button>
            </el-space>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>
  <div class="center">
    <el-pagination
        :total="totalCount" :page-size="20" :page-sizes="[20, 40, 80, 100]"
        :layout="displayUtil.isXs ? 'sizes, prev, pager, next, total' : 'sizes, prev, pager, next, total, jumper'" :size="displayUtil.isXs ? 'small' : 'default'"
        @size-change="reload" @current-change="reload"
        v-model:current-page="currentPage" v-model:page-size="pageSize"/>
  </div>

  <el-dialog v-model="uploadDialog" v-loading="uploadLoading">
    <template #header>
      <span>上传图片</span>
    </template>
    <template #default>
      <el-form label-position="top">
        <el-form-item label="图片名称">
          <el-input v-model="uploadName" />
        </el-form-item>
        <el-form-item label="图片描述">
          <el-input type="textarea" v-model="uploadDescription" />
        </el-form-item>
        <el-form-item label="上传图片">
          <input type="file" ref="uploadFile" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="uploadDialog = false">取消</el-button>
      <el-button @click="uploadSubmit" type="primary">提交</el-button>
    </template>
  </el-dialog>
  <el-drawer :size="displayUtil.isXs ? '75%' : '50%'" v-model="showDrawer">
    <template #header>
      <span>图片详情</span>
    </template>
    <template #default>
      <el-form label-width="auto" v-loading="detailLoading">
        <el-form-item label="上传者">
          <el-text type="info">{{ imgDetail.nickname }}</el-text>
        </el-form-item>
        <el-form-item label="图片描述">
          <el-text type="info">{{ imgDetail.description }}</el-text>
        </el-form-item>
        <el-form-item label="我的评分" v-if="imgDetail['scored'] === 'Y'">
          <el-rate
              v-model="imgDetail['myScore']" allow-half disabled
              score-template="{value} 分"/>
        </el-form-item>
        <el-form-item label="为图片评分" v-else>
          <el-space>
            <el-rate
                v-model="imgDetailScore" allow-half :disabled="!token"
                :texts="['使', '就这', '假嗖嗖', '刑', '唯一真神']" show-text/>
            <el-button v-if="token" type="primary" @click="submitScore">提交评分</el-button>
          </el-space>
        </el-form-item>
      </el-form>
      <el-text size="large" type="info" style="margin-bottom: 24px;">评论区</el-text>
      <br>
      <div>
        <div v-for="item in commentList" style="margin-top: 8px;margin-bottom: 8px;">
          <el-space direction="horizontal">
            <el-avatar :src="item['avatar']" />
            <el-text>{{ item.nickname }}</el-text>
          </el-space>
          <br />
          <el-space wrap direction="horizontal" >
            <el-link type="primary" v-if="item['reply']">@{{ item["replyNickname"] }}</el-link>
            <el-text size="large">{{ item["comment"] }}</el-text>
          </el-space>
        </div>
      </div>
    </template>
    <template #footer>
      <el-space>
        <el-input :rows="1" type="textarea" maxlength="500" v-if="token"
                  placeholder="输入评论内容" v-model="comment" show-word-limit/>
        <el-button v-if="token" type="primary" @click="submitComment">发送评论</el-button>
      </el-space>
    </template>
  </el-drawer>
  <el-dialog v-model="showRandom">
    <template #header>
      <span>{{ randomPic["name"] }}</span>
    </template>
    <template #default>
      <el-space direction="vertical">
        <el-text>{{ randomPic["description"] }}</el-text>
        <el-image :src="randomPic['url']" :preview-src-list="[randomPic['url'],randomPic['url'],]" >
          <template #error>
            <el-empty title="图片加载失败" />
          </template>
        </el-image>
      </el-space>
    </template>
    <template #footer>
      <el-button
          type="primary"
          @click="randomDetail">查看详情</el-button>
      <el-button @click="showRandom = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.main {
  padding-left: 16px;
  padding-right: 16px;
}
.center {
  text-align: center;
}
.typing {
  margin-left: calc(50vw - 150px);
  font-size: 40px;
  height: 64px;
}
.buttons {
  text-align: center;
}
.img-card {
  margin-bottom: 8px;
}
.item-img {
  width: 20vw;
  height: 21vw;
}
.el-pagination {
  margin-top: 16px;
  margin-bottom: 32px;
  margin-left: 16px;
}
.search {
  margin-top: 10px;
  padding-left: 16px;
  padding-right: 16px;
}
</style>