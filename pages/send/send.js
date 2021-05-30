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
    img: [null, null, null, null, null, null, null, null, null],
    haveImg: [false, false, false, false, false, false, false, false, false],
    imgNum: 0,
    isDisabled: false,
    typeIndex: 0, //用户选择type的索引,用于展示
    typeArray: ['未选择', '薅羊毛', '外卖推荐', ],
  },
  onLoad: function (options) {

  },
  onShow: function () {
    if (app.globalData.token == null) {
      wx.switchTab({
        url: '../my/my',
      });
      toastException("请先授权登陆")
    }
  },
  bindPutImage: function (e) {
    console.log(e)
    let that = this;
    let index = parseInt(e.currentTarget.dataset.index); //图片的索引,记得转数字!
    wx.chooseImage({
      count: 9 - that.data.imgNum, // 根据imgNum动态设置
      sizeType: ['original', 'compressed'],
      sourceType: ['camera', 'album'],
      success(res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths;
        let size = res.tempFilePaths.length;
        let newImg = that.data.img;
        let newHaveImg = that.data.haveImg;
        for (let i = 0; i < size; i++) { //更新图片列表
          newImg[index + i] = tempFilePaths[i];
          newHaveImg[index + i] = true;
        }
        console.log(newImg);
        console.log(newHaveImg);
        that.setData({
          img: newImg,
          // 在wxml的渲染规则下index一定等于imgNum+1
          // imgNum: index, //这样应该也行
          imgNum: that.data.imgNum + size,
          haveImg: newHaveImg,
        });
        toastSuccess("图片上传成功!");
      }
    })
  },
  //刷新图片只能选一张
  bindRefreshImage: function (e) {
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index; //图片的索引
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera', 'album'],
      success(res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths; //数组形式
        let newImg = that.data.img;
        newImg[index] = tempFilePaths[0]; //更新图片列表
        that.setData({
          img: newImg,
          imgNum: that.data.imgNum,
        });
        toastSuccess("图片上传成功!");
      }
    })
  },
  send: throttle(function (e) {
    console.log(e)
    let that = this;
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
        pictureNum: that.data.imgNum,
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
      if (that.data.imgNum != 0) { // 有图片
        for (let i = 0; i < that.data.imgNum; i++) {
          wx.uploadFile({
            url: 'https://www.dontstayup.com:8089/collection/upload',
            filePath: that.data.img[i],
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
                img: [null, null, null, null, null, null, null, null, null], //清空图片
                haveImg: [false, false, false, false, false, false, false, false, false], //切换图标
                imgNum: 0, //数量清零
                typeIndex: 0, //清空分类
                isDisabled: false,
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
        }
      } else { // 无图片
        toastSuccess("内容发布成功!")
        that.setData({
          addtext: "", //清空输入框
          img: [null, null, null, null, null, null, null, null, null], //清空图片
          haveImg: [false, false, false, false, false, false, false, false, false], //切换图标
          imgNum: 0, //数量清零
          typeIndex: 0, //清空分类
          isDisabled: false,
        })
      }
    }).catch(err => {
      console.log(err);
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
  clickEmoji: function (e) {
    const {
      detail: {
        value
      }
    } = e;
    this.setData({
      addtext: value
    })
  },
  onInputTextarea: function (e) {
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