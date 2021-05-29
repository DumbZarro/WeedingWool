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
    token:null,
  },
  onLaunch() {
    let that=this;
    that.testToken();
  },
  testToken:function(){
    let that=this;
    wx.getStorage({
      key:"loginInfo",
      success:res=>{
        console.log(res);
        that.globalData.token=res.data.token;
        that.globalData.userInfo=res.data.userInfo;
        // TODO 测试Token是否过期
        
        
        
        
      },
      fail:err=>{
        console.log(err)
        that.noToken();
      }
    })
  },
  noToken:function(){
    wx.switchTab({
      url: './pages/my/my',
    });
    toastException("请先授权登陆")
  },
  haveToken:function(){
    toastException("登陆成功")
  }
})
