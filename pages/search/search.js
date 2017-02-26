//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()

Page({
    data: {
        discover: {},
        //searchbar
        inputShowed: false,
        inputVal: ""
        //searchbarF
    },
         //searchbar
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    //searchbar
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
        var parameters = {
            'user_id': user_id,
        }
        util.http(url, 'GET', function (data) {
            console.log(data)
            if (data.errcode == 0) {
                that.setData({
                    discover: data.data,
                })
            } else {
                console.log(data)
            }
        }, parameters)
    },
    onShow: function () {
        console.log('onShow')
    }
})