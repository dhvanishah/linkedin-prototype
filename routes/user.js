var con = require('./mysql');
con.connect();
/*
 * GET home page.
*/

exports.load = function(req, res){
	if(req.session.data != "" || req.session.data != "undefined"){
		
		var getUser="select user_master.userunkid, user_master.email, user_details.firstname, user_details.lastname,user_details.summary, " +
					" user_master.invitations,user_master.connections,user_master.requested,user_details.image " +
		"	  from user_master inner join user_details on user_master.userunkid = user_details.userunkid  where user_master.email='"+req.session.data+"'";
		
		con.fetch(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					res.send({"msg":"Success","data":results});
					
				}
				else {
					res.send({"msg":"Fail","data":""});
				}
			}  
		},getUser);

	}
	else{
		res.redirect('/');
	}
	
};

exports.details = function(req, res){
	if(req.session.data != "" || req.session.data != "undefined"){
		
		var srch = req.params.search;
		
		req.session.data = "dhvani@gmail.com";
		var getUser = "select  user_master.userunkid as uid,user_master.email, user_details.firstname, user_details.lastname,user_details.summary," +
				"user_education.*,user_job.*, user_skills.* " +
						"from user_master " +
		"left join user_details on user_master.userunkid = user_details.userunkid "+
		"left join user_education on user_master.userunkid = user_education.userunkid  " +
		"left join user_job on user_job.userunkid = user_master.userunkid " +
		"left join user_skills on user_skills.userunkid = user_master.userunkid " +
				"where user_master.email='"+req.session.data+"'";
		
		var getUser = "select  user_master.userunkid as uid,user_master.email, user_details.firstname, user_details.lastname,user_details.summary,user_details.image, " +
					" user_master.invitations,user_master.connections,user_master.requested " +
				" from user_master " +
				" left join user_details on user_master.userunkid = user_details.userunkid " +
				" where user_master.email='"+req.session.data+"'";
		
		var getEducation = "select user_education.* from user_master " +
							"right join user_education on user_master.userunkid = user_education.userunkid  " +
							"where user_master.email='"+req.session.data+"'";
		
		var getJob = "select  user_job.* from user_master " +
						"right join user_job on user_job.userunkid = user_master.userunkid " +
						"where user_master.email='"+req.session.data+"'";
		
		var getSkills = "select  user_skills.* from user_master " +
						"right join user_skills on user_skills.userunkid = user_master.userunkid " +
						"where user_master.email='"+req.session.data+"'";
		
		var finalResult = {};
		
		con.fetch(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					finalResult['details'] = results;
				
				con.fetch(function(err2,resultsEducation){
					if(err2){
						throw err;
					}
					else 
					{
							if(resultsEducation.length > 0)
								finalResult['education'] = resultsEducation;
							else
								finalResult['education'] = '';
									
							
							con.fetch(function(err3,resultsJob){
								if(err3){
									throw err;
								}
								else 
								{
									if(resultsJob.length > 0)
										finalResult['job'] = resultsJob;
									else
										finalResult['job'] = '';
										
									con.fetch(function(err4,resultsSkills){
											if(err4){
												throw err;
											}
											else 
											{
												if(resultsSkills.length > 0){
													finalResult['skills'] = resultsSkills;
													
													
												}
												else {
													finalResult['skills'] = '';
												}
												
												res.send({"msg":"Success","data":JSON.stringify(finalResult)});
											}  
										},getSkills);
								}  
							},getJob);
							
					}  
				},getEducation);
					
				}
				else {
					res.send({"msg":"Fail","data":""});
				}
			}  
		},getUser);

	}
	else{
		res.redirect('/');
	}
	
};

