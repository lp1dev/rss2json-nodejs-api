var express = require('express');
var request = require('request');
var app = express();
var router = express.Router();
var port = process.env.PORT || 8002;
var parseString = require('xml2js').parseString;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/rss2json', function(req, res) {
    if (req.query.feed == undefined)
	return res.json({error:"You must specify a feed parameter"});
    request(req.query.feed, function (error, response, body){
	if (!error && response.statusCode == 200) {
	    body = body.replace("html_content");
	    parseString(body, function (err, result) {
		if (err != undefined)
		    return res.json(err);
		return res.json(result);
	    });
	}
	else
	    return res.json({error:"unable to reach url"})
    });
});

app.use('/', router);
app.listen(port);
console.log('Listening on port ' + port);