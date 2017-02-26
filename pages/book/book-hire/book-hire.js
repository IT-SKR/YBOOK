//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()

Page({
  data:{
    book_hire:{}
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
        // 生命周期函数--监听页面加载
    var that = this
    var url = app.globalData.domain + "api/book/hire"
    var book_id = options.book_id
    var parameters = {
      'book_id': book_id,
    }
    util.http(url, 'GET', function (data) {
      console.log(data)
      if (data.errcode == 0) {
        that.setData({
          book_hire: data.data,
        })
      } else {
        console.log(data)
      }
    }, parameters)
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})