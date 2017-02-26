//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    discover: {},
    user_name: '',
    user_avatar: '',
    user_id:0
  },

  onLoad: function () {
    // 生命周期函数--监听页面加载
    this.getDataReady();
  },
  toBookDetail: function (event) {
    wx.navigateTo({
      url: event.target.dataset.reurl
    })
  },
  getDataReady: function () {
    // 生命周期函数--监听页面加载
    var that = this
    var url = app.globalData.domain + "api/discover"
    var user_id = wx.getStorageSync('user_id')
    var user_name = wx.getStorageSync('user_name')
    var user_avatar = wx.getStorageSync('user_avatar')
    var parameters = {
      'user_id': user_id,
    }
    util.http(url, 'GET', function (data) {
      console.log(data)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      if (data.errcode == 0) {
        that.setData({
          discover: data.data,
          user_name: user_name,
          user_avatar: user_avatar,
          user_id:user_id
        })
      } else {
        console.log(data)
      }
    }, parameters)
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
    wx.showNavigationBarLoading()
    console.log('onPullDownRefresh')
    this.getDataReady()
  },
  onShow: function () {
    console.log('onShow')
  }
})