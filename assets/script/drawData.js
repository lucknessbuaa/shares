function DrawData(c, data, height) {
    this.c = c;
    this.min = parseFloat(data.min).toFixed(2);
    this.max = parseFloat(data.max).toFixed(2);
    this.open = parseFloat(data.open).toFixed(2);
    this.height = height;

    this.init();
}

DrawData.prototype.init = function() {
    this.drawNumber();
}

DrawData.prototype.drawNumber = function() {
    this.c.font = "10px";
    this.c.fillStyle = '#90201d';
    this.c.font = '400 10px Arial';

    this.c.fillText('' + this.open, 0, -5);
    this.c.fillText('' + this.min, 0, this.height / 2);
    this.c.fillText('' + this.max, 0, -this.height / 2 + 10);
}
