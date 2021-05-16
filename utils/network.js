module.exports = {
  request:request,
}

function request(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  })
}