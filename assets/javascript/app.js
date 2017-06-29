$(document).ready(function () {
  
  var config = {
    apiKey: "AIzaSyDYcEPj_1z1nqQncN_yu2-ejj4MFAfVk5s",
    authDomain: "cvb-train-scheduler.firebaseapp.com",
    databaseURL: "https://cvb-train-scheduler.firebaseio.com",
    projectId: "cvb-train-scheduler",
    storageBucket: "cvb-train-scheduler.appspot.com",
    messagingSenderId: "602819444131"
  };

  firebase.initializeApp(config);

  var database = firebase.database().ref();

  function addRow(snapshotObj) {
  	var newRow = $("<tr>");

  	var minsAway = calculateMinsAway(snapshotObj.start, snapshotObj.frequency);
  	console.log(minsAway);
  	console.log("next train: " + nextTrainTime(minsAway));

  	newRow.append("<td>" + snapshotObj.name + "</td>");
  	newRow.append("<td>" + snapshotObj.destination + "</td>");
  	newRow.append("<td>" + snapshotObj.frequency + "</td>");
  	newRow.append("<td>" + nextTrainTime(minsAway) + "</td>");
  	newRow.append("<td>" + minsAway + "</td>");

  	$("#schedule-body").append(newRow);

  }

  function calculateMinsAway(startTime, frq) {
  	//make sure start time is before current time
  	var convertedStart = moment(startTime, "hh:mm").subtract(1, "years");
  	console.log("start: " + convertedStart.format("hh:mm"));
  	//save current time in variable
  	var now = moment();
  	console.log("current: " + moment(now).format("hh:mm"));

  	var difference = moment(now).diff(moment(convertedStart), "minutes");
  	console.log("difference: " + difference);

  	var remainder = difference % frq;

  	return frq - remainder;
  }

  function nextTrainTime(mins) {
  	return moment().add(mins, "minutes").format("hh:mm");
  }

  $("#add-train").on("click", function(event) {
  	event.preventDefault();
	var nameInput = $("#name-input").val().trim();
  	var destinationInput = $("#destination-input").val().trim();
  	var startInput = $("#start-time-input").val().trim();
  	var frequencyInput = $("#frequency-input").val().trim();

  	//regex to check time input
  	var p = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;

  	if (nameInput === "" || destinationInput === "" || startInput === "" || frequencyInput === "") {
  		alert("Please enter all train info");
  		
  	} else if (!p.test(startInput)) {
  		alert("please enter a valid time");

  	} else {
  		database.push({
	  		name: nameInput,
	  		destination: destinationInput,
	  		start: startInput,
	  		frequency: frequencyInput,
	  		dateAdded: firebase.database.ServerValue.TIMESTAMP
	  	});

  		//empty input boxes
	  	$("#name-input").val("");
	  	$("#destination-input").val("");
	  	$("#start-time-input").val("");
	  	$("#frequency-input").val("");
  	}

  });

  database.on("child_added", function(snap) {
  	var value = snap.val();

  	addRow(value);

  }, function(err) {
  	console.log("Errors handled: " + err.code);
  });

  $("#clear-schedule").on("click", function(event) {
  	database.set({});
  	location.reload();
  })

})