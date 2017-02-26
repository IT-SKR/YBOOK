//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        showTopTips: false,
        clubName: "",
        clubDescription: "",
        err: "",
        desclenght: 0
    },
    inputName: function (e) {
        this.setData({
            clubName: e.detail.value
        });
    },
    inputDescription: function (e) {
        console.log(e.detail.value)
        this.setData({
            clubDescription: e.detail.value,
            desclenght: e.detail.value.length
        });

    },
    showTopTips: function (e) {
        console.log(this.data.clubName)
        console.log(this.data.clubDescription + 'w')
        var that = this
        if (this.data.clubName == "" || this.data.clubDescription == "") {
            that.setData({
                showTopTips: true,
                err: "名称及描述不能为空"
            });
            setTimeout(function () {
                that.setData({
                    showTopTips: false
                });
            }, 3000);
            return;
        }

        var url = app.globalData.domain + 'api/bookClub/create'
        var user_id = wx.getStorageSync('user_id')
        var parameters = {
            'user_id': user_id,
            'club_name': this.data.clubName,
            'description': this.data.clubDescription
        }
        util.http(url, 'POST', function (data) {
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
                that.setData({
                    showTopTips: true,
                    err: "發生錯誤"
                })
                setTimeout(function () {
                    that.setData({
                        showTopTips: false
                    })
                }, 3000)
            }
        }, parameters)
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

        console.log('onPullDownRefresh')
        wx.stopPullDownRefresh()
    }
});