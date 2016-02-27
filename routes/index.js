var con = require('./mysql');
con.connect();
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'LinkedIn',errMsg: "" });
};


exports.login = function(req, res){
	
	try {
		var param = req.body;
		var errMsg = '';
		
		if(param.btnRegister != "Join Now"){
			
			if(param.inputEmail == "" || param.inputEmail == "undefined"){
				errMsg += 'Email is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else if(param.inputPassword == "" || param.inputPassword == "undefined"){
				errMsg += 'Password is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else{
				var validateUser="select (userunkid),logindatetime from user_master where email='"+param.inputEmail+"' AND password='"+param.inputPassword+"'";
				console.log("Query is:"+validateUser);
				
				con.fetch(function(err,results){
					if(err){
						throw err;
					}
					else 
					{
						if(results.length > 0){
							console.log("valid Login");
							
							req.session.data =  param.inputEmail;
							req.session.lastlogin =  results[0].logindatetime;
							
							var query2 = 'UPDATE user_master SET logindatetime = NOW() WHERE  user_master.userunkid = '+results[0].userunkid;
							
							con.update(function(err,results){
								if(err){
									throw err;
									res.send({"msg":"Error"});
								}
								else
								{
									
									//res.send({"msg":"Success"});
									res.redirect('/home');
								}
							},query2);
							
							//req.session.data = {};
							
							//req.session.data.firstname = results[0].firstname;//req.session.firstname = results[0].firstname;
							//req.session.data.lastname = results[0].lastname;//req.session.lastname = results[0].lastname;
							
						//	res.send({"login":"Success"});
						}
						else {    
							
							console.log("Invalid Login");
							//res.send({"errMsg":"Fail"});
							res.render('index', { title: 'LinkedIn',errMsg: "Invalid Login" });
						}
					}  
				},validateUser);
			}
		}
		else{
			console.log("0000000");
			if(param.txtEmail == "" || param.txtEmail == "undefined"){
				errMsg += 'Email is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else if(param.txtPassword == "" || param.txtPassword == "undefined"){
				errMsg += 'Password is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else if(param.txtFirstName == "" || param.txtFirstName == "undefined"){
				errMsg += 'First Name is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else if(param.txtLastName == "" || param.txtLastName == "undefined"){
				errMsg += 'Last Name is required.';
				res.render('index', { title: 'LinkedIn',errMsg: errMsg });
			}
			else
			{
				var checkUser="select (userunkid) from user_master where email='"+param.txtEmail+"'";
				
				con.fetch(function(err,result){
					console.log("test");
					if(err){
						throw err;
					}
					else 
					{
						console.log("RESULT");
						if(result.length > 0){
							console.log("IF");
							res.render('index', { title: 'LinkedIn',errMsg: "User Already Exists." });
							
						}
						else { 
						  var insertdata  = {"email": param.txtEmail, "password": param.txtPassword, "logindatetime" : new Date()};
							var newUser="INSERT INTO user_master SET ?";
							
							con.insert(function(err,results){
								console.log(results);
								if(err){
									throw err;
								}
								else 
								{
									var insertdetaildata  = {userunkid: results, firstname: param.txtFirstName, lastname: param.txtLastName};
									var userDetails="INSERT INTO user_details SET ?";
									
									req.session.data =  param.txtEmail;
									req.session.lastlogin =  "";
									
									con.insert(function(err,results){
										if(err){
											throw err;
										}
										else
										{
											res.redirect('/home');
										}
									},userDetails,insertdetaildata);
									
								}  
							},newUser,insertdata);
						}
					}  
				},checkUser);
			}
			
			//res.render('index', { title: 'LinkedIn',errMsg: errMsg });
		}
		
	}
	catch(err) {
		console.log(err);
		res.send({"errMsg":err});
	}
	
	
};	
