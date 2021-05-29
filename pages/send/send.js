// pages/send/send.js
import {
  request,
  throttle
} from "../../utils/network.js"
import {
  toastSuccess,
  toastException
} from "../../utils/show.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addtext: "",
    img: null,
    id: null,
    haveImg: false,
    isDisabled: false,
    typeIndex: 0, //用户选择type的索引,用于展示
    typeArray: ['未选择', '薅羊毛', '外卖推荐', ],
  },
  onLoad: function (options) {

  },
  onShow:function(){
    if(app.globalData.token==null){
      wx.switchTab({
        url: '../my/my',
      });
      toastException("请先授权登陆")
    }
  },
  bindPutImage: function (event) {
    console.log(event)
    let that = this;
    let num = event.currentTarget.dataset.index;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera', 'album'],
      success(res) {
        const tempFilePaths = res.tempFilePaths; //数组形式
        if (num == 0) {
          that.setData({
            img: tempFilePaths[0],
            haveImg: true
          });
        }
        toastSuccess("图片上传成功!");
      }
    })
  },
  send: throttle(function (e) {
    console.log(e)
    let that = this;
    let imgNum = 0;
    if (that.data.img != null) {
      imgNum = 1;
    }
    if (e.detail.value.content == null) {
      toastException("不能发布空的内容!")
      return;
    } else if (that.data.typeIndex == 0) {
      toastException("请先选择分类!");
      return;
    }
    that.setData({
      isDisabled: true
    })
    request({
      url: 'https://www.dontstayup.com:8089/collection/create',
      method: "POST",
      data: {
        content: e.detail.value.content,
        createTime: new Date(),
        pictureNum: imgNum,
        type: that.data.typeArray[that.data.typeIndex],
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
    }).then(res => {
      console.log(res)
      let cookie = res.header['Set-Cookie'];
      console.log(cookie);
      if (imgNum != 0) { // 有图片
        wx.uploadFile({
          url: 'https://www.dontstayup.com:8089/collection/upload',
          filePath: that.data.img,
          name: 'file',
          header: {
            'content-type': "multipart/form-data",
            'token': app.globalData.token,
            'cookie': cookie
          },
          success: function (res) {
            console.log(res);
            toastSuccess("发布成功!")
            that.setData({
              addtext: "", //清空输入框
              img: null, //清空图片
              typeIndex: 0, //清空分类
              haveImg:false,//切换图标
              isDisabled: false
            })
          },
          fail: function (err) {
            console.log(err);
            toastException("图片发布失败")
            that.setData({
              // addtext: "",//清空输入框
              // img:null,//清空图片
              // typeIndex:0,//清空分类
              isDisabled: false
            })
          }
        })
      } else { // 无图片
        toastSuccess("内容发布成功!")
        that.setData({
          addtext: "", //清空输入框
          img: null, //清空图片
          typeIndex: 0, //清空分类
          haveImg:false,//切换图标
          isDisabled: false
        })
      }
    }).catch(err => {
      toastException("发布失败,请重试");
      that.setData({
        // addtext: "",//清空输入框
        // img:null,//清空图片
        // typeIndex:0,//清空分类
        isDisabled: false
      })
    })
  }, 1000),

  bindPickerChange: function (e) {
    console.log(e)
    this.setData({
      typeIndex: e.detail.value
    });
  },

  // 表情系统
  clickEmoji: function(e) {
    const {
      detail: {
        value
      }
    } = e;
    this.setData({
      addtext: value
    })
  },
  onInputTextarea: function(e) {
    const {
      detail: {
        value
      }
    } = e;
    this.setData({
      addtext: value
    })
  }
})