var d1 = document.getElementById("heart-rate");
var d2 = document.getElementById("peak2peak");

function startHeartMonitor(){
	
	tizen.humanactivitymonitor.start("HRM", onchangedCB);
}

var counter = 0;

function onchangedCB(hrmInfo)
{
   d1.innerHTML = "Heart Rate: " + hrmInfo.heartRate + "<br/>";
   d2.innerHTML = "Peak-to-peak interval: " + hrmInfo.rRInterval + " milliseconds";
   sleep(2000);
   counter++;
   if (counter > 20)
   {
      /* Stop the sensor after detecting a few changes */
      tizen.humanactivitymonitor.stop("HRM");
   }
}

