//app.js
App({
  onLaunch: function () {
    //程序启动
    console.log('onLaunch')
    //用户登录，从后台异步的去获取用户的user_id及token
    this.getReady()
  },
  getReady: function (cb) {
    console.log('appGetReady')
    var that = this
    var user_id = wx.getStorageSync('user_id') || null
    var token = wx.getStorageSync('token') || null
    if (user_id == null || token == null || user_id <75) {
      wx.clearStorageSync()
      //登录
      wx.login({
        success: function (res) {
          console.log('login_success')
          var code = res.code;
          //需要去拿token信息，然后在这里进行缓存
          //获取用户的信息，并且复制
          wx.getUserInfo({
            success: function (res) {
              console.log('user_info_success')
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              wx.request({
                url: "https://www.neixz.cn/swx/login",
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
                  wx.clearStorageSync();
                  that.getReady()
                  console.log(res.data.data)
                },
                success: function (res) {
                  console.log('request_success')
                  wx.setStorageSync('token', res.data.data.token)
                  wx.setStorageSync('user_id', res.data.data.user_id)
                  wx.setStorageSync('user_name', res.data.data.user_name)
                  wx.setStorageSync('user_avatar', res.data.data.user_avatar)
                  typeof cb == "function" && cb(res.data.data)
                }
              })
            }
          })
        }
      })
    } else {
      var dataobj = {
        'token': wx.getStorageSync('token'),
        'user_id': wx.getStorageSync('user_id'),
        'user_name': wx.getStorageSync('user_name'),
        'user_avatar': wx.getStorageSync('user_avatar')
      }
      typeof cb == "function" && cb(dataobj)
    }
  },
  loadingData: function (cb) {
    var appThis = this
    var user_id = wx.getStorageSync('user_id') || null
    var token = wx.getStorageSync('token') || null
    if (user_id == null || token == null) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
      })
      setTimeout(function () {
        typeof cb == "function" && cb
      }, 300)
    } else {
      wx.hideToast()
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
              wx.setStorageSync('user_name', res.userInfo.nickName)
              wx.setStorageSync('user_avatar', res.userInfo.avatarUrl)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    domain: 'https://www.neixz.cn/'
  }
})