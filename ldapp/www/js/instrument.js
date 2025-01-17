// ORIENTATION!
// https://github.com/gbenvenuti/cordova-plugin-screen-orientation


var oscSender = null;					// The OSC sender object (send to the server)
var oscListener = null;					// Receive OSC from the server
var myIP = null;
var ldInterface = null;					// WebGL layer (?)
var iface = getQueryVariable("iface"); // which interface should we show?
var tilt_throttle_dist = 0.2;



nx.onload = function() {

	nx.sendsTo("js");
	nx.colorize("#00ff00");
	nx.colorize("accent", "#FF00FF");
	nx.colorize("fill", "#00FFFF");  
	nx.setViewport(0.5);
	
	console.log("iface", iface);

	//iface format: [instrument name][phone position]
	//for example: keys1, keys2, pre-sampled-keys1, (...), pre-sampled-keys2
	var instrumentName = iface.substring(0, iface.length - 1);
	var phonePos = iface.charAt(iface.length - 1); 

	switch( iface ){

		//  ___   _  _______  __   __  _______ 
		// |   | | ||       ||  | |  ||       |
		// |   |_| ||    ___||  |_|  ||  _____|
		// |      _||   |___ |       || |_____ 
		// |     |_ |    ___||_     _||_____  |
		// |    _  ||   |___   |   |   _____| |
		// |___| |_||_______|  |___|  |_______|
                      
		case "keys1":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-secondary');

			var control = createControl(instrumentName, "range", 1);
			control.hslider = true;	

			ldInterface = TouchLines({
			  controller: control,
			  colorRampPath: "textures/keys/keys1.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});
			
			break;

		case "keys2":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-secondary');

			var control = createControl(instrumentName, "multislider", 1);
			control.setNumberOfSliders(5);

			ldInterface = TouchLines({
			  controller: control,
			  colorRampPath: "textures/keys/keys2.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});

			break;

		case "keys3":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-secondary');

			var control = createControl(instrumentName, "keyboard", 2);
			control.multitouch = true;
			control.octaves = 1;
			control.keypattern = ['w','w','w','w','w','w','w'];
			control.lineWidth = 20;
			control.init();

			ldInterface = TouchLines({
			  controller: control,
			  colorRampPath: "textures/keys/keys3.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});

			break;

		case "keys4":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-secondary');

			var control = createControl(instrumentName, "keyboard", 3);
			control.multitouch = true;
			control.octaves = 1;
			control.keypattern = ['w','w','w','w','w','w','w'];
			control.lineWidth = 20;
			control.init();

			ldInterface = TouchLines({
			  controller: control,
			  colorRampPath: "textures/keys/keys4.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});

			break;

		case "keys5":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-primary');

		    var control = createControl(instrumentName, "button", 1);
		    // control.mode = "node";

		   ldInterface = TouchLines({
			  widthOverride: 1280,
			  heightOverride: 720,
		      controller: control,
		      colorRampPath: "textures/drums/drum-4.jpg",
		      lineWidth: 4,
		      lineLength: 20,
		      rotation: 3,
		      noiseScale: .005
		    });


			break;

		case "keys6": //tilt
			if(screen.lockOrientation)	screen.lockOrientation('portrait');

			var dist = function (v1, v2) {
				var dx = v1.x - v2.x;
				var dy = v1.y - v2.y;
				var dz = v1.z - v2.z;
				return Math.sqrt(dx*dx+dy*dy+dz*dz);
			}

			var last_data = null;
			var throttle = function(data) {	
				if(last_data==null) {
					last_data = data;
					return true;
				}
				if(dist(data, last_data) < tilt_throttle_dist)
					return false;

				last_data = data;
				return true;
			}
			var options = {h: "1280px", w: "720px", throttle: throttle};
			var control = createControl(instrumentName, "tilt", 1, options);
			control.throttlePeriod = 50;
			control.text = "pan";

			ldInterface = TouchLines({
			  MIN_ANGLE: -20,
			  MAX_ANGLE: 20,
			  controller: control,
			  colorRampPath: "textures/keys/keys5.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});

			break;


		//  _______  _______  _______  _______ 
		// |  _    ||   _   ||       ||       |
		// | |_|   ||  |_|  ||  _____||  _____|
		// |       ||       || |_____ | |_____ 
		// |  _   | |       ||_____  ||_____  |
		// | |_|   ||   _   | _____| | _____| |
		// |_______||__| |__||_______||_______|
	
		case "bass1":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-secondary');

	 		var control = createControl(instrumentName, "multislider", 1);
			control.setNumberOfSliders(2);
			
			ldInterface = TouchLines({
			  controller: control,
			  colorRampPath: "textures/bass/bass1.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});

	 		break;

		case "bass2":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-secondary');

			var control = createControl(instrumentName, "keyboard", 1);
			control.multitouch = true;
			control.octaves = 1;
			control.keypattern = ['w','w','w'];
			control.lineWidth = 20;
			control.init();

			ldInterface = TouchLines({
			  controller: control,
			  colorRampPath: "textures/bass/bass1.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});
	 		
			break;

		case "bass3":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-secondary');

			var control = createControl(instrumentName, "keyboard", 2);
	 		control.octaves = 1;
	 		control.multitouch = true;
	 		control.keypattern = ['w','w','w','w'];
			control.lineWidth = 20;
	 		control.init();
	 		
	 		ldInterface = TouchLines({
	 		  controller: control,
	 		  colorRampPath: "textures/bass/bass2.jpg",
	 		  lineWidth: 4,
	 		  lineLength: 20,
	 		  rotation: 3,
	 		  noiseScale: .005
	 		});

			break;

		case "bass4":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-secondary');

			var control = createControl(instrumentName, "keyboard", 3);
	 		control.octaves = 1;
	 		control.multitouch = true;
	 		control.keypattern = ['w','w','w'];
			control.lineWidth = 20;
	 		control.init();

	 		ldInterface = TouchLines({
	 		  controller: control,
	 		  colorRampPath: "textures/bass/bass3.jpg",
	 		  lineWidth: 4,
	 		  lineLength: 20,
	 		  rotation: 3,
	 		  noiseScale: .005
	 		});

			break;
			  

		case "bass5":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-secondary');

			var control = createControl(instrumentName, "keyboard", 4);
	 		control.octaves = 1;
	 		control.multitouch = true;
	 		control.keypattern = ['w','w','w','w'];
			control.lineWidth = 20;
	 		control.init();

	 		ldInterface = TouchLines({
	 		  controller: control,
	 		  colorRampPath: "textures/bass/bass4.jpg",
	 		  lineWidth: 4,
	 		  lineLength: 20,
	 		  rotation: 3,
	 		  noiseScale: .005
	 		});

			break;


		case "bass6": //tilt
			if(screen.lockOrientation)	screen.lockOrientation('portrait');

			var dist = function (v1, v2) {
				var dx = v1.x - v2.x;
				var dy = v1.y - v2.y;
				var dz = v1.z - v2.z;
				return Math.sqrt(dx*dx+dy*dy+dz*dz);
			}

			var last_data = null;
			var min_dist = 0.3;
			var throttle = function(data) {	
				if(last_data==null) {
					last_data = data;
					return true;
				}
				if(dist(data, last_data) < min_dist)
					return false;

				last_data = data;
				return true;
			}

			var options = {h: "1280px", w: "720px", throttle: throttle};
			var control = createControl(instrumentName, "tilt", 1, options);
			control.throttlePeriod = 50;
			control.text = "pan";

			ldInterface = TouchLines({
			  MIN_ANGLE: -20,
			  MAX_ANGLE: 20,
			  controller: control,
			  colorRampPath: "textures/bass/bass1.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});

			break;


		//  ______   ______    __   __  __   __  _______ 
		// |      | |    _ |  |  | |  ||  |_|  ||       |
		// |  _    ||   | ||  |  | |  ||       ||  _____|
		// | | |   ||   |_||_ |  |_|  ||       || |_____ 
		// | |_|   ||    __  ||       ||       ||_____  |
		// |       ||   |  | ||       || ||_|| | _____| |
		// |______| |___|  |_||_______||_|   |_||_______|
	  
	  //   case "drumscontrols":
	  //   	if(screen.lockOrientation)	screen.lockOrientation('landscape-primary');

			// var control = createControl("drum", "multislider", 4);

			 
			// control.setNumberOfSliders(3);

			// ldInterface = TouchLines({
			//   controller: control,
			//   colorRampPath: "textures/bass/bass1.jpg",
			//   lineWidth: 4,
			//   lineLength: 20,
			//   rotation: 3,
			//   noiseScale: .005
			// });

		 //    break;

		//PRE-SAMPLED DRUMS
	    case "drums1":
	    	if(screen.lockOrientation)	screen.lockOrientation('landscape-primary');

		    var control = createControl(instrumentName, "toggle", 0);
		    // control.mode = "node"; //"node" is the actual name of the "aftertouch" mode described in the documentation.
				
			// ///rotation=6&noiseAmount=10&timeScale=2
			ldInterface = TouchLines({
			  widthOverride: 1280,
			  heightOverride: 720,
			  controller: control,
			  colorRampPath: "textures/drums/drum-1-1.jpg",
			  toggleRampPath: "textures/drums/drum-1.jpg",
			  lineWidth: 4,
			  lineLength: 16,
			  rotation: 3,
			  noiseScale: .005,
			  spriteRotation: 6,
			  noiseAmount: 10,
			  timeScale: 2
			});
		   break;

	    case "drums2":
	    	if(screen.lockOrientation)	screen.lockOrientation('landscape-primary');

		    var control = createControl(instrumentName, "keyboard", 1);
	 		control.octaves = 1;
	 		control.multitouch = true;
	 		control.keypattern = ['w','w','w','w','w'];
			control.lineWidth = 20;
	 		control.init();

	 		ldInterface = TouchLines({
	 		  controller: control,
	 		  colorRampPath: "textures/bass/bass3.jpg",
	 		  lineWidth: 4,
	 		  lineLength: 20,
	 		  rotation: 3,
	 		  noiseScale: .005
	 		});
		    break;

		case "drums3":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-primary');

			var control = createControl(instrumentName, "keyboard", 2);
	 		control.octaves = 1;
	 		control.multitouch = true;
	 		control.keypattern = ['w','w'];
			control.lineWidth = 20;
	 		control.init();

	 		ldInterface = TouchLines({
	 		  controller: control,
	 		  colorRampPath: "textures/bass/bass3.jpg",
	 		  lineWidth: 4,
	 		  lineLength: 20,
	 		  rotation: 3,
	 		  noiseScale: .005
	 		});

		    break;

		case "drums4":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-primary');

		    var control = createControl(instrumentName, "keyboard", 3);
	 		control.octaves = 1;
	 		control.multitouch = true;
	 		control.keypattern = ['w','w'];
			control.lineWidth = 20;
	 		control.init();

	 		ldInterface = TouchLines({
	 		  controller: control,
	 		  colorRampPath: "textures/bass/bass3.jpg",
	 		  lineWidth: 4,
	 		  lineLength: 20,
	 		  rotation: 3,
	 		  noiseScale: .005
	 		});
		    break;


		case "drums5":
			if(screen.lockOrientation)	screen.lockOrientation('landscape-primary');
		    var control = createControl(instrumentName, "keyboard", 4);
	 		control.octaves = 1;
	 		control.multitouch = true;
	 		control.keypattern = ['w','w'];
			control.lineWidth = 20;
	 		control.init();

	 		ldInterface = TouchLines({
	 		  controller: control,
	 		  colorRampPath: "textures/bass/bass3.jpg",
	 		  lineWidth: 4,
	 		  lineLength: 20,
	 		  rotation: 3,
	 		  noiseScale: .005
	 		});
		    
		    break;
		
		case "drums6":

			if(screen.lockOrientation)	screen.lockOrientation('portrait');

			var dist = function (v1, v2) {
				var dx = v1.x - v2.x;
				var dy = v1.y - v2.y;
				var dz = v1.z - v2.z;
				return Math.sqrt(dx*dx+dy*dy+dz*dz);
			}

			var last_data = null;
			
			var throttle = function(data) {	
				if(last_data==null) {
					last_data = data;
					return true;
				}
				if(dist(data, last_data) < tilt_throttle_dist)
					return false;

				last_data = data;
				return true;
			}

			var options = {h: "1280px", w: "720px", throttle: throttle};
			var control = createControl(instrumentName, "tilt", 1, options);
			control.throttlePeriod = 50;
			control.text = "reverb";

			ldInterface = TouchLines({
			  MIN_ANGLE: -20,
			  MAX_ANGLE: 20,
			  controller: control,
			  colorRampPath: "textures/drums/drum-6.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});

		    break;



		//  __   __  _______  _______  _______  ___      _______ 
		// |  | |  ||       ||       ||   _   ||   |    |       |
		// |  |_|  ||   _   ||       ||  |_|  ||   |    |  _____|
		// |       ||  | |  ||       ||       ||   |    | |_____ 
		// |       ||  |_|  ||      _||       ||   |___ |_____  |
		//  |     | |       ||     |_ |   _   ||       | _____| |
		//   |___|  |_______||_______||__| |__||_______||_______|

		case "voicefx1":
			var control = createControl("vocals", "multislider", 1);
			control.setNumberOfSliders(2);

			ldInterface = TouchLines({
			  controller: control,
			  colorRampPath: "textures/keys/keys1.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});

			break;


		 // __      _______ ___ ___ 
		 // \ \    / /_   _| __|__ \
		 //  \ \/\/ /  | | | _|  /_/
		 //   \_/\_/   |_| |_|  (_) 
		 //   

		case "rangeTest":
			var control = createControl("rangeTest", "range" );
			control.mode = "area"; //"edge"

			ldInterface = TouchLines({
			  controller: control,
			  colorRampPath: "textures/keys/keys1.jpg",
			  lineWidth: 4,
			  lineLength: 20,
			  rotation: 3,
			  noiseScale: .005
			});

			break;
		                         
	    default:
			var container = $("<div>", {id: "warning"}).css({
				position: "absolute",
				left: 0,
				height: "300px",
				width: "100%",
				"font-size": "250%",
				"text-align": "center",
				"vertical-align": "middle",
				"line-height": "90px"     
			}).appendTo( document.body );
			container.html("Not yet implemented.");
	   		break;
	}

}

// Round all of the floats in an object (for optimized network sending)
function roundFloats(obj) {
    for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) 
        	 roundFloats( obj[k] ); // recurse objects
        else if(typeof obj[k] == 'number' && obj[k] % 1 != 0)
        	obj[k] = parseFloat( obj[k].toFixed(3) );
    }
}

function createControl(instrument, type, number, options){
	var id = [instrument, type, number].join("_");
	var defaults = {"id": id, "parent":"controls", w: "1280px", h: "720px", throttle: null};
	var settings = $.extend(defaults, options);

	var widget = nx.add(type, settings).on('*', function(data) {
		roundFloats(data);

		if(ldInterface){
			// var eventObject = {"event":id, "data":data};
			ldInterface.widgetEvent( data );
		}

		if(oscSender) {
			if(!settings.throttle || settings.throttle(data)) {
				var addr = "/" + id;
				console.log(addr, JSON.stringify(data));
				oscSender.send(addr, JSON.stringify(data), null,
					function(err){ console.error( "oscSender.send", err ); } );
			}
		} else {
			console.warn("oscSender not yet constructed!")
		}
	});
	// widget.colors.fill("#F0F0F0");
	// widget.colorize("#F0F0F0"); 
	console.log(widget.colors.fill);
	return widget;
}


// This kicks off all of the device-specific/Cordova stuff. 
var onDeviceReady = function() {
	// Print out some useful info
	console.log('deviceready');
	console.log( "navigator.userAgent", navigator.userAgent );
	console.log( "device.uuid", device.uuid );

	// Set up an OSC sender to broadcast messages to anyone listening on port 3333
	var host = "192.168.2.255";
	oscSender = new window.OSCSender(host, 3333);


	/*
	// Called when device is paused
	var onPause = function(e) {
		if(oscSender) {
			console.log("/leave", JSON.stringify({"ip": myIP, "iface": iface}));
			oscSender.send("/leave", JSON.stringify({"ip": myIP, "iface": iface}));
		}
	}

	// Called when device is resumed
	var onResume = function(e) {
		if(oscSender) {
			console.log("/join", JSON.stringify({"ip": myIP, "iface": iface}));
			oscSender.send("/join", JSON.stringify({"ip": myIP, "iface": iface}));
		}
	}

	// Called when ZeroConf gets a notification of an available service 
	var onZeroConf = function(event){
		console.log("ZeroConf service", event);

		if(event.action=="added" && event.service.addresses.length && 
			event.service.name=="ld-luisa" && oscSender==null) {
			var host =  event.service.addresses[0];
			var port =  event.service.port;

			// Construct the osc
			console.log("Found LittleDragon OSC server", host, port);
			oscSender = new window.OSCSender(host, port);

			// Now that we have an OSCSender, get the IP address of the device 
			// so that we can send a "/join" message to the server
			networkinterface.getIPAddress(onIPAddress);
		}
	}
	// Listen for the OSC server to advertise itself
	var zeroConfAddr = "_osc._udp.local.";
	console.log("Listen for zeroconf service", zeroConfAddr);
	ZeroConf.watch(zeroConfAddr, onZeroConf);


	// Called when networkinterface gets the IP address of the device.
	// Announce to the server that we are here, 
	// also set up a listener to listen for messages from the server
	/*
	var onIPAddress = function (ip) { 
		myIP = ip;
		console.log("myIP", myIP);

		onResume();

		oscListener = new window.OSCListener(4444);
		var onSuccess =  function(){ console.log("listening for OSC on port", 4444); };
		var onError = function(){ console.error("failed to open OSC port for listening"); };
		oscListener.startListening(onSuccess, onError);
		oscListener.on("/tick", function(data){
			console.log("/tick", data);
		});
	}
	networkinterface.getIPAddress(onIPAddress);
	*/

	// Disable as many buttons as possible.
	var _stop = function(e){ e.preventDefault(); };
	document.addEventListener("backbutton", _stop, false);
	document.addEventListener("menubutton", _stop, false);
	document.addEventListener("searchbutton", _stop, false);
	document.addEventListener("startcallbutton", _stop, false);
	document.addEventListener("endcallbutton", _stop, false);
	// document.addEventListener("pause", onPause, false);
	// document.addEventListener("resume", onResume, false);
}
document.addEventListener('deviceready', onDeviceReady, false);




/*

// CORDOVA LAUNCH STUFF
var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);


    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
*/
