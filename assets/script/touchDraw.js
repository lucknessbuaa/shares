function TouchDraw(canvas, c, $pen, $tip, minX) {
    this.canvas = canvas;
    this.c = c;
    this.$canvas = $(canvas);
    this.$pen = $pen;
    this.$tip = $tip;
    this.topDis = this.$canvas.position().top;
    this.leftDis = this.$canvas.position().left;
    this.$diffW = -$(window).width() * 0.09;
    this.$diffH = -$(window).height() * 0.02;
    this.minX = minX;
    this.minY = $(window).height() * 0.396;
    this.maxY = $(window).height() * 0.694;
}

TouchDraw.prototype.init = function() {
    this.canvas.addEventListener('touchstart', this.startDraw.bind(this), false);
    this.canvas.addEventListener('touchmove', this.draw.bind(this), false);
    this.canvas.addEventListener('touchend', this.stopDraw.bind(this), false);
}

TouchDraw.prototype.startDraw = function(event) {
    this.$tip.css('display', 'none');
}

TouchDraw.prototype.draw = function(event) {
    var pagex = event.touches[0].pageX;
    var pagey = event.touches[0].pageY;

    if (pagex > this.minX && pagey > this.minY && pagey < this.maxY) {
        var x = pagex - this.leftDis;
        var y = pagey - this.topDis - this.canvas.height / 2;
        console.log(pagex);
        console.log(pagey);

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

TouchDraw.prototype.stopDraw = function(event) {}
