//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        motto: '拥有自己的读书圈子',
        userInfo: {}
    },
    //事件处理函数
    getReady: function () {
        console.log('welcome-getReady')
        var user_id = wx.getStorageSync('user_id') || null
        var token = wx.getStorageSync('token') || null
        if (user_id == null || token == null) {
            //登录过期
            wx.login({
                success: function (res) {
                    var code = res.code;
                    //需要去拿token信息，然后在这里进行缓存
                    //获取用户的信息，并且复制
                    wx.getUserInfo({
                        success: function (res) {
                            var encryptedData = res.encryptedData;
                            var iv = res.iv;
                            var url = app.globalData.domain + 'swx/login'
                            wx.request({
                                url: url,
                                method: 'POST',
                                header: {
                                    'content-type': 'application/json'
                                },
                                data: {
                                    code: code,
                                    iv: iv,
                                    encryptedData: encryptedData
                                },
                                fail: function (res) {
                                    console.log(res.data.data)
                                    wx.switchTab({
                                        url: '../index/index'
                                    })
                                },
                                success: function (res) {
                                    wx.hideNavigationBarLoading()
                                    wx.setStorageSync('token', res.data.data.token)
                                    wx.setStorageSync('user_id', res.data.data.user_id)
                                    wx.setStorageSync('user_name', res.data.data.user_name)
                                    wx.setStorageSync('user_avatar', res.data.data.user_avatar)
                                    wx.switchTab({
                                        url: '../index/index'
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            wx.switchTab({
                url: '../index/index'
            })
        }
    },
    onLoad: function () {

        wx.setNavigationBarTitle({
          title: '【YBook】扫码说明',
        })
        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
       
        setTimeout(function () {
             that.getReady()
        }, 3000)
    },
    onShow: function () {
        console.log('welcome,onshow')
        // setTimeout(function () {
        //     wx.switchTab({
        //         url: '../index/index'
        //     })
        // }, 3000)
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

        console.log('onPullDownRefresh')
        wx.stopPullDownRefresh()
    }
})

