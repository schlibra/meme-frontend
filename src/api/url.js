import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()
globalThis.cookie = cookies
const isDev = process.env.NODE_ENV === "development" && cookies.get("dev") !== "Y"
const baseUrl = isDev ? "http://127.0.0.1:8000" : location.origin

const apiUrl = baseUrl + "/api"
const userUrl = apiUrl + "/user"
const picsUrl = apiUrl + "/pics"
const adminUrl = apiUrl + "/admin"
const CaptchaUrl = apiUrl + "/captcha"

const CommonUrl = {
    languagesUrl: apiUrl + "/languages"
}

const UserUrl = {
    loginUrl: userUrl + "/login",
    registerUrl: userUrl + "/register",
    sendCodeUrl: userUrl + "/sendCode",
    forgetUrl: userUrl + "/forget",
    infoUrl: userUrl + "/info",
    verifyUrl: userUrl + "/verify",
    passwordUrl: userUrl + "/password",
    logoutUrl: userUrl + "/logout",
    picsUrl: userUrl + "/pic",
    scoreUrl: userUrl + "/score",
    commentUrl: userUrl + "/comment"
}

const PicsUrl = {
    picsUrl: picsUrl,
    picUrl: picsUrl + "/pic",
    scoreUrl: picsUrl + "/score",
    imageUrl: picsUrl + "/image",
    commentUrl: picsUrl + "/comment",
    randomUrl: picsUrl + "/random"
}

const AdminUrl = {
    groupUrl: adminUrl + "/group",
    userUrl: adminUrl + "/user",
    switchUser: adminUrl + "/switchUser",
    backupUrl: adminUrl + "/backup",
    pictureUrl: adminUrl + "/picture",
    basicUrl: adminUrl + "/basic",
    securityUrl: adminUrl + "/security",
    thirdPartyUrl: adminUrl + "/thirdParty",
}

const ThirdPartyUrl = {
    beforeUrl: apiUrl + "/login/before/",
    afterUrl: apiUrl + "/login/after/",
}

export { CommonUrl, UserUrl, PicsUrl, AdminUrl, CaptchaUrl, ThirdPartyUrl }