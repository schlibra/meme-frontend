import { useCookies } from "vue3-cookies";
const { cookies } = useCookies()
function setToken(token) {
    let _token = typeof token === "string" ? token : token.data.token
    localStorage.setItem("token", _token)
    cookies.set("token", _token)
}
function getToken() {
    return localStorage.getItem("token")
}
function removeToken() {
    localStorage.removeItem("token")
}
globalThis.getToken = getToken
export { setToken, getToken, removeToken }