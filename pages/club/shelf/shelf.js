
//获取应用实例
var util = require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        clubBookShelf: [],
        club_id: 0,
        description:''
    },
    onLoad: function (options) {
        wx.showNavigationBarLoading()
        // 生命周期函数--监听页面加载
        var club_id = options.club_id
        this.getDataReady(club_id)
    },
    getDataReady: function (club_id) {
        var that = this
        var url = app.globalData.domain + 'api/bookClub/clubBookShelf'
        var parameters = {
            'club_id': club_id
        }
        util.http(url, 'GET', function (data) {
            wx.hideNavigationBarLoading()
            console.log(data)
            if (data.errcode == 0) {
                wx.setNavigationBarTitle({
                    title: data.data.club_name
                })
                that.setData({
                    clubBookShelf: data.data.club_book_shelf,
                    club_id: club_id,
                    description:data.data.description
                })
            } else {
                console.log(data)
            }
        }, parameters)
    },
    getDataFresh: function (club_id, club_book_shelf_id) {
        wx.showNavigationBarLoading()
        var that = this
        var url = app.globalData.domain + 'api/bookClub/clubBookShelf'
        var parameters = {
            'club_id': club_id,
            club_book_shelf_id: club_book_shelf_id
        }
        util.http(url, 'GET', function (data) {
            wx.hideNavigationBarLoading()
            console.log(data)
            if (data.errcode == 0) {

                that.setData({
                    clubBookShelf: that.data.clubBookShelf.concat(data.data.club_book_shelf),
                    club_id: club_id
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
            path: '/pages/club/join/join?club_id=' + club_id // 分享路径
        }
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数

        var that = this
        var club_id = that.data.club_id
        var club_book_shelf_id = that.data.clubBookShelf[that.data.clubBookShelf.length - 1].club_book_shelf_id
        that.getDataFresh(club_id, club_book_shelf_id)
        console.log('onReachBottom')
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

        console.log('onPullDownRefresh')
        wx.stopPullDownRefresh()
    }
});