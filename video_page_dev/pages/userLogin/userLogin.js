const app = getApp()

Page({
  data: {

  },
  onLoad: function (parms) {
    var me = this;
    var redirectUrl = parms.redirectUrl;
    if (redirectUrl != null && redirectUrl != '' && redirectUrl != undefined) {
      redirectUrl = redirectUrl.replace(/#/g, "?");
      redirectUrl = redirectUrl.replace(/@/g, "=");
      me.redirectUrl = redirectUrl;
    }
  },
  doLogin: function (e) {
    var me = this;
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else {
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等待。。。',
      })
      wx.request({
        url: serverUrl + '/login',
        method: "POST",
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading({

          })
          console.log(res.data);
          var status = res.data.status;
          if (status == 200) {
            wx.showToast({
              title: '用户登录成功！！',
              icon: 'success',
              duration: 2000
            })
            // app.userInfo = res.data.data;
            // 修改原有全局对象为本地缓存
            app.setGlobalUserInfo(res.data.data);
            var redirectUrl = me.redirectUrl;
            if (redirectUrl != null && redirectUrl != '' && redirectUrl != undefined) {
              wx.navigateTo({
                url: redirectUrl
              })
            } else {
              wx.navigateTo({
                url: '../mine/mine'
              })
            }

          } else if (status == 500) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },
  goRegistPage: function () {
    wx.navigateTo({
      url: '../userRegist/regist'
    })
  }
})