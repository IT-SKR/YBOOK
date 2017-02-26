//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    club: {},
    club_id: 0,
    imgURL: ''
  },
  onLoad: function (options) {

    // 生命周期函数--监听页面加载
    var urlParams = '?width=300&scene=club&id=' + options.club_id
    this.setData({
      club_id: options.club_id,
      imgURL: app.globalData.domain + "book/swx/qrcode" + urlParams
    })
    this.getDataReady(options)
  },
  getDataReady: function (options) {
    var that = this
    var url = app.globalData.domain + "api/bookClub/qrcode"
    var club_id = options.club_id
    var parameters = {
      'club_id': club_id,
    }
    util.http(url, 'GET', function (data) {
      console.log(data)
      if (data.errcode == 0) {
        that.setData({
          club: data.data,
        })
      } else {
        console.log(data)
      }
    }, parameters)
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    var club_id = this.data.club_id
    return {
      title: '加入读书的小团体', // 分享标题
      desc: '分享读书资源', // 分享描述
      path: '../club/join/join?club_id=' + club_id // 分享路径
    }
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

    console.log('onPullDownRefresh')
    wx.stopPullDownRefresh()
  }
})