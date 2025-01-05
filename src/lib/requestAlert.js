import {ElMessageBox} from "element-plus";

function axiosOk(res) {
    return res.data.code === 200
}
function alertSuccess(res, title="操作成功", callback=_=>_) {
    let message = typeof res === "string" ? res : res.data["msg"]
    ElMessageBox.alert(message, title, {
        type: "success",
        customStyle: {
            "word-wrap": "break-word",
            "word-break": "break-word"
        }
    }).then(callback)
}
function alertError(res, title="操作失败", callback=_=>_) {
    let message = typeof res === "string" ? res : res.data["msg"]
    ElMessageBox.alert(message, title, {
        type: "error",
        customStyle: {
            "word-wrap": "break-word",
            "word-break": "break-word"
        }
    }).then(callback)
}
function axiosError(err, title="请求失败", callback=_=>_,_return=false) {
    console.log(err)
    let message;
    if (err.request.status > 0) {
        message = JSON.parse(err.request.responseText)["message"]
    } else {
        message = err.message
    }
    if (_return) return message
    ElMessageBox.alert(message, title, {
        type: "error",
        customStyle: {
            "word-wrap": "break-word",
            "word-break": "break-word"
        }
    }).then(callback)
}
export { axiosOk, alertSuccess, alertError, axiosError }