var express = require('express')
  , cors = require('cors')
  , app = express();
var bodyParser = require("body-parser");
var http=require('http');
var util=require('util');
var fs = require('fs');

var querystring=require('querystring');
var exec = require('child_process').exec;
 
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
 
app.get('/', function(req, res, next){
  res.json({msg: 'This is a message.'});
});

app.post('/save',function(req,res,next){
	
	var msg = new Object();
	msg.data = '';

	var chunk = '';
    req.on('data', function (data) {
        chunk += data;

        var frmData = querystring.parse(chunk);
        if(frmData.filename!="")
        {
        	//SAVE THE CODE
			fs.writeFile(frmData.filename, frmData.codeInput, function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    msg.data += "The file was saved!";
			    res.write(JSON.stringify(msg));
				res.end("");
			}); 
			
        }
        else
        {
        	

        }
    });
    req.on('end', function () {
        //res.end(util.inspect(querystring.parse(chunk)));
    });

});
app.post('/run',function(req,res,next){
	
	var msg = new Object();
	msg.data = '';

	var chunk = '';
    req.on('data', function (data) {
        chunk += data;
    });
    req.on('end', function () {
        var frmData = querystring.parse(chunk);
        if(frmData.filename!="")
        {
        	//SAVE THE CODE
			fs.readFile(frmData.filename, 'utf8', function (err,data) {
				if (err) {
					msg.data += "Execution Failed!";
					res.write(JSON.stringify(msg));
					res.end("");
					return console.log(err);
				}
				console.log(data);
				var child;
				if(frmData.language == 'c')
				{
					child = exec("gcc "+frmData.filename);
					child.on('close', function(code) {
						if(code == 0)
					    	msg.data += "Compilation Successful...\n";
					    child = exec("./a.out");
					    child.stdout.on('data', function(data) {
						    console.log('stdout: ' + data);
						    msg.data += data;
						});
						child.stderr.on('data', function(data) {
						    console.log('stdout: ' + data);
						    // res.write(data);
						    msg.data += data;
						});
						child.on('close', function(code) {
						    console.log('closing code: ' + code);
						    console.log(msg);
						    res.write(JSON.stringify(msg));
						    res.end("");
						});
					});
				}
				else if(frmData.language == 'js')
				{
					console.log("Hello");
					child = exec("node "+frmData.filename);
					child.stdout.on('data', function(data) {
					    console.log('stdout: ' + data);
					    msg.data += data;
					});
					child.stderr.on('data', function(data) {
					    console.log('stdout: ' + data);
					    // res.write(data);
					    msg.data += data;
					});
					child.on('close', function(code) {
					    console.log('closing code: ' + code);
					    console.log(msg);
					    res.write(JSON.stringify(msg));
					    res.end("");
					});
				}

				if(!child)
				{
					console.log("Somethings Wrong");
				}
				else
				{
					
				}
				
	        	
			});
			
        }
    });
});
app.listen(9090, function(){
  console.log('CORS-enabled web server listening on port 9090');
});
