module.exports = {
  request:request,
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