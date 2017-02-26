//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()

Page({
  data: {
    user: {}
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this
    var url = app.globalData.domain + "api/friends"
    var user_id = options.user_id
    var parameters = {
      'user_id': user_id,
    }
    util.http(url, 'GET', function (data) {
      console.log(data)
      if (data.errcode == 0) {
        that.setData({
          user: data.data,
        })
      } else {
        console.log(data)
      }
    }, parameters)
  },
  toShare: function () {
    var user_id = wx.getStorageSync('user_id')
    wx.navigateTo({
      url: '../../share/share'
    })
  },
  onShareAppMessage: function () {
    var user_id = wx.getStorageSync('user_id')
    return {
      title: '与我一起读书吧',
      desc: 'YBook，好用的书本管理工具。扫码追踪书籍状态，好友和团体的书一目了然',
      path: '/pages/share/share?user_id=' + user_id
    }
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

    console.log('onPullDownRefresh')
    wx.stopPullDownRefresh()
  }
})