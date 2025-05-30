'use strict';
var express = require('express');
const tasks = require('./sample.json');
var catalyst = require('zcatalyst-sdk-node');
const { NoSQLItem} = require('zcatalyst-sdk-node/lib/no-sql'); 
const { NoSQLReturnValue, NoSQLConditionGroupOperator } = require('zcatalyst-sdk-node/lib/no-sql/enum');
const { NoSQLMarshall, NoSQLEnum } = require('zcatalyst-sdk-node/lib/no-sql'); 
const { NoSQLOperator } = NoSQLEnum; 
var app = express();
app.use(express.json());
app.use(express.static('public'));


app.post('/addtask', async (req, res) => {

	    let {userID, taskName, dueDate, priority, status} = req.body;
		var  capp = catalyst.initialize(req);
		const nosql = capp.nosql(); 
		const table = nosql.table('26818000000134374'); // You table ID
		try {
		const plainInsert = await table.insertItems({   
			item: NoSQLItem.from({  
				"UserID": userID,
				"DueDate": dueDate,
				"TaskName": taskName,
				"Priority": priority,
				"Status": status
			  }),
			return: NoSQLReturnValue.NULL 
		  });
		  res.send({"message": "Thanks! Your task has been successfully inserted."});
		} catch (error) {
			res.status(500);
			res.send({
				"error": "Internal server error occurred. Please try again in some time."
			   });
		}
});
   
app.get('/filtertask', async (req, res) => {

	const query = req.query;
	const parsedData = {
		index_data: {
		  userID: query.userID,
		  taskName: query.taskName,
		  status: query.status
		},
	  };
	const userId = parsedData.index_data.userID;
	console.log(userId);
	var  capp = catalyst.initialize(req);
	const nosql = capp.nosql(); 
	const table = nosql.table('26818000000134374'); 
    
	try {
		
	if(userId != null && parsedData.index_data.taskName === '')
		{
           //Filter using Partition key
		   if (parsedData.index_data.status === '') {
			 return res.status(400).json({ error: "Oops! You forgot to select a status." });
		   }
		   const groupOpInsert = await table.queryTable({
			key_condition: { 
				attribute: 'UserID', 
				operator: NoSQLOperator.EQUALS, 
				value: NoSQLMarshall.makeString(parsedData.index_data.userID) 
			},
			consistent_read: true, 
			limit: 10, 
			forward_scan: true
		});
		let responseData = []
		groupOpInsert.getResponseData().forEach((data) => {
			let itemResponse = {}
			itemResponse["UserID"] = data.item.get("UserID");
			itemResponse["TaskName"] = data.item.get("TaskName");
			itemResponse["DueDate"] = data.item.get("DueDate");
			itemResponse["Priority"] = data.item.get("Priority");
			itemResponse["Status"] = data.item.get("Status");
			responseData.push(itemResponse);
		})
		const filteredData = await filterByStatus(responseData, parsedData);
		res.status(200).send(filteredData);
	}
	else if(userId != null && parsedData.index_data.taskName != null)
	{
    //Filter using Partition key and sort key

	if (parsedData.index_data.status === '') {
		return res.status(400).json({ error: "Oops! You forgot to select a status." });
	}
	var  capp = catalyst.initialize(req);
	const nosql = capp.nosql(); 
	const table = nosql.table('26818000000134374'); 

	try {
		const groupOpInsert = await table.queryTable({

			key_condition: { 
				group_operator: NoSQLConditionGroupOperator.AND, 
				group: [ 
					{ 
						attribute: 'UserID', 
						operator: NoSQLOperator.EQUALS, 
						value: NoSQLMarshall.makeString(parsedData.index_data.userID)
					}, 
					{ 
						attribute: 'TaskName', 
						operator: NoSQLOperator.EQUALS, 
						value: NoSQLMarshall.makeString(parsedData.index_data.taskName)
					} 
				] 
			} ,
			consistent_read: true, 
			limit: 10, 
			forward_scan: true
		});
		
		let responseData = []
		groupOpInsert.getResponseData().forEach((data) => {
			let itemResponse = {}
			itemResponse["UserID"] = data.item.get("UserID");
			itemResponse["TaskName"] = data.item.get("TaskName");
			itemResponse["DueDate"] = data.item.get("DueDate");
			itemResponse["Priority"] = data.item.get("Priority");
			itemResponse["Status"] = data.item.get("Status");
			responseData.push(itemResponse);
		})
		const filteredData = await filterByStatus(responseData, parsedData);
        
		res.send(filteredData);
	} catch (error) {
	console.error("Error fetching task:", error);
    res.status(500).send("Failed to fetch task into NoSQL table");
	}
	}
	else
	{
		return res.send("Kindly enter partiyion key user ID and sort key Taskname");
	}
	} catch (error) {
		res.status(500);
		res.send({
		 "error": "Internal server error occurred. Please try again in some time."
		});
	}
});

app.delete('/deletetask', async(req,res) => {
	

	const query = req.query;
	const parsedData = {
		index_data: {
		  userID: query.userID,
		  taskName: query.taskName
		},
	  };
	    var  capp = catalyst.initialize(req);
		const nosql = capp.nosql(); 
		const table = nosql.table('26818000000134374'); 
	
		try {
		const deletedItems = await table.deleteItems({ 
			keys: NoSQLItem.from({ "UserID": parsedData.index_data.userID , 'TaskName' : parsedData.index_data.taskName})  
		  });
		res.status(200).json({
			message: "Data deleted successfully!",
		});
		} catch (error) {
			res.status(500);
			res.send({
			 "error": "Internal server error occurred. Please try again in some time."
			});
		}
});

app.post('/updatetask', async(req,res) => { 
	    let {UserID, TaskName, DueDate, Priority, Status} = req.body;
		var capp = catalyst.initialize(req);
		const nosql = capp.nosql(); 
		const table = nosql.table('26818000000134374'); 
		try {
            //We used the insert SDK method here to overwrite the existing data, rather than using the update SDK method.
  			const plainInsert = await table.insertItems({   
			item: NoSQLItem.from({  
				"UserID": UserID,
				"DueDate": DueDate,
				"TaskName": TaskName,
				"Priority": Priority,
				"Status": Status
			  }),       
			return: NoSQLReturnValue.NULL 
		  });
		res.send({"message": "Items updated successfully!"});
		} catch (error) {
			res.status(500);
			res.send({
			 "error": "Internal server error occurred. Please try again in some time."
			});
		}
});

async function filterByStatus(data, parseData) {
	const respData = await data.filter((task) => task.Status.toLowerCase() === parseData.index_data.status.toLowerCase() );
	return respData;
}


module.exports = app;