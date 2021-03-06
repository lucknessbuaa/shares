function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
}
window.ontouchmove = preventDefault;

$(function() {
    var canvas = $('#trend')[0];
    var drawDatacopy;
    var drawData;
    var touchDraw;

    var windowW = $(window).width();
    var windowH = $(window).height();

    var width = windowW * 0.875;
    var height = windowH * 0.2986;

    canvas.width = width;
    canvas.height = height;


    var c = canvas.getContext('2d');
    c.translate(0, height / 2);
    c.imageSmoothingEnabled = true;
    c.moveTo(0, 0);
    c.lineWidth = 2;

    var eleTop;
    var eleLeft;

    $.get('/api/getData', function(data) {
    //$.get('/static/script/data.json', function(data) {
        drawDatacopy = data;

        drawData = new DrawData(c, data, height);
        c.beginPath();
        c.moveTo(0, 0);
        c.strokeStyle = "#ffe700";
        eleTop = (0.545 - 0.015) * windowH;
        eleLeft = (0.0625 - 0.035) * windowW;
        $('.pen').css({
            'position': 'absolute',
            'left': eleLeft,
            'top': eleTop
        });

        touchDraw = new TouchDraw(canvas, c, $('.pen'));
        touchDraw.init();

        var dataURL = canvas.toDataURL();
        var info = $('.idea').text();
        var id = $('#id').text();

        $.post('/share/add', {
            dataURL: dataURL,
            info: info,
            id: id
        }).fail(function(e) {
            console.log(e.responseText);
        });
    }).fail(function(error) {
        console.log('获取数据失败！');
    });

    //reset canvas
    $('button.reset').click(function() {
        $('.rank').velocity('fadeOut');
        c.translate(0, -height / 2);
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.translate(0, height / 2);
        drawData = new DrawData(c, drawDatacopy, height);
        c.beginPath();
        c.moveTo(0, 0);
        touchDraw.resetDraw();
        c.strokeStyle = "#ffe700";
        $('.pen').css({
            'position': 'absolute',
            'left': eleLeft,
            'top': eleTop
        });

        /*var dataURL = canvas.toDataURL();
        var info = $('.idea').text();
        var id = $('#id').text();

        $.post('/share/add', {
            dataURL: dataURL,
            info: info,
            id: id
        }).fail(function(e) {
            console.log(e.responseText);
        });*/
    });

    $('button.attention').click(function() {
        location.href = 'http://mp.weixin.qq.com/s?__biz=MzA4NDc2MTc5OA==&mid=209221798&idx=1&sn=b605c76be5fd45072ab7d625035b2f77&scene=1&key=c76941211a49ab581e5e40794cb11770a5f60abbc7290a9347ca8e7d2bede508865c0d7ccedf76c44a644aeaeddea2a8&ascene=1&uin=NDE4MDkwNjk1&devicetype=webwx&version=70000001&pass_ticket=FXej3lt2gVAQ50E%2FEEWSAeMiHg3YVPyy%2B%2FXdzLiDtg%2BdK9oVnfOASeXijf196ua3';
    });

    configWechat({
        'title': '城会玩|你适合炒股吗？快来测测你的股商！',
        'imgUrl': $('#avatar').text(),
        'link': 'http://' + window.location.hostname + '/share/' + $('#id').text()
    });

    $('button.share').click(function() {
        $('.shareImg').velocity("fadeIn");
        $('.share_person').velocity("fadeIn", {
            complete: function() {
                $('.share_text').velocity("fadeIn");
            }
        });

        var dataURL = canvas.toDataURL();
        var info = $('.idea').val();
        var id = $('#id').text();
        $.post('/share/add', {
            info: info,
            dataURL: dataURL,
            id: id
        }).fail(function(e) {
            console.log(e.responseText);
        });
    });
    $('.shareImg').click(function() {
        $('.shareImg').velocity("fadeOut");
        $('.share_person').velocity("fadeOut");
        $('.share_text').velocity("fadeOut");
    });

    //pen animations
    $('.circle1').velocity({
        opacity: 1
    }, {
        loop: true
    });
    $('.circle2').velocity({
        scaleX: 1.8,
        scaleY: 1.8
    }, {
        loop: true
    });
})
