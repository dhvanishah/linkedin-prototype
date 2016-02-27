var con = require('./mysql');
con.connect();
/*
 * GET home page.
*/

exports.load = function(req, res){
	if(req.session.data != "" || req.session.data != "undefined"){
		
		var d = new Date(req.session.lastlogin);
		var dateStr = d.toDateString();
		var timeStr = d.toTimeString()
		 
		res.render('home', { title: 'Home', 'lastlogin' : dateStr+" "+timeStr});

	}
	else{
		res.redirect('/');
	}
	
};

