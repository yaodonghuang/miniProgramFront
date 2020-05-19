var videoUtil = require('../../utils/videoUtil.js')
const app = getApp()

Page({
  data: {
    cover: "cover",
    videoId: "",
    src: "",
    videoInfo: {},
    userLikeVideo: false
  },
  showSearch: function () {
    wx.navigateTo({
      url: '../searchVideo/searchVideo',
    })
  },
  videoCtx: {},
  onLoad: function (parms) {
    var me = this;
    me.videoCtx = wx.createVideoContext('myVideo', me);
    // 获取上一个页面传入的参数
    var videoInfo = JSON.parse(parms.videoInfo);
    var height = videoInfo.videoHeight;
    var width = videoInfo.videoWidth;
    var cover = "cover";
    if (width >= height) {
      cover = "";
    }
    me.setData({
      videoId: videoInfo.id,
      src: app.serverUrl + videoInfo.videoPath,
      videoInfo: videoInfo,
      cover: cover
    })
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    var loginUserId = "";
    if (user != null && user != '' && user != undefined) {
      loginUserId = user.id;
    }
    wx.request({
      url: serverUrl + '/user/queryPublisher?loginUserId=' + loginUserId + "&videoId=" + videoInfo.id + "&publisherUserId=" + videoInfo.userId,
      method: "POST",
      success: function (res) {
        console.log(res.data)
        var publisher = res.data.data.publisher;
        var userLikeVideo = res.data.data.userLikeVideo;
        me.setData({
          serverUrl: serverUrl,
          publisher: publisher,
          userLikeVideo: userLikeVideo
        })
      }
    })
  },
  onShow: function () {
    var me = this;
    me.videoCtx.play();
  },
  onHide: function () {
    var me = this;
    me.videoCtx.pause();
  },
  showPublisher: function () {
    var me = this;
    var userInfo = app.getGlobalUserInfo();

    var videoInfo = me.data.videoInfo;

    var realUrl = '../mine/mine#publisherId@' + videoInfo.userId;
    if (userInfo == null || userInfo == '' || userInfo == undefined) {
      wx.navigateTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    } else {
      wx.navigateTo({
        url: '../mine/mine?publisherId=' + videoInfo.userId,
      })
    }
  },
  upload: function () {
    var me = this;
    var userInfo = app.getGlobalUserInfo();

    var videoInfo = JSON.stringify(me.data.videoInfo);

    var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;
    if (userInfo == null || userInfo == '' || userInfo == undefined) {
      wx.navigateTo({
        url: '../userLogin/userLogin?redirectUrl=' + realUrl,
      })
    } else {
      videoUtil.uploadVideo();
    }
  },
  showIndex: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  showMine: function () {
    var userInfo = app.getGlobalUserInfo();
    if (userInfo == null || userInfo == '' || userInfo == undefined) {
      wx.navigateTo({
        url: '../userLogin/userLogin',
      })
    } else {
      wx.navigateTo({
        url: '../mine/mine',
      })
    }
  },
  likeVideoOrNot: function () {
    var me = this;
    var videoInfo = me.data.videoInfo;
    var userInfo = app.getGlobalUserInfo();
    if (userInfo == null || userInfo == '' || userInfo == undefined) {
      wx.navigateTo({
        url: '../userLogin/userLogin',
      })
    } else {
      var userLikeVideo = me.data.userLikeVideo;
      var url = '/video/userLike?userId=' + userInfo.id + '&videoId=' + videoInfo.id + '&videoCreateId=' + videoInfo.userId;
      if (userLikeVideo) {
        url = '/video/userUnLike?userId=' + userInfo.id + '&videoId=' + videoInfo.id + '&videoCreateId=' + videoInfo.userId;
      }
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '...'
      })
      wx.request({
        url: serverUrl + url,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'userId': userInfo.id,
          'userToken': userInfo.userToken
        },
        success: function (res) {
          wx.hideLoading({
          })
          if (res.data.status == 200) {
            me.setData({
              userLikeVideo: !userLikeVideo
            })
          } else if (res.data.status == 502) {
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
              icon: "none",
              success: function () {
                wx.redirectTo({
                  url: '../userLogin/userLogin',
                })
              }
            })
          }
        }
      })
    }
  },
  shareMe: function () {
    var me = this;
    var user = app.getGlobalUserInfo();
    wx.showActionSheet({
      itemList: ['下载到本地', '举报用户', '分享到朋友圈', '分享到QQ空间', '分享到微博'],
      success: function (res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 0) {
          // 下载
          wx.showLoading({
            title: '下载中...',
          })
          wx.downloadFile({
            url: app.serverUrl + me.data.videoInfo.videoPath,
            success: function (res) {
              if (res.statusCode === 200) {
                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (res) {
                    console.log(res.errMsg)
                    wx.hideLoading({
                    })
                    wx.showToast({
                      title: '下载成功！',
                    })
                  }
                })
              }
            }
          })
        } else if (res.tapIndex == 1) {
          // 举报用户
          var videoInfo = JSON.stringify(me.data.videoInfo);
          var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;
          if (user == null || user == undefined || user == '') {
            wx.navigateTo({
              url: '../userLogin/login?redirectUrl=' + realUrl,
            })
          } else {
            var publishUserId = me.data.videoInfo.userId;
            var videoId = me.data.videoInfo.id;
            var currentUserId = user.id;
            wx.navigateTo({
              url: '../report/report?videoId=' + videoId + "&publishUserId=" + publishUserId
            })
          }
        } else {
          wx.showToast({
            title: '官方尚未开放！',
          })
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    var me = this;
    var videoInfo = me.data.videoInfo;
    return {
      title: '短视频内容分析',
      path: 'pages/videoinfo/videoinfo?videoInfo=' + JSON.stringify(videoInfo)
    }
  }
})