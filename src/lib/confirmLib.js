import {ElMessageBox} from "element-plus";
import l from "@/lib/languageLib.js";

function confirm(message, title, action={confirm: _=>_, cancel: _=>_, close: _=>_}) {
    ElMessageBox.confirm(message, title, {
        type: "info",
        confirmButtonText: l("common.confirm"),
        cancelButtonText: l("common.cancel")
    }).then(_action => {
        console.log(_action)
        if (_action === "confirm" && action.confirm) action.confirm()
        if (_action === "cancel" && action.cancel) action.cancel()
        if (_action === "close" && action.close) action.close()
    }).catch(_action => {
        if (_action === "cancel" && action.cancel) action.cancel()
        if (_action === "close" && action.close) action.close()
    })
}

export default confirm