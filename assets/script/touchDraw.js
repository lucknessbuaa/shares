function TouchDraw(canvas, c, $pen) {
    this.canvas = canvas;
    this.c = c;
    this.$pen = $pen;
    this.drawStatus = 0;
    this.topDis = $(canvas).position().top;
    this.leftDis = $(canvas).position().left;
    this.$diffW = -$(window).width() * 0.035;
    this.$diffH = -$(window).height() * 0.015;
    this.minX = this.leftDis - 10;
    this.pageMinX = this.leftDis + 10;
    this.maxX = $(window).width() * 0.9375;
    this.pageMaxX = canvas.width * 0.9;
    this.maxY = $(window).height() * 0.694;
    this.drawX = 0;
    this.drawY = 0;
}

TouchDraw.prototype.resetDraw = function() {
    this.minX = this.leftDis - 5;
    this.drawStatus = 0;
}

TouchDraw.prototype.init = function() {
    $('.pen')[0].addEventListener('touchstart', this.startDraw.bind(this), false);
    $('.pen')[0].addEventListener('touchmove', this.draw.bind(this), false);
    $('.pen')[0].addEventListener('touchend', this.stopDraw.bind(this), false);
}

TouchDraw.prototype.startDraw = function(event) {}

TouchDraw.prototype.draw = function(event) {
    var pagex = event.touches[0].pageX;
    var pagey = event.touches[0].pageY;

    if (pagex > this.minX && pagex < this.maxX && pagey > this.topDis && pagey < this.maxY) {

        this.drawX = pagex - this.leftDis;
        this.drawY = pagey - this.topDis - this.canvas.height / 2;

        this.$pen.css({
            'position': 'absolute',
            'left': pagex + this.$diffW + 'px',
            'top': pagey + this.$diffH + 'px'
        });

        if (pagex < this.pageMinX) {
            this.c.moveTo(0, this.drawY);
        } else {
            this.drawStatus = 1;
            this.c.lineTo(this.drawX, this.drawY);
            this.minX = pagex;
            this.c.stroke();
        }
    }
}

TouchDraw.prototype.stopDraw = function(event) {
    if (this.drawStatus && this.drawX > this.pageMaxX) {
        var rankid = Math.floor(Math.random() * 2 + 1);
        var id;
        var count = parseInt(this.drawY);

        if (count < 0) {
            id = '#esc' + rankid;
        } else if (count > 0) {
            id = '#desc' + rankid;
        } else {
            id = '#eq' + rankid;
        }
        $(id).velocity("fadeIn");

        var dataURL = this.canvas.toDataURL();
        var info = $('.idea').val();
        var id = $('#id').text();

        $.post('/share/add', {
            dataURL: dataURL,
            info: info,
            id: id
        }, function(){
            console.log('success');
        }).fail(function(e) {
            console.log(e.responseText);
        });
    }
}