exports.updateeducation = function(req, res){
	console.log("usereducation");
	var reqObj = req.body.data;
	console.log(reqObj);
	var updatedata = {	userunkid: reqObj.userunkid,educationunkid: reqObj.educationunkid, 
			school: reqObj.school,startdate: reqObj.startdate,
			enddate: reqObj.enddate,degree: reqObj.degree,
			field: reqObj.field,grade: reqObj.grade,activities: reqObj.activities,
			description: reqObj.description};
		
		var query = 'UPDATE user_education SET ';
				
						if(reqObj.school != "" && reqObj.school != null)
							query+=' school= "'+reqObj.school+'"';
						
						if(reqObj.startdate != "" && reqObj.startdate != null)
							query+=' ,startdate="'+reqObj.startdate+'"';
						
						if(reqObj.enddate != "" && reqObj.enddate != null)
							query+=' ,enddate= "'+reqObj.enddate+'"';
						
						if(reqObj.degree != "" && reqObj.degree != null)
							query+=' ,degree="'+reqObj.degree+'"';
						
						if(reqObj.field != "" && reqObj.field != null)
							query+=' ,field="'+reqObj.field+'"';
						
						if(reqObj.grade != "" && reqObj.grade != null)
							query+=' ,grade="'+reqObj.grade+'"';
						
						if(reqObj.activities != "" && reqObj.activities != null)
							query+=' ,activities="'+reqObj.activities+'"';
						
						if(reqObj.description != "" && reqObj.description != null)
							query+=' ,description="'+reqObj.description+'"';
					
		query+= ' WHERE userunkid='+reqObj.userunkid+' AND educationunkid='+reqObj.educationunkid;
		
		con.update(function(err,results){
			if(err){
				throw err;
				res.send({"msg":"Error"});
			}
			else
			{
				res.send({"msg":"Success"});
			}
		},query,updatedata);
		
	
};

exports.addeducation = function(req, res){
	console.log("addeducation");
	var reqObj = req.body.data;
	console.log(reqObj);
	var insertdata = {	userunkid: 1,school: reqObj.school,startdate: reqObj.startdate,
			enddate: reqObj.enddate,degree: reqObj.degree,
			field: reqObj.field,grade: reqObj.grade,activities: reqObj.activities,
			description: reqObj.description};
	
	var query="INSERT INTO user_education SET ?";
		
		
		con.insert(function(err,results){
			if(err){
				throw err;
				res.send({"msg":"Error"});
			}
			else
			{
				res.send({"msg":"Success","id":results});
			}
		},query,insertdata);
		
	
};

exports.deleteeducation = function(req, res){
	console.log("deleteeducation");
	var deleteid = req.params.educationid;
	
	var query="DELETE FROM user_education WHERE user_education.educationunkid="+deleteid;
		
	con.deleteRecord(function(err,results){
		if(err){
			throw err;
			res.send({"msg":"Error"});
		}
		else
		{
			res.send({"msg":"Success"});
		}
	},query);
		
};


exports.updatejob = function(req, res){
	console.log("updatejob");
	var reqObj = req.body.data;
	console.log(reqObj);
	var updatedata = {	userunkid: reqObj.userunkid,educationunkid: reqObj.educationunkid, 
			school: reqObj.school,startdate: reqObj.startdate,
			enddate: reqObj.enddate,degree: reqObj.degree,
			field: reqObj.field,grade: reqObj.grade,activities: reqObj.activities,
			description: reqObj.description};
		
		var query = 'UPDATE user_job SET ';
				
						if(reqObj.companyname != "" && reqObj.companyname != null)
							query+=' companyname= "'+reqObj.companyname+'"';
						
						if(reqObj.jobtitle != "" && reqObj.jobtitle != null)
							query+=' ,jobtitle= "'+reqObj.jobtitle+'"';
						
						if(reqObj.location != "" && reqObj.location != null)
							query+=' ,location= "'+reqObj.location+'"';
						
						if(reqObj.startdate != "" && reqObj.startdate != null)
							query+=' ,startdate="'+reqObj.startdate+'"';
						
						if(reqObj.enddate != "" && reqObj.enddate != null)
							query+=' ,enddate="'+reqObj.enddate+'"';
						
						if(reqObj.description != "" && reqObj.description != null)
							query+=' ,description="'+reqObj.description+'"';
					
		query+= ' WHERE userunkid='+reqObj.userunkid+' AND jobunkid='+reqObj.jobunkid;
		
		con.update(function(err,results){
			if(err){
				throw err;
				res.send({"msg":"Error"});
			}
			else
			{
				res.send({"msg":"Success"});
			}
		},query,updatedata);
		
	
};

