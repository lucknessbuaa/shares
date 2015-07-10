function DrawData(c, data, width, height) {
    this.c = c;
    this.min = parseFloat(data.min);
    this.max = parseFloat(data.max);
    this.distance = parseFloat(this.max - this.min);
    this.openreal = parseFloat(data.open);
    this.open = (this.max + this.min) / 2;
    this.width = width;
    this.height = height;
    this.yestoday = data.yestoday;
    this.today = data.today;

    this.init();
}

DrawData.prototype.init = function() {
    if (this.openreal >= this.max || this.openreal <= this.min) {
        this.openreal = this.open;
    }

    this.drawNumber();
    this.drawYestodayData();
    this.drawTodayData();

    var todayL = this.today.length;
    var yestodayL = this.yestoday.length;
    if (todayL === 0) {
        this.returnWidth = 0.2 * 0.875,
        this.returnHeight = (this.open - parseFloat(this.yestoday[yestodayL - 1].data)) / this.distance
    } else {
        todayD = this.today[todayL - 1];
        if (todayD.time >= 13) {
            this.returnWidth = (0.6 + (parseFloat(todayD.time) - 13) * 0.2) * 0.875,
            this.returnHeight = (this.open - parseFloat(todayD.data)) / this.distance
        } else {
            this.returnWidth = (0.2 + (parseFloat(todayD.time) - 9.5) * 0.2) * 0.875,
            this.returnHeight = (this.open - parseFloat(todayD.data)) / this.distance
        }
    }
}

DrawData.prototype.drawNumber = function() {
    this.c.font = "10px";
    this.c.fillStyle = '#ffffff';

    var y = (this.open - this.openreal) / this.distance * this.height;

    this.c.fillText('' + this.openreal, 0, y);
    this.c.fillText('' + this.min, 0, this.height / 2);
    this.c.fillText('' + this.max, 0, -this.height / 2 + 10);
}

DrawData.prototype.drawTodayData = function() {
    var x;
    var y;
    var time;
    var itemData;
    this.c.beginPath();

    for (var i = 0; i < this.today.length; i++) {
        time = parseFloat(this.today[i].time);
        itemData = parseFloat(this.today[i].data);

        if (time >= 13) {
            x = this.width * (0.6 + (time - 13) * 0.2);
        } else {
            x = this.width * (0.2 + (time - 9.5) * 0.2);
        }
        y = (this.open - itemData) / this.distance * this.height;

        if (i == 0) {
            this.c.moveTo(x, y);
        }

        this.c.lineTo(x, y);
    }

    this.c.strokeStyle = "#ffe700";
    this.c.stroke();
}

DrawData.prototype.drawYestodayData = function() {
    var x;
    var y;
    var time;
    var itemData;
    this.c.beginPath();

    for (var i = 0; i < this.yestoday.length; i++) {
        time = parseFloat(this.yestoday[i].time);

        if (time < 14 || time > 15) {
            continue;
        }

        itemData = parseFloat(this.yestoday[i].data);

        x = this.width * (time - 14) * 0.2;
        y = (this.open - itemData) / this.distance * this.height;

        if (i == 0) {
            this.c.moveTo(x, y);
        }
        this.c.lineTo(x, y);
    }

    this.c.strokeStyle = "#ffffff";
    this.c.stroke();
}
