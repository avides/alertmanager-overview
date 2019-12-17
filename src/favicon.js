function drawFaviconNumber(ctx, row, alertsMetric) {
    var color = "#00ff00";
    var number = 0;

    if (alertsMetric.active > 0) {
        color = "#ff0000";
        number = alertsMetric.active;
    } else if (alertsMetric.suppressed > 0) {
        color = "#888888";
        number = alertsMetric.suppressed;
    }

    ctx.fillStyle = color;
    ctx.fillText(number, 0, row * 8);
}

var alertsMetric = { '{{PRODUCTION_URL}}': [], '{{TEST_URL}}': [] };

var canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;

var link = document.createElement('link');
link.type = 'image/x-icon';
link.rel = 'shortcut icon';

document.addEventListener('alertsMetric', function (e) {
    alertsMetric[e.detail.id] = e.detail;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 8px sans-serif';

    drawFaviconNumber(ctx, 1, alertsMetric['{{PRODUCTION_URL}}']);
    drawFaviconNumber(ctx, 2, alertsMetric['{{TEST_URL}}']);

    link.href = canvas.toDataURL("image/x-icon");
    document.getElementsByTagName('head')[0].appendChild(link);
});
