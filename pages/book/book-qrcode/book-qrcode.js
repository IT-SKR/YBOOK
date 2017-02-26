//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    book: {},
    imgURL: ''
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this
    var url = app.globalData.domain + "api/book/qrcode"
    var book_id = options.book_id
    var urlParams = '?width=300&scene=' + options.scene + '&id=' + options.id

    // var urlParams = '?width=300&scene=' + options.scene + '&id=' +book_id

    var parameters = {
      'book_id': book_id,
    }
    util.http(url, 'GET', function (data) {
      console.log(data)
      if (data.errcode == 0) {
        that.setData({
          book: data.data,
          imgURL: app.globalData.domain + "book/swx/qrcode" + urlParams
        })
      } else {
        console.log(data)
      }
    }, parameters)
  },
  toPrint: function () {
    wx.showToast({
      title: '打印中',
      icon: 'loading',
      duration: 10000
    })

    var that = this
    var url = app.globalData.domain + "api/print/qrcode"
    var user_id = wx.getStorageSync('user_id');
    var pr = {
      'user_id': user_id,
      'qrcode_url': that.data.book.qrcodeURL
    }
    util.http(url, 'POST', function (data) {
      console.log(data)
      wx.hideToast()

      if (data.errcode == 40009) {
        wx.showToast({
          title: '需开通会员服务',
          icon: 'success',
          duration: 10000
        })
      }
      if (data.data.showapi_res_code == 1) {
        wx.showToast({
          title: '打印成功',
          icon: 'success',
          duration: 1000
        })
      }
      else {
        console.log(data)
      }
    }, pr)
  }
})