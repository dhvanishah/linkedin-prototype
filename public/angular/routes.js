var app = angular.module('test', ['ngRoute']);


app.config(['$routeProvider',
            function($routeProvider,$locationProvider) {
				$routeProvider.
				when('/home', {
					templateUrl: 'home.html',
					controller: 'homeController'
     
				}).when('/profile', {
					templateUrl: 'profile.html',
					controller: 'profileController'
				})
				.when('/connections', {
					templateUrl: 'connections.html',
				    controller: 'connectionsController'
				}).
				when('/home/search', {
					templateUrl: 'search.html',
					controller: 'searchController'
     
				}).when('/profile/search', {
					templateUrl: 'search.html',
					controller: 'searchController'
				}).
                otherwise({
                  redirectTo: '/home',
                });
              //$locationProvider.html5Mode(true);
          }

          ]);



app.controller('searchController',function($scope,$http){
	$scope.usermasterdata = jQuery.parseJSON(sessionStorage.getItem("user"));
	
	$scope.usermasterdata.userunkid = String($scope.usermasterdata.userunkid);
	var srch = $("#txtSearch").val();
	
	$http.get("/search/"+srch).success(function(response){
		if(($("#txtSearch").val()) == "")
			window.location = ("/home");
		
		if(response.msg == "Success")
		{
			var searchdata = eval(response.data);
			$(searchdata).each(function(key,srchitm){
				srchitm.invitations = (srchitm.invitations != null)?(srchitm.invitations).split("<-sep->").map(Number):"";
				srchitm.connections = (srchitm.connections != null)?(srchitm.connections).split("<-sep->").map(Number):"";
				srchitm.requested = (srchitm.requested != null)?(srchitm.requested).split("<-sep->").map(Number):"";
			});
			console.log(searchdata);
			$scope.searchdata = searchdata;
		}
		else
		{
			$("#divSearch").append('<div class="alert alert-block"><h4>No Results Found!</h4></div>');
		}
	});
	
	$scope.invite = function(obj){
		console.log("invite");
		
		var usersess = jQuery.parseJSON(sessionStorage.getItem("user"));
		console.log(usersess);
		$http.get("/invite/"+usersess[0].userunkid+"/"+obj.searchitem.userunkid).success(function(response){
			$("#btnInvite"+obj.searchitem.userunkid).hide();
			$("#btnRequested"+obj.searchitem.userunkid).show();
		});
	},
	$scope.accept = function(obj){
		console.log("accept");
		
		var usersess = jQuery.parseJSON(sessionStorage.getItem("user"));
		
		$http.get("/accept/"+usersess[0].userunkid+"/"+obj.searchitem.userunkid).success(function(response){

			$("#btnAccept"+obj.searchitem.userunkid).hide();
			$("#btnConnected"+obj.searchitem.userunkid).show();
		});
	},
	$scope.reject = function(obj){
		console.log("reject");
		
		var usersess = jQuery.parseJSON(sessionStorage.getItem("user"));
		
		$http.get("/reject/"+usersess[0].userunkid+"/"+obj.searchitem.userunkid).success(function(response){
			console.log(response);
		});
	}
});

app.controller('connectionsController',function($scope,$http){
	console.log("connectionsController");
	//$scope.usermasterdata = jQuery.parseJSON(sessionStorage.getItem("user"));
	var usersess = jQuery.parseJSON(sessionStorage.getItem("user"));
	$http.get('/connections/'+usersess[0].userunkid).success(function(response){
		$scope.connections= response.data;
	//	console.log(response);
		
	});
});


app.controller('logoutController',function($scope){
	console.log("logoutController");
	$http({
        method: 'DELETE',
        url: '/api/session',
        
     }).success(function(response){
       
        console.log(response);
        window.location = '/';
    }).error(function(error){
        alert("error");
    });
});

app.controller('homeController', function($scope,$http) {
	$http.get("/user").success(function(response){
		$scope.homeuserdata = response.data[0];
		console.log($scope.homeuserdata);
		console.log("here");
		console.log(JSON.stringify(response.data));
		sessionStorage.setItem("user", JSON.stringify(response.data));	
	});
	
	
	$scope.logout = function() {
		$http({
	        method: 'DELETE',
	        url: '/api/session',
	        
	     }).success(function(response){
	       
	        console.log(response);
	        window.location = '/';
	    }).error(function(error){
	        alert("error");
	    });
	};
	
});



