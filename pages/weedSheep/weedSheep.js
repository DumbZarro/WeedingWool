// pages/weedSheep/weedSheep.js
const app = getApp()
import {
  request
} from "../../utils/network.js"
import {
  toastSuccess,
  toastException
} from "../../utils/show.js"
Page({
  getUserProfile(e) {
    let that=this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo=res.userInfo
        console.log("app.globalData.userInfo=")
        console.log(app.globalData.userInfo)

        wx.login({
          success(res) {
            if (res.code) {
              request({
                url: 'https://www.dontstayup.com:8089/user/login',
                method:"POST",
                data: {
                  code: res.code,
                  name:app.globalData.userInfo.nickName,
                  avatar:app.globalData.userInfo.avatarUrl
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
              }).then(res=>{
                console.log("login res:");
                console.log(res);

                app.globalData.token=res.header.token
                console.log("app.globalData.token=")
                console.log(app.globalData.token)
                
              })
            }
          }
        })
      }
    }) 
  },
})
