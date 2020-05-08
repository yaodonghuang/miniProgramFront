var videoUtil = require('../../utils/videoUtil.js')
const app = getApp()

Page({
  data: {
    cover: "cover",
    videoId: "",
    src: "",
    videoInfo: {}
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
    if(width >= height){
      cover = "";
    }
    me.setData({
      videoId: videoInfo.id,
      src: app.serverUrl + videoInfo.videoPath,
      videoInfo: videoInfo,
      cover:cover
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
  upload: function () {
    videoUtil.uploadVideo();
  },
  showIndex:function(){
    wx.redirectTo({
      url: '../index/index',
    })
  }
})