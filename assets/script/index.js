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
    var penPos;
    var minX;
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

    $.get('/api/getData', function(data) {
        drawDatacopy = data;

        drawData = new DrawData(c, data, width, height);
        penPos = {
            'width': drawData.returnWidth,
            'height': drawData.returnHeight
        }
        var eleTop = (0.545 + penPos.height * 0.2986 - 0.02) * windowH;
        $('.pen').css({
            'position': 'absolute',
            'left': (0.0625 + penPos.width - 0.09) * windowW,
            'top': eleTop
        });
        $('.tip').css({
            'position': 'absolute',
            'top': eleTop + windowH * 0.1,
        });
        minX = (0.0625 + penPos.width) * windowW;

        touchDraw = new TouchDraw(canvas, c, $('.pen'), $('.tip'), minX);
        touchDraw.init();
    }).fail(function(error) {
        console.log('获取数据失败！');
    });

    //reset canvas
    $('button.reset').click(function() {
        c.translate(0, -height / 2);
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.translate(0, height / 2);
        drawData = new DrawData(c, drawDatacopy, width, height);
        $('.pen').css({
            'position': 'absolute',
            'left': (0.0625 + penPos.width - 0.09) * windowW,
            'top': (0.545 + penPos.height * 0.2986 - 0.02) * windowH
        });
        touchDraw.minX = minX;
    });

    //share
    $('button.share').click(function() {
        var dataURL = canvas.toDataURL();
        $('.shareImg').css('display', 'block');

        var info = $('.idea').val();

        $.post('/share/add', {
            dataURL: dataURL,
            info: info
        }, function(data) {
            if (data.code === 0) {
                configWechat({
                    'link': 'http://' + window.location.hostname + '/share/' + data.id,
                    'desc': '大盘震荡，深V调整，' + data.username + '预测了' + parseInt(data.dateM) + '月' +  parseInt(data.dateD)+ '日' + '的大盘走势'
                });
            } else if (data.code === 2002) {
                window.location.href = '/login';
            } else {
                console.log('2001');
            }
        }).fail(function(e) {
            console.log('error');
            console.log(e.responseText);
        });
    });

    $('.shareImg').click(function() {
        $(this).css('display', 'none');
    });

    $('button.attention').click(function() {
        location.href = '/';
    });

    configWechat();
})
