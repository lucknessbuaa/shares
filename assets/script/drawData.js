function drawData(c, data, width, height) {
    var min = parseFloat(data.min);
    var max = parseFloat(data.max);
    var distance = parseFloat(max - min);
    var open = parseFloat(data.open);

    drawNumber(c, min, max, open, width, height);
    drawYestodayData(c, data.yestoday, width, height, distance, open);
    drawTodayData(c, data.today, width, height, distance, open);

    var todayL = data.today.length;
    var yestodayL = data.yestoday.length;
    if(todayL === 0) {
        return {
            'width': 0.2 * 0.875,
            'height': (open - parseFloat(data.yestoday[yestodayL - 1].data)) / distance
        }
    }else {
        todayD = data.today[todayL - 1];
        if(todayD.time >= 13) {
            return {
                'width': (0.6 + (parseFloat(todayD.time) - 13) * 0.2) * 0.875,
                'height': (open - parseFloat(todayD.data)) / distance
            }
        }else {
            return {
                'width': (0.2 + (parseFloat(todayD.time) - 9.5) * 0.2) * 0.875,
                'height': (open - parseFloat(todayD.data)) / distance
            }
        }
    }
}

function drawNumber(c, min, max, open, width, height) {
    c.font = "10px";
    c.fillStyle = '#ffffff';
    c.fillText('' + open, 0, 0);
    c.fillText('' + min, 0, height / 2);
    c.fillText('' + max, 0, -height / 2 + 10);
}

function drawTodayData(c, todayData, width, height, distance, open){
    var x;
    var y;
    var time;
    var itemData;
    c.beginPath();
    
    for(var i = 0; i < todayData.length; i++) {
        time = parseFloat(todayData[i].time);
        itemData = parseFloat(todayData[i].data);
        
        if(time >= 13){
            x = width * (0.6 + (time - 13) * 0.2);
        }else {
            x = width * (0.2 + (time - 9.5) * 0.2);
        }
        y = (open - itemData) / distance * height;

        if(i == 0) {
            c.moveTo(x, y);
        }

        c.lineTo(x, y);
    }

    c.strokeStyle = "#ffe700";
    c.stroke();
}

function drawYestodayData(c, yestodayData, width, height, distance, open) {
    var x;
    var y;
    var time;
    var itemData;
    c.beginPath();

    for(var i = 0; i < yestodayData.length; i++) {
        time = parseFloat(yestodayData[i].time);
        
        if(time < 14) {
            continue;
        }

        itemData = parseFloat(yestodayData[i].data);

        x = width * (time - 14) * 0.2;
        y = (open - itemData) / distance * height;

        if(i == 0) {
            c.moveTo(x, y);
        }
        c.lineTo(x, y);
    }

    c.strokeStyle = "#ffffff";
    c.stroke();
}
