//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    user: {}
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    wx.showNavigationBarLoading()
    var user_id = options.user_id
    this.getDataReady(user_id)

  },
  getDataReady: function (user_id) {
    var that = this
    var url = app.globalData.domain + "api/user/center"
    var user_id = user_id
    var parameters = {
      'user_id': user_id,
    }
    util.http(url, 'GET', function (data) {
      console.log(data)
      wx.hideNavigationBarLoading()
      if (data.errcode == 0) {
        that.setData({
          user: data.data,
        })
      } else {
        console.log(data)
      }
    }, parameters)
  },
  getDataFresh: function (user_id, book_shelf_id) {
    wx.showNavigationBarLoading()
    var that = this
    var url = app.globalData.domain + "api/user/center"
    var user_id = user_id
    var parameters = {
      'user_id': user_id,
      book_shelf_id:book_shelf_id
    }
    util.http(url, 'GET', function (data) {
      console.log(data)
      wx.hideNavigationBarLoading()
      if (data.errcode == 0) {
        var user = that.data.user
         user.book_shelf = that.data.user.book_shelf.concat(data.data.book_shelf)
        that.setData({
          user: user,
        })
      } else {
        console.log(data)
      }
    }, parameters)
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    var that = this
    return {
      title: that.data.user.name + '的书架', // 分享标题
      desc: '【YBook】共享图书资源', // 分享描述
      path: '/pages/user/shelf/shelf?user_id=' + that.data.user.id // 分享路径
    }
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

    var that = this
    var user_id = that.data.user.id
    var book_shelf_id = that.data.user.book_shelf[that.data.user.book_shelf.length - 1].book_shelf_id
    console.log('user_id：'+user_id+'---book_shelf_id:'+book_shelf_id)
    that.getDataFresh(user_id, book_shelf_id)
    console.log('onReachBottom')
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
    console.log('onPullDownRefresh')
    wx.stopPullDownRefresh()
  }
})