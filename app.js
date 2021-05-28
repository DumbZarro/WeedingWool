import {
  request
} from "utils/network.js"
import {
  toastSuccess,
  toastException
} from "utils/show.js"

App({
  globalData: {
    code: null,
    openId: null,
    userInfo: null,
    isLogin: false,
    haveOpenId:false,
    token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMjQiLCJuYW1lIjoiRG5pbHMiLCJleHAiOjE2MjI3MDE5MDV9.UklileQdNKdDhOF4J9SXfxIk-113om9CSMFT1QCXH8c"
  },
  onLaunch() {
    
  }
})
