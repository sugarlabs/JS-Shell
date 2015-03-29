var http=require('http');
var util=require('util');
var querystring=require('querystring');
var exec = require('child_process').exec;

var server=http.createServer(function(req,res){
    res.writeHead(200);
    if (req.method=='GET'){    	
        res.end('<html><body><form method="POST" name="form1">Enter Text:<input name="txtInput" type="text" id="txtInput"/><button type="submit" id="btnPost">Post Data</button></form></body></html>');
    }else{

        var chunk = '';
        req.on('data', function (data) {
            chunk += data;
        });
        req.on('end', function () {
            console.log(chunk + "<-Posted Data Test");

            var child = exec(querystring.parse(chunk).txtInput);
			child.stdout.on('data', function(data) {
			    console.log('stdout: ' + data);
			    res.write(data);
			});
			child.stderr.on('data', function(data) {
			    console.log('stdout: ' + data);
			    res.write(data);
			});
			child.on('close', function(code) {
			    console.log('closing code: ' + code);
			    res.end("\nProcess Ended.")
			    //res.end('<br /><form method="POST" name="form1">Enter Text:<input name="txtInput" type="text" id="txtInput"/><button type="submit" id="btnPost">Post Data</button></form>');
			});

            //res.end(util.inspect(querystring.parse(chunk)));
        });

    }
}).listen(8080);