app.controller('profileController', function($scope,$http) {
	
	$scope.logout = function() {
		$http({
	        method: 'DELETE',
	        url: '/api/session',
	        
	     }).success(function(response){
	       
	        console.log(response);
	        window.location = '/';
	    }).error(function(error){
	        alert("error");
	    });
	};
	
	var profileObj = {'firstname':'', 'lastname':'', 'displaypic':'', 'phone':'', 'address':'', 'Im':'', 'twitterid':'', 'website':''};
	var educationObj = {'school':'','startdate':'','enddate':'', 'degree':'', 'field':'','grade':'','activities':'','description':''};
	var jobObj = {'companyname':'','jobtitle':'','locaiton':'','startdate':'','enddate':'','description':'','currentjob':''};
	var skills = {'skill':'','skillorder':''};
	//$scope.userdetails = {"profile" : [profileObj], "education" : [educationObj], "job" : [jobObj], "skills" : [skills]}; 
	
	$(":file").change(function () {
 		alert(1);
                if (this.files && this.files[0]) {
                    var reader = new FileReader();
                    reader.onload = onImageLoad;
                    reader.readAsDataURL(this.files[0]);

                    console.log(reader.readAsDataURL(this.files[0]));
                }
            });


 		function onImageLoad(e) {
            console.log(e.target.result);
            $scope.userdetails.image =  e.target.result;
            $http.post('/uservalue',{userunkid: $scope.userdetails.uid,image: $scope.userdetails.image})
    		.success(function(response){
    			
    		});
            $('#imgUser').attr('src', e.target.result);
        };
	
	$scope.userdetails = {};
		$http.get('/userdetails').success(function(response){
			var userdata = jQuery.parseJSON(response.data);
			$scope.userdetails = (userdata.details)[0];
			$scope.educationdata = userdata.education;
			$scope.jobdata = userdata.job;
			$scope.skills = (userdata.skills != "")?userdata.skills:[];
			console.log($scope.userdetails);
		});
		
	$scope.editName = function(){
		$("#divFullName").hide();
		$("#divEditName").show();
	},
	$scope.editImage = function(){
		//console.log(obj);
		return false;
		if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);

            //console.log(reader.readAsDataURL(this.files[0]));
        }
		 var canvas = document.getElementById('myCanvas');
	        var context = canvas.getContext('2d');

	        // load image from data url
	        var imageObj = new Image();
	        imageObj.onload = function() {
	          context.drawImage(this, 0, 0);
	        };

	        imageObj.src = dataURL;
	},
	$scope.saveName = function(){
		console.log($scope.userdetails);
		$http.post('/uservalue',{userunkid: $scope.userdetails.uid,firstname: $scope.userdetails.firstname,lastname: $scope.userdetails.lastname})
		.success(function(response){
			$("#divFullName").show();
			$("#divEditName").hide();
		});
		
	},
	
	$scope.editSummary = function(){
		$("#divSummary").hide();
		$("#divEditSummary").show();
	},
	$scope.cancelSummary = function(){
		$("#divSummary").show();
		$("#divEditSummary").hide();
	},
	$scope.saveSummary = function(){
		$http.post('/uservalue',{userunkid: $scope.userdetails.uid,summary: $scope.userdetails.summary})
		.success(function(response){
			$("#divSummary").show();
			$("#divEditSummary").hide();
		});
		
	},
	$scope.editEducation = function(obj){
		$scope.editEducationObj = obj.education;
		//$("#divEducation").hide();
		//$("#divEditEducation").show();
	},
	$scope.addEducation = function(obj){
		console.log(($scope.educationdata));
		 $scope.editEducationObj = {'userunkid':($scope.educationdata)[0].userunkid,'school':'','startdate':null,'enddate':null, 'degree':'', 'field':'','grade':'','activities':'','description':''};
		//$("#divEducation").hide();
		//$("#divEditEducation").show();
	};
	
	
	$scope.saveEducation = function(){
		console.log($scope.editEducationObj);
		if($scope.editEducationObj.educationunkid != "" && $scope.editEducationObj.educationunkid != "undefined" && $scope.editEducationObj.educationunkid != null)
		{
			$http.post('/updateeducation', {data: $scope.editEducationObj}).
			  success(function(data, status, headers, config) {
			 
			//   $("#divEducation").show();
				//$("#divEditEducation").hide();
				  $('#divEditEducation').modal('hide');
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
		}
		else
		{
			$http.post('/addeducation', {data: $scope.editEducationObj}).
			  success(function(data, status, headers, config) {
				  var len = $scope.educationdata.length;
				  $scope.editEducationObj.educationunkid = data.id;
				  $scope.educationdata[len] = $scope.editEducationObj;
				  console.log($scope.educationdata);
				  
			   $("#divEducation").show();
				$("#divEditEducation").hide();
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
		}
	};

	$scope.deleteEducation = function(obj){
		var deleteEducationId = obj.education.educationunkid;
		var  deleteindex= null;
		
		$($scope.educationdata).each(function(index,obj){
			if(obj.educationunkid == deleteEducationId)
				deleteindex=index;
		});
		
		 delete $scope.educationdata[deleteindex];
		 console.log($scope.educationdata);
		
		$http.delete('/deleteeducation/'+deleteEducationId+'', {deleteid: deleteEducationId}).
		  success(function(data, status, headers, config) {
			  alert("Record Deleted Successfully");
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	
	$scope.cancelEducation = function(){
		// $("#divEducation").show();
			//$("#divEditEducation").hide();
	};
	$scope.editJob = function(obj){
		$scope.editJobObj = obj.job;
		//$("#divJob").hide();
		//$("#divEditJob").show();
	};
	
	$scope.addJob = function(obj){
		console.log(($scope.jobdata));
		 $scope.editJobObj = {'userunkid':($scope.jobdata)[0].userunkid,'companyname':'','jobtitle':'','location':'','startdate':null,'enddate':null,'description':''};
		//$("#divJob").hide();
		//$("#divEditJob").show();
	};
	
	
	$scope.saveJob = function(){
		console.log($scope.editJobObj);
		if($scope.editJobObj.jobunkid != "" && $scope.editJobObj.jobunkid != "undefined" && $scope.editJobObj.jobunkid != null)
		{
			$http.post('/updatejob', {data: $scope.editJobObj}).
			  success(function(data, status, headers, config) {
				  $('#divEditJob').modal('hide')
			 //  $("#divJob").show();
				//$("#divEditJob").hide();
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
		}
		else
		{
			$http.post('/addjob', {data: $scope.editJobObj}).
			  success(function(data, status, headers, config) {
				  var len = $scope.jobdata.length;
				  $scope.editJobObj.jobunkid = data.id;
				  $scope.jobdata[len] = $scope.editJobObj;
				  console.log($scope.jobdata);
				  
			   $("#divJob").show();
				$("#divEditJob").hide();
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
		}
	};

	$scope.deleteJob = function(obj){
		var deleteJobId = obj.job.jobunkid;
		var  deleteindex= null;
		
		$($scope.jobdata).each(function(index,obj){
			if(obj.jobunkid == deleteJobId)
				deleteindex=index;
		});
		
		 delete $scope.jobdata[deleteindex];
		 console.log($scope.jobdata);
		
		$http.delete('/deletejob/'+deleteJobId+'', {deleteid: deleteJobId}).
		  success(function(data, status, headers, config) {
			  alert("Record Deleted Successfully");
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
	
	$scope.cancelJob = function(){
		 $("#divJob").show();
			$("#divJob").hide();
	};
	
	 $scope.addSkills = function() {
		 $scope.skills.push({skill:$scope.skilltext});
		 $scope.skilltext = '';
		 console.log($scope.skills);
	 };
	
	 $scope.removeSkill = function(obj){
		 
		 var deleteindex = '';
		 deleteSkill = (obj.skill);
		console.log($scope.skills);
		 $($scope.skills).each(function(index,skillobj){
			 console.log(skillobj.skill);
				if(skillobj.skill == deleteSkill.skill){
					deleteindex=index;
				}
			});
			
			 delete $scope.skills[deleteindex];
			 console.log($scope.skills);
	 };
	 
	 $scope.editSkills = function(obj){
			 $("#divSkillShow").hide();
			 $("#divSkillEdit").show();
		 };
	
	 $scope.saveSkills = function(obj){
		 $http.post('/addskills', {data: $scope.skills,"userunkid": $scope.userdetails.uid}).
		  success(function(data, status, headers, config) {
			  	$("#divSkillShow").show();
				$("#divSkillEdit").hide();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	 };
	 
	$scope.cancelSkills = function(obj){	
		 	$("#divSkillShow").show();
			$("#divSkillEdit").hide();
	};
});

 

