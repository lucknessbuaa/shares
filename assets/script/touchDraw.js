function TouchDraw(canvas, c, $pen, $tip, minX) {
    this.canvas = canvas;
    this.c = c;
    this.$canvas = $(canvas);
    this.$pen = $pen;
    this.$tip = $tip;
    this.topDis = this.$canvas.position().top;
    this.leftDis = this.$canvas.position().left;
    this.$diffW = -$(window).width() * 0.035;
    this.$diffH = -$(window).height() * 0.015;
    this.minX = minX;
    this.maxX = $(window).width() * 0.9375;
    this.minY = $(window).height() * 0.396;
    this.maxY = $(window).height() * 0.694;
}

TouchDraw.prototype.init = function() {
    $('.pen')[0].addEventListener('touchstart', this.startDraw.bind(this), false);
    $('.pen')[0].addEventListener('touchmove', this.draw.bind(this), false);
    $('.pen')[0].addEventListener('touchend', this.stopDraw.bind(this), false);
}

TouchDraw.prototype.startDraw = function(event) {
    this.$tip.css('display', 'none');
}

TouchDraw.prototype.draw = function(event) {
    var pagex = event.touches[0].pageX;
    var pagey = event.touches[0].pageY;

    if (pagex > this.minX && pagex < this.maxX && pagey > this.minY && pagey < this.maxY) {
        var x = pagex - this.leftDis;
        var y = pagey - this.topDis - this.canvas.height / 2;

        this.$pen.css({
            'position': 'absolute',
            'left': pagex + this.$diffW + 'px',
            'top': pagey + this.$diffH + 'px'
        });

        this.c.lineTo(x, y);
        this.minX = pagex;
        this.c.stroke();
    }
}

TouchDraw.prototype.stopDraw = function(event) {
    var rankid = Math.floor(Math.random() * 5 + 1);
    var credit;
    if(rankid == 1) {
        credit = Math.floor(Math.random() * 10 + 90); 
    }else if(rankid == 2){
        credit = Math.floor(Math.random() * 10 + 80); 
    }else if(rankid == 3) {
        credit = Math.floor(Math.random() * 20 + 60); 
    }else if(rankid == 4) {
        credit = Math.floor(Math.random() * 30 + 30); 
    }else if(rankid == 5) {
        credit = Math.floor(Math.random() * 20 + 10); 
    }
    $('#credit' + rankid).text(credit + '分');
    $('#rank' + rankid).velocity("fadeIn");

    var dataURL = this.canvas.toDataURL();
    var info = $('.idea').val();
    var id = $('#id').text();
    
    $.post('/share/add', {
        dataURL: dataURL,
        info: info,
        id: id
    }).fail(function(e){
        console.log(e.responseText);
    });
}
