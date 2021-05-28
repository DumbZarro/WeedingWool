// pages/takeaway/takeaway.js
const app = getApp()
import {
  request
} from "../../utils/network.js"
import {
  toastSuccess,
  toastException
} from "../../utils/show.js"
Page({
  data: {
    isRobot:false,
    mode:1,
    hot_check:true,
    pageNum:1,
    // info_array:null,
    activedIndex:0,
    sliderOffset:0,
    showComment:false,
    modeselect:false,
  },
  onLoad: function (options) {
    let that = this;
    that.getList();
    that.opendComment();
  },
  //根据条件获取许多的薅羊毛表单
  getList:function(){
    let that=this;
    // console.log("app token")
    // console.log(app.globalData.token);
    console.log(that.data.isRobot);
    request({
      url: 'https://www.dontstayup.com:8089/collection/getAllCollections',
      method:"GET",
      data: {
        isRobot: that.data.isRobot,
        mode:that.data.mode,
        pageNum:that.data.pageNum,
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
        info_array:res.data.data
      })
    })
  },
  clickTab(e) { //选择用户/机器人 事件
    let that = this;
    console.log(e)
    let id = e.currentTarget.id;
    if(id=="1"){  //使用setData才会重新渲染页面
      that.setData({
        isRobot:false
      })
      // that.data.isRobot=false;
    }else{
      that.setData({
        isRobot:true
      })
      // that.data.isRobot=true;
    }
    console.log(that.data.isRobot)
    that.setData({
      activedIndex: e.currentTarget.id,
      sliderOffset: e.currentTarget.offsetLeft
    })
    
    // 触发父组件的tab-change方法，并将当前选中的tab作为参数传递给父组件
    that.triggerEvent('tab-change', { activedTab: e.currentTarget.id })
  },
  // 点击评论按钮事件
  opendComment:function(e){
    let that=this;
    // console.log(e)
    // console.log(e.currentTarget.id)
    // let collectionId=e.currentTarget.id;
    wx.hideTabBar({})
    // that.getComments(collectionId)
    that.getComments(1)
    that.setData({
      showComment:true
    })  
  },
  // 获取一个发布信息的所有评论
  getComments:function(collectionId){
    let that=this;
    request({
      url: 'https://www.dontstayup.com:8089/comment/getComment',
      method:"GET",
      data: {
        collectionId: collectionId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token':app.globalData.token
      },
    }).then(res=>{
      // console.log("getComment res:");
      // console.log(res);
      console.log("comment array=")
      console.log(res.data.data);
      that.setData({//评论列表的数据
        comment_array:res.data.data
      })
    })
  },
  closeComment:function(){
    let that = this;
    that.setData({
      showComment:false
    })
    wx.showTabBar({})
  },
  selectMode:function(){
    let that =this;
    that.setData({
      modeselect:!that.data.modeselect
    })
    console.log(that.data.modeselect)
  },
  checkboxChange:function(e){
    let that = this;
    console.log(e)
    console.log(e.detail.value[0])
    let value = e.detail.value[0];
    if(value=="1"){//这时候选的就是第二个选项(时间)
      that.setData({//不知道为啥反了,接受的还是数组,反正现在能跑就不管了
        hot_check:false,
        mode:1, //mode 1 是 时间
        modeselect:false,
      })
    }else{
      that.setData({
        hot_check:true,
        mode:2,
        modeselect:false,
      })
    }
    that.getList();
  },
  expendComment:function(e){
    console.log(e)
  }
  
})