import axios from "axios";
import {axiosOk} from "@/lib/requestAlert.js";
function Get(url, params={}, action={ok: (_, __)=>_, bad: _=>_, error: _=>_, final:_=>_}) {
    let paramList = [];
    let config = {};
    let token = getToken()
    if (token) {
        config["headers"] = {
            Authorization: `Bearer ${token}`
        }
    }
    Object.keys(params).forEach(key=>{
        let value = params[key]
        paramList.push(`${key}=${value}`)
    })
    axios.get(url + "?" + paramList.join("&"), config).then(res=>{
        if (axiosOk(res)) {
            if (action.ok) action.ok(res, res.data.data)
        } else {
            if (action.bad) action.bad(res)
        }
    }).catch(err=>{
        if (action.error) action.error(err)
    }).finally(()=> {
        if (action.final) action.final()
    })
}
function Delete(url, params={}, action={ok: _=>_, bad: _=>_, error: _=>_, final:_=>_}) {
    let paramList = [];
    let config = {};
    let token = getToken()
    if (token) {
        config["headers"] = {
            Authorization: `Bearer ${token}`
        }
    }
    console.log(config)
    Object.keys(params).forEach(key=>{
        let value = params[key]
        paramList.push(`${key}=${value}`)
    })
    axios.delete(url + "?" + paramList.join("&"), config).then(res=>{
        if (axiosOk(res)) {
            if (action.ok) action.ok(res, res.data.data)
        } else {
            if (action.bad) action.bad(res)
        }
    }).catch(err=>{
        if (action.error) action.error(err)
    }).finally(()=>{
        if (action.final) action.final()
    })
}
function Patch(url, params={}, action={ok: _=>_, bad: _=>_, error: _=>_, final:_=>_}) {
    let config = {};
    let token = getToken()
    if (token) {
        config["headers"] = {
            Authorization: `Bearer ${token}`
        }
    }
    axios.patch(url, params, config).then(res=>{
        if (axiosOk(res)) {
            if (action.ok) action.ok(res, res.data.data)
        } else {
            if (action.bad)action.bad(res)
        }
    }).catch(err=>{
        if (action.error) action.error(err)
    }).finally(()=>{
        if (action.final) action.final()
    })
}
function Post(url, params, action={ok:_=>_,bad:_=>_,error:_=>_,final:_=>_}, type= "") {
    let headers = {};
    let token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`
    if (type) headers["Content-Type"] = type
    axios.post(url, params, {headers}).then(res=>{
        if (axiosOk(res)) {
            if (action.ok) action.ok(res, res.data.data)
        } else {
            if (action.bad)action.bad(res)
        }
    }).catch(err=>{
        if (action.error) action.error(err)
    }).finally(()=>{
        if (action.final) action.final()
    })
}
function Put(url, params, action={ok:_=>_,bad:_=>_,error:_=>_,final:_=>_}) {
    let config = {};
    let token = getToken();
    if (token) {
        config["headers"] = {
            Authorization: `Bearer ${token}`
        }
    }
    axios.put(url, params, config).then(res=>{
        if (axiosOk(res)) {
            if (action.ok) action.ok(res, res.data.data)
        } else {
            if (action.bad)action.bad(res)
        }
    }).catch(err=>{
        if (action.error) action.error(err)
    }).finally(()=>{
        if (action.final) action.final()
    })
}

export { Get, Delete, Patch, Post, Put }