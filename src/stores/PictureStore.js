import { defineStore } from 'pinia'
import { ref } from 'vue'
import {Get} from "@/lib/axiosLib.js";
import {PicsUrl} from "@/api/url.js";
import {alertError, axiosError} from "@/lib/requestAlert.js";
import router from "@/router/index.js";

export const usePictureStore = defineStore('picture', () => {
    const picture = ref([{
        "picId": 0,
        "name": "0",
        "description": "",
        "userId": 0,
        "compressed": "",
        "compressType": "",
        "verified": "",
        "create": "",
        "update": "",
        "delete": null,
        "scored": "",
        "score": 0,
        "nickname": "",
        "url": ""
    }]);

    const gotoLogin = async () => router.push("/login")
    const reload = () => location.reload()

    return {
        picture,
        getPic() {
            Get(PicsUrl.picUrl, {}, {
                ok(_, data) {
                    picture.value = data
                },
                bad(res) {
                    alertError(res, "数据获取失败", gotoLogin)
                },
                error(err) {
                    axiosError(err, "数据获取失败", reload)
                }
            })
        },
    }
})