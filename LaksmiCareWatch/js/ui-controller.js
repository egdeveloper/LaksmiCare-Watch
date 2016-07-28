var pagePos = 0;
var pageCount = 3;
window.guid = null;
window.user = null;
var d1 = document.getElementById("heart-rate");
var d2 = document.getElementById("peak2peak");
var counter = 0;



$(document).ready(function() {
//	genDeviceId();
	window.guid = generateGUID();
	console.log(window.guid);
	alert(window.guid);
    document.addEventListener("rotarydetent", function(e) {
        if (e.detail.direction == "CW") {
            $("#page" + pagePos).removeClass("ui-page-active");
            pagePos = (++pagePos) % pageCount;
            $("#page" + pagePos).addClass("ui-page-active");
        } else if (e.detail.direction == "CCW") {
            $("#page" + pagePos).removeClass("ui-page-active");
            pagePos = pagePos != 0 ? (--pagePos) % pageCount : pageCount - 1;
            $("#page" + pagePos).addClass("ui-page-active");
        }
    }, false);
   /* if (window.guid)
        $("#device-id-label").val(window.guid);
    else
        window.guid = generateGUID();
    findUserByToken(window.guid, function(data) {
        window.user = data;
        alert("User registered!");
    }, function() {
    	alert("Device not registered at system");
    });
*/
});

function genDeviceId(){
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	if (!window.indexedDB) {
	    window.alert("OOPS! Token storage is unavailable!");
	    tizen.application.getCurrentApplication().exit();
	}
	var req = window.indexedDB.open("tokens", 10);
	req.onupgradeneeded = function(event){
		var db = event.target.result;
		var tokenStore = db.createObjectStore("tokens", { keyPath: "id" });
		tokenStore.createIndex("guid", "guid", { unique: false });
	};
	req.onsuccess = function(event){
		var db = event.target.result;
		var tokens = db.transaction(["tokens"], "readwrite").objectStore("tokens");
		req = tokens.get("1");
		req.onsuccess = function(event){
			if(req.result)
					console.log(req.result.guid);
			else
				tokens.put({id : "1", guid : generateGUID()});
			alert("Device id registered!");
		};
		/*req.onerror = function(event){
			tokens.add({"id" : "1", "guid" : generateGUID()});
			alert("Device id not registered!");
		};*/
	};
	req.onerror = function(ev){
		alert("Can not open db");
	};
	
}
function resetDeviceId() {
	
}

function startHeartMonitor() {
    tizen.humanactivitymonitor.start("HRM", onchangedCB);
}

function onchangedCB(hrmInfo) {
    d1.innerHTML = "Heart Rate: " + hrmInfo.heartRate + "<br/>";
    d2.innerHTML = "Peak-to-peak interval: " + hrmInfo.rRInterval + " milliseconds";
    counter++;
    if (counter > 10 && hrmInfo.heartRate > 0) {
        tizen.humanactivitymonitor.stop("HRM");
        console.log("heart");
        console.log("geo");
        var alarm = {
            heartRate: 70,  
            measureDate: "21 January",
            gpsPosition: {
                latitude: 45,
                logitude: 56
            }
        };
        
        sendAlarm(window.guid, alarm, function() {
         	alert("Alarm sended! Wait for help!");
         }, function() {
         	alert("Can not send alarm!");
         });
        navigator.geolocation.getCurrentPosition(function(loc) {
        	console.log("geo");
            var alarm = {
                heartRate: 70,
                measureDate: "21 January",
                gpsPosition: {
                    latitude: loc.coords.latitude,
                    logitude: location.coords.longitude
                }
            };
            
            sendAlarm(window.guid, alarm, function() {
             	alert("Alarm sended! Wait for help!");
             }, function() {
             	alert("Can not send alarm!");
             });
    	
            /*window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        	if (!window.indexedDB) {
        	    window.alert("OOPS! Token storage is unavailable!");
        	    tizen.application.getCurrentApplication().exit();
        	}
        	var tokens = window.indexedDB.transaction(["tokens"]).objectStore("tokens");
        	var req = tokens.get("1");
        	req.onsuccess = function(event){
        		sendAlarm(req.result.guid, alarm, function() {
                 	alert("Alarm sended! Wait for help!");
                 }, function() {
                 	alert("Can not send alarm!");
                 });
        	}
            sendAlarm(window.guid, alarm, function() {
             	alert("Alarm sended! Wait for help!");
             }, function() {
             	alert("Can not send alarm!");
             });*/
        });
            
    }
}