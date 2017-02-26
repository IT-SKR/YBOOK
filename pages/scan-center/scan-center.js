
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()

Page({
    data: {
        scene: '',
        id: 0
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var scene = options.scene
        var id = options.id
        this.setData({
            scene: scene,
            id:id
        });
    }
})