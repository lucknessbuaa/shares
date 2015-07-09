function configWechat(shareData) {
    $.get('/api/wechat/config', {
        url: location.href.split('#')[0]
    }).done(function(data) {
        if (data.code !== 0) {
            return false;
        }
        wx.config({
            debug: false,
            appId: data.appid,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'previewImage'
            ]
        });
        wx.ready(function() {
            configContent(shareData);
        });

        wx.error(function(res) {});
    }).fail(function(e) {
        console.log('wechatshare config failure');
    });
}

function configContent(shareData) {
    var title = '神笔马良画股市：大盘怎么走？你来画一手！';
    var link = window.location.href.split('#')[0];
    var imgUrl = 'http://' + window.location.hostname + '/static/images/wechatshare.jpg';
    var desc = '小虎下战帖，诚邀各路英雄画线预测大盘。速来参战，看谁才是真正的神笔马良！';

    if (shareData) {
        if (shareData.title) {
            title = shareData.title;
        }
        if (shareData.link) {
            link = shareData.link;
        }
        if (shareData.imgUrl) {
            imgUrl = shareData.imgUrl;
        }
        if (shareData.desc) {
            desc = shareData.desc;
        }
    }

    wx.onMenuShareTimeline({
        title: title,
        link: link,
        imgUrl: imgUrl
    });
    wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl
    });
    wx.onMenuShareQQ({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl
    });
    wx.onMenuShareWeibo({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl
    });
}
