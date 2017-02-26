//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()

Page({
    data: {
        club: {}
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        this.getDataReady(options)
    },
    join:function(){
        var that = this
        var user_id = wx.getStorageSync('user_id')
        var club_id = this.data.club.club_id
        var url = app.globalData.domain + 'api/club/join'
        var parameters = {
            'club_id': club_id,
            'user_id':user_id
        }
        util.http(url, 'POST', function (data) {
            console.log(data)
            if (data.errcode == 0) {
                wx.switchTab({
                  url: '../../index/index'
                })
            } else {
                console.log(data)
            }
        }, parameters)
    },
    getDataReady: function (options) {
        // 生命周期函数--监听页面加载
        var that = this
        var url = app.globalData.domain + "api/club/info"
        var club_id = options.club_id
        var parameters = {
            'club_id': club_id,
        }
        util.http(url, 'GET', function (data) {
            console.log(data)
            if (data.errcode == 0) {
                that.setData({
                    club: data.data
                })
            } else {
                console.log(data)
            }
        }, parameters)
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

        console.log('onPullDownRefresh')
        wx.stopPullDownRefresh()
    }
})