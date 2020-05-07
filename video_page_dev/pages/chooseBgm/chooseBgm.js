const app = getApp()

Page({
    data: {
      serverUrl:"",
      bgmList:[],
      src: '',
      videoParams:{}
    },
    onLoad:function(params){
      var me = this;
      console.log(params);
      me.setData({
        videoParams:params
      })
      var serverUrl = app.serverUrl;
            wx.showLoading({
              title: '请等待。。。',
            })
      wx.request({
        url: serverUrl + '/bgm/list',
        method:"POST",
        header:{
            'content-type':'application/json'
        },
        success:function(res){
          console.log(res.data);
          wx.hideLoading({
            
          })
          var status = res.data.status;
          if(status == 200){
              var bgmList = res.data.data;
              if(bgmList.length > 0){
                me.setData({
                  bgmList : bgmList,
                  serverUrl:serverUrl
                });
              }
          }
        }
      })
    },
    upload:function(e){
        var me = this;
        var bgmId = e.detail.value.bgmId;
        var desc = e.detail.value.desc;
        console.log("bgmId：" + bgmId);
        console.log("desc：" + desc);
        var duration = this.data.videoParams.duration;
        var height = this.data.videoParams.height;
        var width = this.data.videoParams.width;
        var tempFilePath = this.data.videoParams.tempFilePath;
        var coverFilePath = this.data.videoParams.coverFilePath;
        
        wx.showLoading({
          title: '上传中',
        })
        var serverUrl = app.serverUrl;
        wx.uploadFile({
          url: serverUrl + '/video/upload', 
          formData:{
            userId:app.userInfo.id,
            bgmId:bgmId,
            desc:desc,
            videoSeconds:duration,
            videoHeight:height,
            videoWidth:width
          },
          filePath: tempFilePath,
          name: 'videoFile',
          header:{
            'content-type':'application/json'
          },
          success:function (res){
            wx.hideLoading({
            })
            const data = JSON.parse(res.data);
            console.log(data);
            if(data.status == 200){
              // var videoId = data.data;
              wx.showToast({
                title: '上传成功！',
                icon:'success',
                duration:3000
              })
              wx.navigateBack({
                delta:-1
              })
              // wx.showLoading({
              //   title: '上传中',
              // })
              // wx.uploadFile({
              //   url: serverUrl + '/video/uploadCover', 
              //   formData:{
              //     userId:app.userInfo.id,
              //     videoId:videoId
              //   },
              //   filePath: coverFilePath,
              //   name: 'videoFile',
              //   header:{
              //     'content-type':'application/json'
              //   },
              //   success:function(){
              //     const data = JSON.parse(res.data);
              //     wx.hideLoading({
              //     })
              //     if(data.status == 200){
              //       wx.showToast({
              //         title: '上传成功！',
              //         icon:'success',
              //         duration:3000
              //       });
              //       wx.navigateBack({
              //         delta:1,
              //       })
              //     }else{
              //       wx.showToast({
              //         title: '上传失败！',
              //         icon:'success',
              //         duration:3000
              //       });
              //     }
              //   }
              // })
            }else{
              wx.showToast({
                title: '上传失败！',
                icon:'none',
                duration:3000
              })
            }
          }
        })
    }
})

