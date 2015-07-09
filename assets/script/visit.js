$(function() {
    window.onscroll = function() {
        return false;
    }

    var avatarH = $('.avatar').height();
    $('.avatar').width(avatarH);

    $('.predict').click(function() {
        window.location.href = '/';
    });

    var avatar = $('#avatarData').text();
    var $avatar = $('.avatar');
    if (avatar != 'None') {
        $avatar.css({
            'background': 'url(' + avatar + ') 0 0 no-repeat',
            'background-size': '100% 100%'
        });
    }

    $('.bg').css({
        'opacity': '1'
    });

    configWechat();
});
