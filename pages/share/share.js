//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        motto: '拥有自己的读书圈子',
        userInfo: {},
        target_user_id: ''
    },
    onLoad: function (options) {
        wx.showNavigationBarLoading()
        this.getDataReady(options)
    },
    getDataReady: function (options) {
        var that = this   
        if (typeof (options.user_id) == "undefined") {
            var dataobj = {
                'user_name': wx.getStorageSync('user_name'),
                'user_avatar': wx.getStorageSync('user_avatar')
            }
            that.setData({
                userInfo: dataobj
            })
            wx.hideNavigationBarLoading()
        } else {
            //如果传递了user_id，则获取user的资料
            var target_user_id = options.user_id
            if (target_user_id == wx.getStorageSync('user_id')) {
                var dataobj = {
                    'user_name': wx.getStorageSync('user_name'),
                    'user_avatar': wx.getStorageSync('user_avatar')
                }
                that.setData({
                    userInfo: dataobj
                })
                wx.hideNavigationBarLoading()

            } else {

                var url = app.globalData.domain + 'api/user/info'
                var parameters = {
                    'user_id': target_user_id
                }
                util.http(url, 'GET', function (data) {
                    console.log(data)
                    if (data.errcode == 0) {
                        if (data.data === null) {
                            wx.showModal({
                                title: '发生了异常',
                                content: '我们会扣程序猿工资的，息怒' + target_user_id,
                                success: function (res) {
                                    wx.navigateTo({
                                        url: '../index/index'
                                    })
                                }
                            })
                            return null
                        }
                        var user_info = {
                            'user_name': data.data.name,
                            'user_avatar': data.data.avatar
                        }
                        that.setData({
                            userInfo: user_info,
                            target_user_id: target_user_id
                        })
                        wx.hideNavigationBarLoading()
                    } else {
                        wx.showModal({
                            title: '发生了异常',
                            content: '我们会扣程序猿工资的，息怒' + target_user_id,
                            success: function (res) {
                                wx.navigateTo({
                                    url: '../index/index'
                                })
                            }
                        })
                    }
                }, parameters)
            }

        }
    },

    onShareAppMessage: function () {
        var user_id = wx.getStorageSync('user_id')
        return {
            title: '与我一起读书吧',
            desc: 'YBook，好用的书本管理工具。扫码追踪书籍状态，好友和团体的书一目了然',
            path: '/pages/share/share?user_id=' + user_id
        }
    },

    orderYou: function () {
        var id = this.data.target_user_id
        var my_id = wx.getStorageSync('user_id')
        var url = app.globalData.domain + 'api/user/order'
        var parameters = {
            'id': id,
            'my_id': my_id
        }
        util.http(url, 'POST', function (data) {
            console.log(data)
            wx.switchTab({
                url: '../index/index',
            })
        }, parameters)
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

        console.log('onPullDownRefresh')
        wx.stopPullDownRefresh()
    }
})
