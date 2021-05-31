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
    isPublish : true,
    publish_array : [],
    info_array_collections: [],
    // show: 'published',
  },

  //根据条件获取用户所有赞过的表单
  getList:function(){
    let that=this;
    // console.log("app token")
    // console.log(app.globalData.token);
    request({
      url: 'https://www.dontstayup.com:8089/user/getAllCollections',
      method:"POST",
      data: {

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token':app.globalData.token
      },
    }).then(res=>{
      // console.log("getAllCollections res:");
      // console.log(res);
      // console.log("array=")
      // console.log(res.data.data);
      that.setData({  //不要提前在data里预设info_array,渲染可能不会等请求就渲染了空
        info_array_collections:res.data.data
      })
    })
  },

  // 获取用户的个人发布的表单
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
      // console.log("publish array=")
      // console.log(res.data.data);
      that.setData({//个人发布列表的数据
        publish_array:res.data.data,
      })
    })
  },

   //根据条件获取用户的个人信息
   getLikeInfo:function(){
    let that=this;
    request({
      url: 'https://www.dontstayup.com:8089/user/getUserInfo',
      method:"GET",
      data: {

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token':app.globalData.token
      },
    }).then(res=>{
      // console.log("点赞信息:");
      // console.log(res);
      // console.log("array=")
      // console.log(res.data.data);
      that.setData({  //不要提前在data里预设info_array,渲染可能不会等请求就渲染了空
        praiseNum : res.data.data.praiseNum,
        focusNum : res.data.data.focusNum
      })
    })
  },


  clickTab(e) { //选择
    let that = this;
    console.log(e)
    let id = e.currentTarget.id;
    if(id=="1"){  //使用setData才会重新渲染页面
      that.setData({
        isPublish:false,
        // colorLike : rgb(132,12,83),
        // colorPublish : rgb(255, 68, 161),
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getList();
    that.getPubulish();
    that.getLikeInfo();
    that.setData({
      name : app.globalData.userInfo.nickName,
      avator : app.globalData.userInfo.avatarUrl,
    })
    if(options.isPublish === 'true'){
      that.setData({
        isPublish : true
      })
    }
    else if(options.isPublish === 'false'){
      that.setData({
        isPublish : false
      })
    }
    console.log("传过来的状态"+options.isPublish)
  },

  preview: function (e) {
    let that = this;
    console.log(e)
    let currentUrl = e.currentTarget.dataset.src
    if(currentUrl==null){
      toastException("你要看的图片裂开了")
      return;
    }
    let imgList = [currentUrl]; //接口他需要提供一个存图片的数组,我们没有,直接造假一个
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  tapLike_collection: function (e) {
    console.log(e)
    let that = this;
    request({
      url: 'https://www.dontstayup.com:8089/collection/love',
      method: "POST",
      data: {
        collectionId: e.currentTarget.id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
    }).then(res => {
      console.log(res);
      if (res.data.resultCode === 400) {
        toastException(res.data.message);
      } else if (res.data.resultCode === 200) {
        toastSuccess(res.data.message);
        that.getList(); //刷新列表
        that.getPubulish();
        that.getLikeInfo();
      }
    });
  },

  
  onReachBottom: function () {
    let that = this;
    that.getLikeInfo();
    that.getList();
    that.getPubulish();
  },



})