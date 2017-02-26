//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    club_id: '',
    members: [],
    clubInfo: {}
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this
    var url = app.globalData.domain + "api/club/info"
    var club_id = options.club_id
    that.setData({
      club_id: club_id
    })
    var parameters = {
      'club_id': club_id,
    }
    util.http(url, 'GET', function (data) {
      console.log(data)
      if (data.errcode == 0) {
        that.setData({
          members: data.data.club_member,
          clubInfo: data.data
        })
      } else {
        console.log(data)
      }
    }, parameters)
  },
  quitclub: function () {
    var that = this
    var user_id = wx.getStorageSync('user_id')
    console.log('club_id:' + that.data.club_id)
    var url = app.globalData.domain + "api/bookClub/quit"
    var parameters = {
      'club_id': that.data.club_id,
      'user_id': user_id
    }
    util.http(url, 'POST', function (data) {
      console.log(data)
      if (data.errcode == 0) {
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onShow();
          }
        })
      } else {
        console.log(data)
      }
    }, parameters)
  },
  toClubQRCode: function () {
    wx.navigateTo({
      url: '../club-qrcode/club-qrcode?club_id=' + this.data.club_id
    })
  },
  toEdit: function () {
    wx.navigateTo({
      url: '../edit-club/edit-club?club_id=' + this.data.club_id
    })
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    var club_id = this.data.club_id
    return {
      title: '加入读书的小团体', // 分享标题
      desc: '分享读书资源', // 分享描述
      path: '/pages/club/join/join?club_id=' + club_id // 分享路径
    }
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

    console.log('onPullDownRefresh')
    wx.stopPullDownRefresh()
  }

})