exports.addjob = function(req, res){
	console.log("addjob");
	var reqObj = req.body.data;
	console.log(reqObj);
	var insertdata = {	userunkid: reqObj.userunkid,companyname: reqObj.companyname,jobtitle: reqObj.jobtitle,location: reqObj.location,startdate: reqObj.startdate,
			enddate: reqObj.enddate,description: reqObj.description};
	
	var query="INSERT INTO user_job SET ?";
		
		
		con.insert(function(err,results){
			if(err){
				throw err;
				res.send({"msg":"Error"});
			}
			else
			{
				res.send({"msg":"Success","id":results});
			}
		},query,insertdata);
		
	
};

exports.deletejob = function(req, res){
	console.log("deletejob");
	var deleteid = req.params.jobid;
	
	var query="DELETE FROM user_job WHERE user_job.jobunkid="+deleteid;
		
	con.deleteRecord(function(err,results){
		if(err){
			throw err;
			res.send({"msg":"Error"});
		}
		else
		{
			res.send({"msg":"Success"});
		}
	},query);
		
};

exports.addskills = function(req, res){
	console.log("deletejob");
	var newskills = req.body.data;
	var tempuserunkid = req.body.userunkid;
	console.log(newskills);
	var query="DELETE FROM user_skills WHERE user_skills.userunkid="+tempuserunkid;
		
	con.deleteRecord(function(err,results){
		if(err){
			throw err;
			res.send({"msg":"Error"});
		}
		else
		{
			for(i=0;i<newskills.length;i++)
			{
				if((newskills[i]) != "" && (newskills[i]) != "undefined" && (newskills[i]) != null){
					var insertdata = {	userunkid: tempuserunkid, skill: newskills[i].skill };
				
					var query="INSERT INTO user_skills SET ?";
					
					
						con.insert(function(err,results){
							if(err){
								throw err;
								res.send({"msg":"Error"});
							}
						},query,insertdata);
				}
			}
			
		}
	},query);
	
	res.send({"msg":"Success"});
		
};
exports.search = function(req, res){
	if(req.session.data != "" || req.session.data != "undefined"){
		
		var srch = req.params.search;
		
		var getUser = "select  user_master.userunkid," +
					" user_master.invitations,user_master.connections,user_master.requested," +
					" user_master.email, user_details.firstname, user_details.lastname," +
					" group_concat(user_education.school) as schools, " +
					" group_concat(user_education.degree) as degrees, " +
					" group_concat(user_job.companyname) as companies," +
					" group_concat(user_skills.skill) as skills" +
				" from user_master " +
				" left join user_details on user_master.userunkid = user_details.userunkid" +
				" left join user_education on user_education.userunkid = user_master.userunkid " +
				" left join user_job on user_job.userunkid = user_master.userunkid " +
				" left join user_skills on user_skills.userunkid = user_master.userunkid " +
				" where user_master.email LIKE '%"+srch+"%'"+
				" OR user_details.firstname LIKE '%"+srch+"%'"+
				" OR user_details.lastname LIKE '%"+srch+"%'" +
				" group by userunkid";
		
		
		
		var finalResult = {};
		
		con.fetch(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					finalResult['details'] = results;
					res.send({"msg":"Success","data":JSON.stringify(results)});
				}
				else {
					res.send({"msg":"Fail","data":""});
				}
			}  
		},getUser);

	}
	else{
		res.redirect('/');
	}
	
};

exports.invite = function(req, res){
		var userunkid = req.params.userunkid;
		var requestedid = req.params.requestedid;
		
		var query1 = 'UPDATE user_master SET requested = concat(ifnull(requested,""), "<-sep->'+requestedid+
		'") WHERE user_master.userunkid='+userunkid;
		
		con.update(function(err,results){
			if(err){
				throw err;
				res.send({"msg":"Error"});
			}
			else
			{
				var query2 = 'UPDATE user_master SET invitations = concat(ifnull(invitations,""), "<-sep->'+userunkid+
				'") WHERE user_master.userunkid='+requestedid;
				
				con.update(function(err,results){
					if(err){
						throw err;
						res.send({"msg":"Error"});
					}
					else
					{
						var query2 = 'UPDATE user_master SET requested = concat(ifnull(requested,""), "<-sep->'+requestedid+
						'") WHERE user_master.userunkid='+userunkid;
						
						res.send({"msg":"Success"});
					}
				},query2);
			}
		},query1);
};

