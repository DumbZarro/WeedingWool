// pages/my/releaseAndLike/releaseAndLike.js
const app = getApp()
import {
  request
} from "../../../utils/network.js"
import {
  toastSuccess,
  toastException
} from "../../../utils/show.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPublish : false,
    publish_array : [],
    info_array_collections: [],
    show: 'published',
  },

  //根据条件获取用户所有收藏的表单
  getList:function(){
    let that=this;
    // console.log("app token")
    // console.log(app.globalData.token);
    request({
      url: 'https://www.dontstayup.com:8089/user/getAllCollections',
      method:"POST",
      data: {
        // isRobot: that.data.isRobot,
        // mode:that.data.mode,
        // pageNum:that.data.pageNum,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token':app.globalData.token
      },
    }).then(res=>{
      console.log("getAllCollections res:");
      console.log(res);
      console.log("array=")
      console.log(res.data.data);
      that.setData({  //不要提前在data里预设info_array,渲染可能不会等请求就渲染了空
      info_array_collections:res.data.data
      })
    })
  },

  // 获取用户所有个人发布的表单
  getPubulish:function(collectionId){
    let that=this;
    request({
      url: 'https://www.dontstayup.com:8089/user/getAllWorks',
      method:"POST",
      data: {
        // collectionId: collectionId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token':app.globalData.token
      },
    }).then(res=>{
      // console.log("getComment res:");
      // console.log(res);
      console.log("publish array=")
      console.log(res.data.data);
      that.setData({//个人发布列表的数据
        publish_array:res.data.data
      })
    })
  },

  clickTab(e) { //选择
    let that = this;
    console.log(e)
    let id = e.currentTarget.id;
    if(id=="1"){  //使用setData才会重新渲染页面
      that.setData({
        isPublish:false
      })
    }else{
      that.setData({
        isPublish:true
      })
    }
    console.log(that.data.isPublish)
    that.setData({
      activedIndex: e.currentTarget.id,
      sliderOffset: e.currentTarget.offsetLeft
    })
    
    // 触发父组件的tab-change方法，并将当前选中的tab作为参数传递给父组件
    that.triggerEvent('tab-change', { activedTab: e.currentTarget.id })
  },

  onLoad: function (options) {
    let that = this;
    that.getList();
    that.getPubulish();
    that.setData({
      focusNum : app.globalData.focusNum,
      praiseNum : app.globalData.praiseNum,
      name:app.globalData.userInfo.nickName,
      avator:app.globalData.avator,
    })
    // console.log(app.globalData.praiseNum)
    // console.log(app.globalData.userInfo.nickName)
  },
})