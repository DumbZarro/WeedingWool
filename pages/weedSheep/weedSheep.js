// pages/takeaway/takeaway.js
const app = getApp()
import {
  request,
  throttle
} from "../../utils/network.js"
import {
  toastSuccess,
  toastException
} from "../../utils/show.js"
Page({
  data: {
    isRobot: false,
    mode: 1,
    hot_check: true,
    pageNum: 1,
    // info_array:null,
    activedIndex: 0,
    sliderOffset: 0,
    showComment: false,
    modeselect: false,
    feedbackSelect: null,
    isDisabled: false,
    addtext: "",
    show: {},
    reply_array: {},
    triggered: true,
  },

  onLoad: function (options) {
    let that = this;
    that.getList();
  },
  onShow: function () {
    if (app.globalData.token == null) {
      wx.switchTab({
        url: '../my/my',
      });
      toastException("请先授权登陆")
    }
    let that = this;
    that.getList();
  },
  refresh: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    this.onLoad()
    this.setData({
      triggered: false
    })
    wx.hideLoading()
  },
  onReachBottom: function (e) {
    var that = this
    that.loadMore();
  },
  loadMore: function () {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1,
    })
    wx.showLoading({
      title: '加载中',
    })
    request({
      url: 'https://www.dontstayup.com:8089/collection/getAllCollections',
      method: "GET",
      data: {
        isSheep: true,
        isRobot: that.data.isRobot,
        mode: that.data.mode,
        pageNum: that.data.pageNum,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
    }).then(res => {
      console.log("getAllCollections res:");
      console.log(res);
      console.log("array=")
      console.log(res.data.data);
      let newArray = that.data.info_array.concat(res.data.data);
      console.log("new array=");
      console.log(newArray);
      that.setData({ //不要提前在data里预设info_array,渲染可能不会等请求就渲染了空
        info_array: newArray,
      })
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      toastException("你的网络好像不太给力")
    })
  },
  //根据条件获取许多的薅羊毛表单
  getList: function () {
    let that = this;
    // console.log("app token")
    // console.log(app.globalData.token);
    console.log(that.data.isRobot);
    request({
      url: 'https://www.dontstayup.com:8089/collection/getAllCollections',
      method: "GET",
      data: {
        isSheep: true,
        isRobot: that.data.isRobot,
        mode: that.data.mode,
        pageNum: 1,//获取列表永远获取第一页,追加页用另外请求,不调用此函数
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
    }).then(res => {
      console.log("getAllCollections res:");
      console.log(res);
      console.log("array=")
      console.log(res.data.data);
      that.setData({ //不要提前在data里预设info_array,渲染可能不会等请求就渲染了空
        info_array: res.data.data
      })
    }).catch(err => {
      console.log(err)
      toastException("你的网络好像不太给力")
    })
  },
  clickTab(e) { //选择用户/机器人 事件
    let that = this;
    console.log(e)
    let id = e.currentTarget.id;
    if (id == "1") {
      console.log("111")
      console.log(that.data.isRobot)
      that.setData({ //使用setData才会重新渲染页面
        isRobot: false
      })
      // that.data.isRobot=false; //不会重新渲染
      console.log(that.data.isRobot)
      that.getList();
    } else {
      that.setData({
        isRobot: true
      })
      that.getList();

      // that.data.isRobot=true;  //不会重新渲染
    }

    console.log(that.data.isRobot)
    // that.setData({
    //   activedIndex: e.currentTarget.id,
    //   sliderOffset: e.currentTarget.offsetLeft
    // })
    // // 触发父组件的tab-change方法，并将当前选中的tab作为参数传递给父组件
    // that.triggerEvent('tab-change', { activedTab: e.currentTarget.id })
  },
  selectMode: function () {
    let that = this;
    that.setData({
      modeselect: !that.data.modeselect
    })
    console.log(that.data.modeselect)
  },
  checkboxChange: function (e) {
    let that = this;
    console.log(e)
    console.log(e.detail.value[0])
    let value = e.detail.value[0];
    if (value == "1") { //这时候选的就是第二个选项(时间)
      that.setData({ //不知道为啥反了,接受的还是数组,反正现在能跑就不管了
        hot_check: false,
        mode: 1, //mode 1 是 时间
        modeselect: false,
      })
    } else {
      that.setData({
        hot_check: true,
        mode: 2,
        modeselect: false,
      })
    }
    that.getList(); //刷新列表
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
  // 点击评论按钮事件
  opendComment: function (e) {
    let that = this;
    // console.log(e)
    // console.log(e.currentTarget.id)
    that.setData({
      // collectionId:e.currentTarget.id
      collectionId: 1
    })
    wx.hideTabBar({})
    that.getComments(that.data.collectionId)
    that.setData({
      showComment: true
    })
  },
  // 获取一个发布信息的所有评论
  getComments: function () {
    let that = this;
    request({
      url: 'https://www.dontstayup.com:8089/comment/getComment',
      method: "GET",
      data: {
        collectionId: that.data.collectionId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
    }).then(res => {
      // console.log("getComment res:");
      // console.log(res);
      console.log("comment array=")
      console.log(res.data.data);
      that.setData({ //评论列表的数据
        comment_array: res.data.data,
        show: {} //声明show数组
      })
    })
  },
  closeComment: function () {
    let that = this;
    that.setData({
      showComment: false,
      collectionId: null,
    })
    wx.showTabBar({})
  },
  expendComment: function (e) {
    console.log(e)
    let that = this;
    let commentId = e.currentTarget.id;
    let show_temp = that.data.show;
    let reply_temp = that.data.reply_array;
    show_temp[commentId] = !show_temp[commentId];
    that.data.comment_array.forEach(element => {
      if (element.commentId == commentId) {
        reply_temp[commentId] = element.commentList;
      }
    });
    that.setData({
      show: show_temp,
      reply_array: reply_temp
    })
    // that.getComments()//刷新列表
    console.log(that.data.show);
    console.log(that.data.reply_array);
    // TODO 展开回复
  },
  onSubmitTap: throttle(function (e) {
    let that = this;
    console.log(e.detail.value.yourComment)
    if (e.detail.value.yourComment == "") {
      toastException("发送内容不能为空");
      return;
    }
    request({
      url: 'https://www.dontstayup.com:8089/comment/create',
      method: "POST",
      data: {
        collectionId: that.data.collectionId,
        commentParentId: that.getCommentParentId(),
        content: e.detail.value.yourComment,
        createTime: new Date(),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
    }).then(res => {
      console.log(res);
      if (res.data.resultCode === 400) {
        toastException(res.data.msg);
      } else if (res.data.resultCode === 200) {
        toastSuccess("发送成功");
        that.setData({
          isDisabled: true, //禁止点击发送
          addtext: "", //清空输入框
        });
        that.getComments() //刷新列表
        setTimeout(function () {
          that.setData({
            isDisabled: false,
          })
        }, 1000);
        // wx.hideKeyboard();
      }
    });
  }, 1000),
  getCommentParentId: function () {
    let that = this;
    let commentParentId = that.data.feedbackSelect;
    if (commentParentId == null) {
      return 0;
    } else {
      that.data.feedbackSelect = null; //要设置null防止多次评论串位
      return commentParentId;
    }
  },
  selectCommentToReply: function (e) {
    let that = this;
    console.log(e.currentTarget.id);
    that.data.feedbackSelect = e.currentTarget.id;
    console.log(that.data.feedbackSelect);
    // TODO 弹出键盘输入
  },
  tapLike_comment: function (e) {
    console.log(e)
    let that = this;
    request({
      url: 'https://www.dontstayup.com:8089/comment/love',
      method: "POST",
      data: {
        commentId: e.currentTarget.id,
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
        that.getComments() //刷新列表
      }
    });
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
      }
    });
  },
  tapShare: function (e) {
    console.log(e)
    let that = this;
    request({
      url: 'https://www.dontstayup.com:8089/collection/addShareNum',
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
      }
    });
  }
})