exports.accept = function(req, res){
	var userunkid = req.params.userunkid;
	var invitedid = req.params.invitedid;
	
	var query1 = 'UPDATE user_master SET connections = concat(ifnull(connections,""), "<-sep->'+invitedid+
	'") WHERE user_master.userunkid='+userunkid;
	
	con.update(function(err,results){
		if(err){
			throw err;
			res.send({"msg":"Error"});
		}
		else
		{
			var query2 = 'UPDATE user_master SET connections = concat(ifnull(connections,""), "<-sep->'+userunkid+
			'") WHERE user_master.userunkid='+invitedid;
			
			con.update(function(err,results){
				if(err){
					throw err;
					res.send({"msg":"Error"});
				}
				else
				{
					
					res.send({"msg":"Success"});
				}
			},query2);
		}
	},query1);
};

exports.getconnections = function(req, res){
	
	var userunkid = req.params.userunkid;	
	var query1 = "select user_master.connections from user_master where user_master.userunkid = "+userunkid; 
		con.fetch(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log(results);
					
					var con_array = (results[0].connections != null)?(results[0].connections).split("<-sep->").map(Number):"";
					var query2 = "select user_master.userunkid, user_master.email, user_details.firstname, user_details.lastname " +
							" from user_master" +
							" inner join user_details ON user_master.userunkid = user_details.userunkid" +
							" WHERE user_master.userunkid = "
					for(i=0;i<con_array.length;i++)
					{
						 
						if(i==0){
							query2 += con_array[i];
						}
						else{
							query2 += " OR user_master.userunkid = "+con_array[i];
						}
					}
					
					con.fetch(function(err2,results2){
						if(err){
							throw err;
						}
						else 
						{
							res.send({"msg":"Success","data":results2});
						}
					},query2);
				}
					
				else {
					res.send({"msg":"Fail","data":""});
				}
			}  
		},query1);

};

exports.getinvitations = function(req, res){
	
	var userunkid = req.params.userunkid;	
	var query1 = "select user_master.invitations from user_master where user_master.userunkid = "+userunkid; 
		con.fetch(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log(results);
					
					var con_array = (results[0].invitations != null)?(results[0].invitations).split("<-sep->").map(Number):"";
					var query2 = "select user_master.userunkid, user_master.email, user_details.firstname, user_details.lastname " +
							" from user_master" +
							" inner join user_details ON user_master.userunkid = user_details.userunkid" +
							" WHERE user_master.userunkid = "
					for(i=0;i<con_array.length;i++)
					{
						 
						if(i==0){
							query2 += con_array[i];
						}
						else{
							query2 += " OR user_master.userunkid = "+con_array[i];
						}
					}
					
					con.fetch(function(err2,results2){
						if(err){
							throw err;
						}
						else 
						{
							res.send({"msg":"Success","data":results2});
						}
					},query2);
				}
					
				else {
					res.send({"msg":"Fail","data":""});
				}
			}  
		},query1);

};

exports.updateUserValue = function(req, res){
	var userunkid = req.body.userunkid;
	console.log("*****");
	console.log(req.body.firstname);
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var summary = req.body.summary;
	var image = req.body.image;
	
	var query = 'UPDATE user_details SET ';
	
	if(firstname != "" && firstname != "undefined" && firstname != null)
		query += ' firstname = "'+firstname+'"';
	
	if(firstname != "" && firstname != "undefined" && firstname != null && lastname != "" && lastname != "undefined" && lastname != null)
		query += ',';
	
	if(lastname != "" && lastname != "undefined" && lastname != null)
		query += ' lastname = "'+lastname+'"';
		
	if(summary != "" && summary != "undefined" && summary != null)
		query += ' summary = "'+summary+'"';
	
	if(image != "" && image != "undefined" && image != null)
		query += ' image = "'+image+'"';
	
	
	
	query+= ' WHERE user_details.userunkid = '+userunkid;
	
	con.update(function(err,results){
		if(err){
			throw err;
			res.send({"msg":"Error"});
		}
		else
		{
			
			res.send({"msg":"Success"});
		}
	},query);
};
