module.exports = {
  toastSuccess:toastSuccess,
  toastException:toastException,
}

function toastSuccess(title) {
  wx.showToast({
    title: title,
    duration: 1000
  })
}

function toastException(title) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 1000
  })
}