var host = "ws://luisaph.local:9998";
var ws = new WebSocket(host);



ws.onopen = function()
{
	// setInterval(function(){
	// 	// Web Socket is connected, send data using send()
	// 	ws.send("Message to send");
	// }, 1000);
	
	console.log("opened connection");
};

ws.onmessage = function (evt) 
{
	var received_msg = evt.data;
	console.log("Message received: "+received_msg)
};

ws.onclose = function()
{ 
  // websocket is closed.
  alert("Connection is closed..."); 
};

/**
*	Tilt Listener
*/	
window.addEventListener('deviceorientation', function (event) {
	var absolute = event.absolute;
	var alpha    = event.alpha;
	var beta     = event.beta;
	var gamma    = event.gamma;	
	ws.send(JSON.stringify({"event": "tilt", "value": beta}));
})

/**
*	Click Listener (just for debugging: to test web socket comm from the browser)
*/	
document.body.addEventListener('mousedown', function(event){
	console.log('click');
	ws.send(JSON.stringify({"event": "click", "value": event.x}));
});


/**
*	Touch Listener
*/
document.body.addEventListener('touchstart', function(event) {
	// If there's exactly one finger inside this element
	if (event.targetTouches.length == 1) {
		var touch = event.targetTouches[0];
		ws.send(JSON.stringify({"event": "single"}));
	} else if (event.targetTouches.length == 2) {
		var touch = event.targetTouches[0];
		ws.send(JSON.stringify({"event": "double"}));
	}
}, false);




/**
*	Random NexusUI to show it works with Three.js
*/
nx.onload = function() {
		
	  nx.sendsTo("js");

	  
	  // listen to all of position's output
	  toggle1.on('value', function(data) {
	    // do something musical with data.x and data.y
	    console.log(data);
	    if(data == 1){
	    	renderer.setClearColor( 0xff0000 );
	    }
	    else{
	    	renderer.setClearColor( 0xffff00 );
	    }

	    
	  })

	  // listen only to the 'x' parameter
	  position1.on('x', function(data) {
	    // here data will be an integer
	    // equal to the position's x value
	  })
		
	}

/**
*	Just random Three.js WEBGL sample to prove that WebGL works in Cocoon!
*/

var container, stats;
var camera, scene, raycaster, renderer;

var mouse = new THREE.Vector2(), INTERSECTED;
var radius = 50, theta = 0;

init();
animate();



function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - interactive cubes';
	container.appendChild( info );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

	scene = new THREE.Scene();

	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );

	var geometry = new THREE.BoxGeometry( 20, 20, 20 );

	for ( var i = 0; i < 500; i ++ ) {

		var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

		object.position.x = Math.random() * 800 - 400;
		object.position.y = Math.random() * 800 - 400;
		object.position.z = Math.random() * 800 - 400;

		object.rotation.x = Math.random() * 2 * Math.PI;
		object.rotation.y = Math.random() * 2 * Math.PI;
		object.rotation.z = Math.random() * 2 * Math.PI;

		object.scale.x = Math.random() + 0.5;
		object.scale.y = Math.random() + 0.5;
		object.scale.z = Math.random() + 0.5;

		scene.add( object );

	}

	raycaster = new THREE.Raycaster();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;
	container.appendChild(renderer.domElement);

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '200px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	theta += 0.1;

	camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
	camera.lookAt( scene.position );

	camera.updateMatrixWorld();

	// find intersections

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {

		if ( INTERSECTED != intersects[ 0 ].object ) {

			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );

		}

	} else {

		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

		INTERSECTED = null;

	}

	renderer.render( scene, camera );

}

Cocoon.App.exitCallback(function(){
   if(true){ 
      // Finish the app
      return true; 
   }else{ 
      // Do not close the app
      return false; 
   } 
});