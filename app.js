/**
 * Module dependencies.
 */

var express = require('express')
  , session = require('express-session')
  , routes = require('./routes')
  , user = require('./routes/user')
  , home = require('./routes/home')
  , mysql = require('mysql')
  , http = require('http')
  , path = require('path');

var app = express();

app.use(express.bodyParser());
app.configure(function(){
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'keyboard cat', cookie: { maxAge: 3600000000 }}));
});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/session',function(req,res){
	
	if(req.session.data){
		res.send(JSON.stringify({"response" : req.session.data}));
	}
	else{
		res.send(JSON.stringify({"response" : "No Session Data to GET"}));
	}
});

app.post('/api/session',function(req,res){
	console.log("SESSION DISPLAY");
	console.log(req.session.data);
	
	if(req.session.data){
		//req.session.data = req.param("sessionData");
		res.send(JSON.stringify({"response" : req.session.data}));
	}
	else{
		//req.session.data = req.param("sessionData");
		res.send(JSON.stringify({"response" : req.session.data}));
	}
});

app.del('/api/session',function(req,res){
	if(req.session.data){
		req.session.destroy();
		res.send(JSON.stringify({"response" : "Session Destroyed"}));
	}else{
		res.send(JSON.stringify({"response" : "No Session Data to DELETE"}));
	}
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.login);
app.get('/home', home.load);
app.get('/user', user.load);
app.get('/userdetails', user.details);
app.get('/search/:search', user.search);
app.post('/updateeducation', user.updateeducation);
app.post('/addeducation', user.addeducation);
app.delete('/deleteeducation/:educationid',user.deleteeducation);
app.get('/invite/:userunkid/:requestedid', user.invite);
app.get('/accept/:userunkid/:invitedid', user.accept);
app.get('/connections/:userunkid', user.getconnections);
app.get('/invitations/:userunkid', user.getinvitations);
app.post('/uservalue', user.updateUserValue);

app.post('/updatejob', user.updatejob);
app.post('/addjob', user.addjob);
app.delete('/deletejob/:jobid',user.deletejob);

app.post('/addskills', user.addskills);


http.createServer(app).listen(app.get('port'), function(){
  console.log('linkedIn client server listening on port ' + app.get('port'));
});