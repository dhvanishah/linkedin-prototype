	var ejs = require('ejs');
var mysql = require('mysql');

function testConnection(){
	var myconnection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'root',
		  database : 'linkedin'
		});
	return myconnection;
}

function Pool(no_of_conn)
{
	this.pool = [];
	for(var i=0; i < no_of_conn; ++i)
        this.pool.push(testConnection()); 
	//console.log(this.pool);
    this.last = 0;
}

Pool.prototype.get = function()
{
	var cli = this.pool[this.last];
	this.last++;
    if (this.last == this.pool.length) 
    	this.last = 0;
    return cli;
}

exports.fetchData = function(callback, sqlQuery) {

	var pool = new Pool(150);
	

	pool.get().query(sqlQuery, function(err, rows, fields) {
	
		if (err) {
			console.log("ERROR: " + err.message);
	} else { 
		console.log("\nSQL Query::" + sqlQuery);
			callback(err, rows);
	
		}
	}); 
		console.log("\nConnection closed in pool..");

	//}
}

function fetch(callback,sqlquery){
	var pool = new Pool(150);
	/*for (var i=0; i < 10; ++i)
	{*/
	
	pool.get().query(sqlquery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		} else { 
			console.log("\nSQL Query::" + sqlquery);
			callback(err, rows);
		}
	}); 
	
	console.log("\nConnection closed in pool..");
}

function insert(callback,sqlquery,insertdata){
	
	var pool = new Pool(150);
	
	pool.get().query(sqlquery, insertdata, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		} else { 
			console.log("\nSQL Query::" + sqlquery);
			console.log("last insert id: "+rows.insertId);
			callback(err, rows.insertId);
		}
	});
	
	console.log("\nConnection closed in pool..");
}

function update(callback,sqlquery,updatedata){
	
	var pool = new Pool(150);
	
	pool.get().query(sqlquery, updatedata, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		} else { 
			console.log("\nSQL Query::" + sqlquery);
			console.log(rows);
			callback(err, rows);
		}
	});
	
	console.log("\nConnection closed in pool..");
}

function deleteRecord(callback,sqlquery,updatedata){
	
	var pool = new Pool(150);
	
	pool.get().query(sqlquery, function(err, rows) {
		if(err){
			console.log("ERROR: " + err.message);
		} else { 
			console.log("\nSQL Query::" + sqlquery);
			console.log(rows);
			callback(err, rows);
		}
	});
	
	console.log("\nConnection closed in pool..");
}

exports.connect=testConnection;
exports.fetch=fetch;
exports.insert=insert;
exports.update=update;
exports.deleteRecord=deleteRecord;