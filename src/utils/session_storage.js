
//设置 window.sessionStorage.setItem
export function setSessionStorageItem(k,v){
    window.sessionStorage.setItem(k,v)
}

//获取 window.sessionStorage.getItem
export function getSessionStorageItem(k){
    return window.sessionStorage.getItem(k)
}

//清空 sessionStorage
export function clearSessionStorage(){
    window.sessionStorage.clear()
}