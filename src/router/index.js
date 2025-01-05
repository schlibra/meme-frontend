import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from "@/views/Account/LoginView.vue";
import RegisterView from '@/views/Account/RegisterView.vue';
import ForgetView from '@/views/Account/ForgetView.vue';
import UserBasic from "@/views/User/UserBasic.vue";
import UserPermission from "@/views/User/UserPermission.vue";
import UserSecurity from "@/views/User/UserSecurity.vue";
import AboutView from "@/views/AboutView.vue";
import UserPicture from "@/views/User/UserPicture.vue";
import UserScore from "@/views/User/UserScore.vue";
import AdminBasic from "@/views/Admin/AdminBasic.vue";
import UserComment from "@/views/User/UserComment.vue";
import AdminSecurity from "@/views/Admin/AdminSecurity.vue";
import AdminGroup from "@/views/Admin/AdminGroup.vue";
import AdminUser from "@/views/Admin/AdminUser.vue"
import AdminThirdParty from "@/views/Admin/AdminThirdParty.vue";
import AdminBackup from "@/views/Admin/AdminBackup.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import CallbackView from "@/views/Account/CallbackView.vue";
import UserBind from "@/views/User/UserBind.vue";
import AdminPicture from "@/views/Admin/AdminPicture.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: ["IURT memes 2.0", "Home Title"][0] }
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { title: "登录账号" }
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { title: "注册账号" }
    },
    {
      path: "/forget",
      name: "forget",
      component: ForgetView,
      meta: { title: "忘记密码" }
    },
    {
      path: "/user",
      redirect: "/user/basic"
    },
    {
      path: "/user/basic",
      name: "userBasic",
      component: UserBasic,
      meta: { title: "用户中心 - 基本设置" }
    },
    {
      path: "/user/security",
      name: "userSecurity",
      component: UserSecurity,
      meta: { title: "用户中心 - 安全设置" }
    },
    {
      path: "/user/permission",
      name: "userPermission",
      component: UserPermission,
      meta: { title: "用户中心 - 用户权限" }
    },
    {
      path: "/user/picture",
      name: "userPicture",
      component: UserPicture,
      meta: { title: "用户中心 - 图片列表" }
    },
    {
      path: "/user/score",
      name: "userScore",
      component: UserScore,
      meta: { title: "用户中心 - 评分列表" }
    },
    {
      path: "/user/comment",
      name: "userComment",
      component: UserComment,
      meta: { title: "用户中心 - 评论列表" }
    },
    {
      path: "/user/bind",
      name: "userBind",
      component: UserBind,
      meta: { title: "用户中心 - 账号绑定" }
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: { title: "关于页面" }
    },
    {
      path: "/admin",
      redirect: "/admin/basic"
    },
    {
      path: "/admin/basic",
      name: "adminBasic",
      component: AdminBasic,
      meta: { title: "后台管理中心 - 基本设置" }
    },
    {
      path: "/admin/security",
      name: "adminSecurity",
      component: AdminSecurity,
      meta: { title: "后台管理中心 - 安全设置" }
    },
    {
      path: "/admin/group",
      name: "adminGroup",
      component: AdminGroup,
      meta: { title: "后台管理中心 - 用户组管理" }
    },
    {
      path: "/admin/user",
      name: "adminUser",
      component: AdminUser,
      meta: { title: "后台管理中心 - 用户管理" }
    },
    {
      path: "/admin/picture",
      name: "adminPicture",
      component: AdminPicture,
      meta: { title: "后台管理中心 - 图片管理" }
    },
    {
      path: "/admin/thirdParty",
      name: "adminThirdParty",
      component: AdminThirdParty,
      meta: { title: "后台管理中心 - 第三方平台" }
    },
    {
      path: "/admin/backup",
      name: "adminBackup",
      component: AdminBackup,
      meta: { title: "后台管理中心 - 备份与恢复" }
    },
    {
      path: "/api/login/callback/sckur",
      name: "sckurCallback",
      component: CallbackView,
      meta: { title: "登录回调" }
    },
    {
      path: "/api/login/callback/gitee",
      name: "giteeCallback",
      component: CallbackView,
      meta: { title: "登录回调" }
    },
    {
      path: "/api/login/callback/github",
      name: "githubCallback",
      component: CallbackView,
      meta: { title: "登录回调" }
    },
    {
      path: "/api/login/callback/gitlab",
      name: "gitlabCallback",
      component: CallbackView,
      meta: { title: "登录回调" }
    },
    {
      path: "/api/login/callback/microsoft",
      name: "microsoftCallback",
      component: CallbackView,
      meta: { title: "登录回调" }
    },
    {
      path: "/404",
      name: "404 Not Found",
      component: NotFoundPage,
      meta: { title: "找不到页面" }
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404"
    }
  ]
})
router.beforeEach((to, from, next) => {
  document.title = to.meta["title"]
  next()
})
export default router
