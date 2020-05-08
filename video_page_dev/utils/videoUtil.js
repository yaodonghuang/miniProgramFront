function uploadVideo() {
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    maxDuration: 60,
    camera: 'back',
    success(res) {
      var duration = res.duration;
      var height = res.height;
      var width = res.width;
      var tempFilePath = res.tempFilePath;
      var coverFilePath = res.thumbTempFilePath;
      if (duration > 20) {
        wx.showToast({
          title: '上传的视频不能超过20秒！',
          icon: "none",
          duration: 2500
        })
      } else if (duration < 1) {
        wx.showToast({
          title: '上传的视频太短，不能少于1秒！',
          icon: "none",
          duration: 2500
        })
      } else {
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

module.exports = {
  uploadVideo: uploadVideo
}