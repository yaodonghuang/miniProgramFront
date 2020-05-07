const app = getApp()

Page({
  data: {
    faceUrl:"../resource/images/noneface.png"
  },
  onLoad:function(){
    var serverUrl = app.serverUrl;
    var user = app.userInfo;
    var me = this;
    wx.showLoading({
      title: '请等待。。。',
    });
    wx.request({
      url: serverUrl + '/user/query?userId=' + user.id,
      method:"POST",
      header:{
          'content-type':'application/json'
      },
      success:function(res){
        wx.hideLoading({
        })
        console.log(res.data);
        var status = res.data.status;
        if(status == 200){
            var userInfo = res.data.data;
            var faceUrl = "../resource/images/noneface.png";
            if(userInfo.faceImage != null && userInfo.faceImage != '' && userInfo.faceImage != undefined){
              faceUrl = serverUrl + userInfo.faceImage
            }
            me.setData({
              faceUrl : faceUrl,
              fansCounts:userInfo.fansCounts,
              followCounts:userInfo.followCounts,
              receiveLikeCounts:userInfo.receiveLikeCounts,
              nickname:userInfo.nickname
            })
        }
      }
    })
  },
  logout:function(){
    var user = app.userInfo;
    var serverUrl = app.serverUrl;
    if(user != undefined){
      wx.showLoading({
        title: '请等待。。。',
      })
      wx.request({
        url: serverUrl + '/logout?userId=' + user.id,
        method:"POST",
        header:{
            'content-type':'application/json'
        },
        success:function(res){
          wx.hideLoading({
          })
          console.log(res.data);
          var status = res.data.status;
          if(status == 200){
              wx.showToast({
                  title: '用户注销成功！！',
                  icon:'none',
                  duration:2000
                });
                app.userInfo = null;
                wx.navigateTo({
                  url: '../userLogin/userLogin'
                })
          }
        }
      })
    }else{
      wx.showToast({
        title: '用户未登录，请先登录！！',
        icon:'none',
        duration:2000
      })
    }
  },
  changeFace:function(){
    var me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        wx.showLoading({
          title: '上传中',
        })
        var serverUrl = app.serverUrl;
        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + app.userInfo.id, 
          filePath: tempFilePaths[0],
          name: 'file',
          header:{
            'content-type':'application/json'
          },
          success (res){
            wx.hideLoading({
            })
            const data = JSON.parse(res.data);
            console.log(data);
            if(data.status == 200){
              wx.showToast({
                title: '上传成功！',
                icon:'success',
                duration:3000
              })
              var imageUrl = data.data;
              me.setData({
                faceUrl:serverUrl + imageUrl
              })
            }else if(data.status == 500){
              wx.showToast({
                title: data.msg
              })
            }
          }
        })
      }
    })
  },
  uploadVideo:function(){
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        var duration = res.duration;
        var height = res.height;
        var width = res.width;
        var tempFilePath = res.tempFilePath;
        var coverFilePath = res.thumbTempFilePath;
        if(duration > 20){
          wx.showToast({
            title: '上传的视频不能超过20秒！',
            icon:"none",
            duration:2500
          })
        }else if(duration < 1){
          wx.showToast({
            title: '上传的视频太短，不能少于1秒！',
            icon:"none",
            duration:2500
          })
        }else{
            wx.navigateTo({
              url: '../chooseBgm/chooseBgm?duration=' + duration
              + "&height=" + height
              + "&width=" + width
              + "&tempFilePath=" + tempFilePath
              + "&coverFilePath=" + coverFilePath
            })
        }
      }
    })
  }
})
