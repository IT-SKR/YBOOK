//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()

Page({
    data: {
        book: {},
        user_id: 0,
        arguments: [],
        items: [],
        scene:'',
        id:0
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        wx.showNavigationBarLoading()
        this.getDataReady(options)
    },
    getDataReady: function (options) {
        var that = this
        var url = app.globalData.domain + "api/book/detail"
        if (typeof (options.book_shelf_id) != "undefined") {
            var id = options.book_shelf_id
            var scene = 'book'
        }
        if (typeof (options.club_book_shelf_id) != "undefined") {
            var id = options.club_book_shelf_id
            var scene = 'club_book'
        }
        if (typeof (options.isbn) != "undefined") {
            var id = options.isbn
            var scene = 'isbn'
        }
        var user_id = wx.getStorageSync('user_id')

        var parameters = {
            'scene': scene,
            'id': id,
            'my_id': user_id
        }
        //这两个参数用来传递到下一个页面
        that.setData({
            scene:scene,
            id:id
        })
        util.http(url, 'GET', function (data) {
            console.log(data)
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
            if (data.errcode == 0) {
                that.setData({
                    book: data.data,
                    user_id: user_id
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
    },
    open: function () {
        var that = this
        if (that.data.items.length == 0) {
            //删除、转移到club、转移到个人
            //如果自己的管理员或者在自己的书架，自己可以删除
            if (that.data.book.scene == 'MY-SHELF' || that.data.book.scene == 'ADMIN-CLUB') {
                var argument = {
                    'method': 'DELETE',
                    'scene': that.data.book.scene,
                    'resource_id': that.data.book.resource_id
                }
                that.data.items.unshift('删除书本')
                that.data.arguments.unshift(argument)
            }
            //如果不是自己的书架，则可以将书本转移到我的书架
            if ((that.data.book.scene != 'MY-SHELF' && that.data.book.book_status == 'HOLD') || (that.data.book.scene == 'NEW')) {
                var argument = {
                    'scene': that.data.book.scene,
                    'user_id': that.data.user_id,
                    'target': 'user',
                    'target_id': that.data.user_id,
                    'resource_id': that.data.book.resource_id
                }
                that.data.items.unshift('添加到我的书架')
                that.data.arguments.unshift(argument)
            }
            //如果不是自己的书架，则可以将书本转移到我的书架
            // if (book.scene == 'OTHER-SHELF') {
            // }
            // if (book.scene == 'TOURIST-CLUB') {
            // }
            // if (book.scene == 'ADMIN-CLUB') {
            // }
            // if (book.scene == 'MEMBER-CLUB') {
            // }
            // if ((Array.from(that.data.book.clubs).length != 0 && that.data.book.book_status == 'HOLD') || (that.data.book.scene == 'NEW')) {
            //     var clubs = Array.from(that.data.book.clubs)
            //     for (let [index, value] of clubs.entries()) {
            //         var argument = {
            //             'scene': that.data.book.scene,
            //             'user_id': that.data.user_id,
            //             'target': 'club',
            //             'target_id': value.club_id,
            //             'resource_id': that.data.book.resource_id
            //         }
            //         that.data.items.unshift('转到->' + value.club_name)
            //         that.data.arguments.unshift(argument)
            //     }
            // }

            if ((that.data.book.clubs.length != 0 && that.data.book.book_status == 'HOLD') || (that.data.book.scene == 'NEW')) {
                var clubs = that.data.book.clubs

                for (var x in clubs) {
                    var argument = {
                        'scene': that.data.book.scene,
                        'user_id': that.data.user_id,
                        'target': 'club',
                        'target_id': clubs[x].club_id,
                        'resource_id': that.data.book.resource_id
                    }
                    that.data.items.unshift('转到->' + clubs[x].club_name)
                    that.data.arguments.unshift(argument)
                }
            }
        }
        //
        wx.showActionSheet({
            itemList: that.data.items,
            success: function (res) {
                if (!res.cancel) {
                    console.log(res.tapIndex)
                    console.log(that.data.items[res.tapIndex])
                    console.log(that.data.arguments[res.tapIndex])
                    wx.showModal({
                        title: '提示',
                        content: '是否继续',
                        success: function (rs) {
                            if (rs.confirm) {
                                if (typeof (that.data.arguments[res.tapIndex].method) == "undefined") {
                                    var url = app.globalData.domain + "api/book/transfer"
                                    var pr = that.data.arguments[res.tapIndex]
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
                                    }, pr)
                                } else {
                                    var url = app.globalData.domain + "api/book/delete"
                                    var pr = {
                                        'scene': that.data.arguments[res.tapIndex].scene,
                                        'resource_id': that.data.arguments[res.tapIndex].resource_id
                                    }
                                    util.http(url, 'DELETE', function (data) {
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
                                    }, pr)
                                }
                            }
                        }
                    })
                }
            }
        });
    }
})