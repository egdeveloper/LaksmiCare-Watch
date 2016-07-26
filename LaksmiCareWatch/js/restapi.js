var user;
const HOST = "http://146.185.143.85:8080";


function authUser(login, password){
	$.ajax({
		url: HOST + "/user?login=" + login + "&password=" + password,
		method: "POST"
	}).done(function(data){
		return data;
	}).fail(function(){
		
	});
}

function getConfident(){
	$.ajax({
		url: HOST + "/user/" + user.id,
		method: "GET"
	}).done(function(data){
		return data;
	}).fail(function(){
		
	});
}

function sendAlarm(alarmSOS){
	$.ajax({
		url: HOST + "/user/" + user.id + "/health/alarm",
		data: alarmSOS,
		method: "POST"
	}).done(function(data){
		console.log(data);
	}).fail(function(){
		
	});
}

function sendHeartStat(){
	$.ajax({
		url: HOST + "/user/" + user.id + "/health/stat",
		data: alarmSOS,
		method: "POST"
	}).done(function(data){
		console.log(data);
	}).fail(function(){
		
	});
}

function onAuthSuccess(){
	
}

function onAuthFail(){
	
}