import { defineStore } from "pinia";
import { ref } from 'vue'
import {Get, Post} from "@/lib/axiosLib.js";
import {UserUrl} from "@/api/url.js";
import {alertError, axiosError} from "@/lib/requestAlert.js";
import router from "@/router/index.js";
import confirm from "@/lib/confirmLib.js";
import {useLoadingStore} from "@/stores/LoadingStore.js";
import {removeToken} from "@/lib/tokenLib.js";

export const useUserStore = defineStore('user', () => {
    const loadingStore = useLoadingStore()
    const emptyUser = {
        admin: "",
        avatar: "",
        birth: "",
        create: "",
        default: "",
        deleteComment: "",
        deletePic: "",
        deleteScore: "",
        description: "",
        email: "",
        giteeAvatar: "",
        giteeBind: "",
        giteeNickname: "",
        giteeUsername: "",
        githubAvatar: "",
        githubBind: "",
        githubNickname: "",
        githubUsername: "",
        gitlabAvatar: "",
        gitlabBind: "",
        gitlabNickname: "",
        gitlabUsername: "",
        groupId: "",
        groupName: "",
        microsoftAvatar: "",
        microsoftBind: "",
        microsoftNickname: "",
        microsoftUsername: "",
        nickname: "",
        restoreComment: "",
        restorePic: "",
        restoreScore: "",
        sckurAvatar: "",
        sckurBind: "",
        sckurNickname: "",
        sckurUsername: "",
        sendComment: "",
        sendScore: "",
        sex: "",
        update: "",
        updateComment: "",
        updatePic: "",
        updateScore: "",
        uploadPic: "",
        userId: "",
        username: "",
        verified: "",
    };
    const user = ref({
        admin: "",
        avatar: "",
        birth: "",
        create: "",
        default: "",
        deleteComment: "",
        deletePic: "",
        deleteScore: "",
        description: "",
        email: "",
        giteeAvatar: "",
        giteeBind: "",
        giteeNickname: "",
        giteeUsername: "",
        githubAvatar: "",
        githubBind: "",
        githubNickname: "",
        githubUsername: "",
        gitlabAvatar: "",
        gitlabBind: "",
        gitlabNickname: "",
        gitlabUsername: "",
        groupId: "",
        groupName: "",
        microsoftAvatar: "",
        microsoftBind: "",
        microsoftNickname: "",
        microsoftUsername: "",
        nickname: "",
        restoreComment: "",
        restorePic: "",
        restoreScore: "",
        sckurAvatar: "",
        sckurBind: "",
        sckurNickname: "",
        sckurUsername: "",
        sendComment: "",
        sendScore: "",
        sex: "",
        update: "",
        updateComment: "",
        updatePic: "",
        updateScore: "",
        uploadPic: "",
        userId: "",
        username: "",
        verified: "",
    });
    const token = ref(localStorage.getItem("token"))

    const gotoLogin = async () => {
        await router.push("/login")
    }
    const reload = async () => {
        location.reload()
    }

    return {
        user,

        async getInfo(showBad = true) {
            await Get(UserUrl.infoUrl, {}, {
                ok(_, data) {
                    user.value = data
                },
                bad(res) {
                    if (showBad) alertError(res, "用户信息获取失败", gotoLogin)
                },
                error(err) {
                    axiosError(err, "用户信息获取失败", reload)
                }
            })
        },
        logout() {
            confirm("是否退出当前账号", "退出账号", {
                confirm() {
                    loadingStore.mainLoading = true
                    Post(UserUrl.logoutUrl, {}, {
                        final() {
                            loadingStore.mainLoading = false
                            token.value = ""
                            removeToken()
                            user.value = emptyUser
                            confirm("已退出登录，是否前往登录页面", "前往登录", {
                                confirm() {
                                    gotoLogin().then(r => r)
                                },
                                cancel: reload,
                                close: reload
                            })
                        }
                    })
                }
            })
        },
    }
})