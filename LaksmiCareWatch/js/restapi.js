
/*const HOST = "http://146.185.143.85:8080";*/
const HOST = "http://192.168.0.156:8080";

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

function sendState(token, state, onSuccess, onFail){
	console.log(HOST + "/user/health/state?token=" + token);
	$.ajax({
		url: HOST + "/user/health/state?token=" + token,
		method: "POST",
		data: JSON.stringify(state),
		headers: {
			"Content-Type" : "application/json"
		},
		success: onSuccess,
		error: onFail
	});
}

function sendHeartStat(user, onSuccess, onFail){
	$.ajax({
		url: HOST + "/user/" + user.id + "/health/stat",
		data: alarmSOS,
		method: "POST"
	}).done(function(data){
		console.log(data);
	}).fail(function(){
		
	});
}

function findUserByToken(token, onSuccess, onFail){
	console.log("=> findUserByToken() started");
	$.ajax({
	    url: HOST + "/user/credentials?token=" + token,
	    type: "GET",
	    dataType: 'json',
	    success : function(data){
	    	onSuccess(data);
	    }
	}).fail(onFail);
}