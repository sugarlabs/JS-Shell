// server.js
var http = require('http');
var visits = 0;
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    visits += 1;
    var msg = 'Visits: ' + visits;
    res.end(msg + '\n'); console.log(msg);
    if(visits == 5) {
        process.exit();
    }
}).listen(8080);
console.log('Server running at http://127.0.0.1:8080/');