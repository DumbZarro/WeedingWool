module.exports = {
  request:request,
  throttle: throttle
}

function request(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  })
}

function throttle(fn, gapTime) { //节流阀 用于按键防抖
  if (gapTime == null || gapTime == undefined) {
      gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
      let _nowTime = + new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
          fn.apply(this, arguments)   //将this和传递给原函数
          _lastTime = _nowTime
      }
  }
}
