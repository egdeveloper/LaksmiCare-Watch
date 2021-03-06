var pagePos = 0;
var pageCount = 2;
window.guid = null;
window.user = null;
var d1 = document.getElementById("heart-rate");
var d2 = document.getElementById("peak2peak");
var counter = 0;



$(document).ready(function() {
    genDeviceId();
    
    document.addEventListener("rotarydetent", function(e) {
    	if(pagePos == 1){
        	var deviceId = document.getElementById("device-id");
            deviceId.innerHTML = window.guid;
        }
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
    
});

function genDeviceId(){
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	if (!window.indexedDB) {
	    window.alert("OOPS! Token storage is unavailable!");
	    tizen.application.getCurrentApplication().exit();
	}
	var req = window.indexedDB.open("tokens", 1);
	req.onupgradeneeded = function(event){
		var db = event.target.result;
		var tokenStore = db.createObjectStore("tokens", { keyPath: "name" });
		tokenStore.createIndex("guid", "guid", { unique: false });
	};
	req.onsuccess = function(event){
		var db = event.target.result;
		var tokens = db.transaction(["tokens"], "readwrite").objectStore("tokens");
		req = tokens.get("default");
		req.onsuccess = function(event){
			if(req.result){
					window.guid = req.result.guid;
			}
			else{
				var guid = {name: "default", guid : generateGUID()};
				window.guid = guid;
				tokens.put(guid);
				alert("Device id registered! Device id = " + window.guid);
			}
			
		};
	};
	req.onerror = function(ev){
		alert("Can not open db");
	};
	
}
function resetDeviceId() {
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	if (!window.indexedDB) {
	    window.alert("OOPS! Token storage is unavailable!");
	    tizen.application.getCurrentApplication().exit();
	}
	var req = window.indexedDB.open("tokens", 1);
	req.onsuccess = function(event){
		var db = event.target.result;
		var tokens = db.transaction(["tokens"], "readwrite").objectStore("tokens");
		req = tokens.get("default");
		req.onsuccess = function(event){
			if(req.result){
					var guid = {name: "default", guid : generateGUID()};
					tokens.put(guid);
					alert("Device id changed!");
					window.guid = guid.guid;
			}
			else{
				alert("Device id not changed!");
			}
		};
	};
	req.onerror = function(ev){
		alert("Can not open db");
	};
}

function startHeartMonitor() {
    tizen.humanactivitymonitor.start("HRM", onchangedCB);
}

function onchangedCB(hrmInfo) {
    counter++;
    var heartButton = document.getElementById("heart-button");
    
    if (counter > 10 && hrmInfo.heartRate > 0) {
        tizen.humanactivitymonitor.stop("HRM");
        counter = 0;
        alert("Heart rate = " + hrmInfo.heartRate);
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    	if (!window.indexedDB) {
    	    window.alert("OOPS! Token storage is unavailable!");
    	    tizen.application.getCurrentApplication().exit();
    	}
    	var req = window.indexedDB.open("tokens", 1);
    	req.onsuccess = function(event){
    		var db = event.target.result;
    		var tokens = db.transaction(["tokens"], "readwrite").objectStore("tokens");
    		req = tokens.get("default");
    		console.log(req);
    		req.onsuccess = function(ev){
    			console.log(ev.result);
    			window.guid = req.result.guid;
        		console.log("Send alarm + " + guid);
        		if(navigator.geolocation){
                	navigator.geolocation.getCurrentPosition(function(position) {
                    	var alarm = {
                                heartRate: hrmInfo.heartRate,  
                                measureDate: (new Date()).toString(),
                                gpsPosition: {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                }
                        };
                    	sendState(window.guid, alarm, function(data) {
                    		if(data.status == "normal")
                    			alert("Health state sended");
                    		else{
                    			navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

                    			if (navigator.vibrate) {
                    				navigator.vibrate(2000);
                    			}
                    			alert("Alert sended! Wait for help!");
                    			
                    		}
                         }, function() {
                         	alert("Can not send alarm!");
                         });
                	}, function(error){
                		console.log("Geolocation error " + error);
                	});
                }
    		};
    	};
    
            
    }
}