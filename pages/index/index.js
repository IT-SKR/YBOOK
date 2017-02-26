//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        motto: '与之读书',
        userInfo: {},
        bookshelf: [],
        user_relationship: [],
        club_member: [],
        user_id: 0,
        //searchbar
        inputShowed: false,
        inputVal: ""
        //searchbar
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
    openConfirm: function (res) {
        wx.showModal({
            title: '弹窗标题',
            content: res,
            confirmText: "主操作",
            cancelText: "辅助操作",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    console.log('用户点击主操作')
                } else {
                    console.log('用户点击辅助操作')
                }
            }
        });
    },
    open: function () {
        var that = this
        wx.showActionSheet({
            itemList: ['扫本码', '邀请朋友使用', '创建小团体'],
            success: function (res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        wx.scanCode({
                            success: (rs) => {
                                console.log(rs)
                                wx.showToast({
                                    title: '数据加载中',
                                    icon: 'loading',
                                    duration: 10000
                                });
                                if (rs.scanType == "QR_CODE") {
                                    var url = rs.result

                                    if (url.indexOf(app.globalData.domain + 'scan') == 0) {
                                        url = url.replace(app.globalData.domain + 'scan', app.globalData.domain + 'api/scan')
                                        util.http(url, 'GET', function (data) {
                                            console.log(data.data)
                                            wx.hideToast()
                                            if (data.data.scene == 'book') {
                                                wx.navigateTo({
                                                    url: '../book/book?book_shelf_id=' + data.data.id
                                                })
                                            }
                                            if (data.data.scene == 'club_book') {
                                                wx.navigateTo({
                                                    url: '../book/book?club_book_shelf_id=' + data.data.id
                                                })
                                            }
                                            if (data.data.scene == 'isbn') {
                                                wx.navigateTo({
                                                    url: '../book/book?isbn=' + data.data.id
                                                })
                                            }
                                            if (data.data.scene == 'user') {
                                                wx.navigateTo({
                                                    url: '../share/share?user_id=' + data.data.id
                                                })
                                            }
                                            if (data.data.scene == 'club') {
                                                wx.navigateTo({
                                                    url: '../club/join/join?club_id=' + data.data.id
                                                })
                                            }
                                        }, {})

                                        console.log(url);
                                    }

                                }

                                if (rs.scanType.indexOf("EAN_") == 0) {
                                    var isbn = rs.result
                                    url = app.globalData.domain + 'api/book/check'
                                    util.http(url, 'GET', function (data) {
                                        console.log(data.data)
                                        wx.hideToast()
                                        if (data.errcode == 1) {
                                            wx.showModal({
                                                title: '系统异常',
                                                content: '条形码仅支持书本码',
                                                success: function (res) {
                                                    if (res.confirm) {
                                                        console.log('用户点击确定')
                                                    }
                                                }
                                            })
                                        } else {
                                            wx.navigateTo({
                                                url: '../book/book?isbn=' + isbn
                                            })
                                        }
                                    }, { id: isbn })

                                }

                            }
                        })
                    }
                    if (res.tapIndex == 1) {
                        wx.navigateTo({
                            url: '../share/share'
                        })
                    }
                    if (res.tapIndex == 2) {
                        wx.navigateTo({
                            url: '../create-club/create-club'
                        })
                    }

                    console.log(res.tapIndex)
                }
            }
        });
    },

    // //事件处理函数
    // bindViewTap: function () {
    //     wx.navigateTo({
    //         url: '../logs/logs'
    //     })
    // },

    onLoad: function () {
        var user_id = wx.getStorageSync('user_id') || null
        var token = wx.getStorageSync('token') || null
        if (user_id == null || token == null) {
            console.log('rewrite')
            wx.redirectTo({
                url: '../welcome/welcome'
            })

        } else {
            wx.showNavigationBarLoading()
            console.log('onLoad')
            this.getDataReady()
        }
    },

    getDataReady: function () {
        var that = this
        var user_id = wx.getStorageSync('user_id')
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo,
                user_id: user_id
            })
        })
        var url = app.globalData.domain + 'api/bookShelf'
        var user_id = wx.getStorageSync('user_id')
        var parameters = {
            'user_id': user_id
        }
        util.http(url, 'GET', function (data) {
            console.log(data)
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
            that.setData({
                bookshelf: data.data.book_shelf,
                user_relationship: data.data.user_relationship,
                club_member: data.data.club_member,
            })
        }, parameters)
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完
        console.log('onReady')
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        console.log('onShow')
        var user_id = wx.getStorageSync('user_id') || null
        var token = wx.getStorageSync('token') || null
        if (user_id != null && token != null) {
            this.getDataReady()
        }
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
        console.log('onHide')
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载
        console.log('onUnload')
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
        console.log('onPullDownRefresh')
        wx.showNavigationBarLoading()
        this.getDataReady()
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
        console.log('onReachBottom')
    },
    onShareAppMessage: function () {
        var user_id = wx.getStorageSync('user_id')
        return {
            title: '和我一起读书吧',
            desc: 'YBook，拥有自己的读书圈子',
            path: '/pages/share/share?user_id=' + user_id
        }
    },


})
