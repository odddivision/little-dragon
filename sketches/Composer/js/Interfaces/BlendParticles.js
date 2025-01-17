// BlendParticles.js


function BlendParticles( options )
{
	var WIDGET_TYPE = undefined;

	var WIDGETS = {
		BUTTON: 0,
		MULTISLIDER: 1
	}

	var spritePath = options.spritePath || "/textures/hexagon.png"; // "/textures/sphereNormal.png"

	var numSpritesX = options.numSpritesX || 30;

	var spriteSize = options.spriteSize || 100;

	var spread = options.spread !== undefined ? options.spread : .02;

	var spreadOffset = options.spreadOffset || new THREE.Vector2( 0, 0 );

	var spriteRotation = options.spriteRotation || 0;

	var spriteBlending = options.spriteBlending || 1;

	var spriteOpacity = options.spriteOpacity || .34;

	var spriteNoiseAmount = options.spriteNoiseAmount !== undefined ? options.spriteNoiseAmount : 1;

	var controller = options.controller;

	var NUM_SLIDERS = controller.sliders;

	var useSideBars = options.useSideBars !== undefined ? options.useSideBars : true;
	var showStats = options.showStats !== undefined ? options.showStats : true;

	var WIDTH = controller.width;
	var HEIGHT = controller.height;
	var ASPECT_RATIO = WIDTH / HEIGHT;

	var HALF_WIDTH = WIDTH * .5;
	var HALF_HEIGHT = HEIGHT * .5;

	var stats = undefined;

	var container = $("<div>", {id: "multisliderContainer"}).css({
		position: "absolute",
		left: 0,
		top: 0,
		width: WIDTH, // 1280, // WIDTH,
		height: HEIGHT, // 800, // HEIGHT,
		pointerEvents: "none",
		backgroundColor: "rgba( 0, 0, 0, 1)",
		borderRadius: "0px" // TODO: I think this gets over-written by nexus
	}).appendTo( document.body );

	var edgeTopColor = new THREE.Color("magenta");
	var edgeBottomColor = new THREE.Color("cyan");

	var renderer, scene, camera, light, clock = new THREE.Clock();

	//
	//DEBUG
	//
	var debugMat = new THREE.MeshNormalMaterial({
		side: 2,
		wireframe: true,
		wireframeLinewidth: 2
	});

	var randf = THREE.Math.randFloat;
	var mapLinear = THREE.Math.mapLinear;
	var clamp = THREE.Math.clamp;
	function lerp( a, b, k ){return a + (b-a) * k};
	function smootherstep( x )
	{
	    return x*x*x*(x*(x*6 - 15) + 10);
	}
	var sin = Math.sin, cos = Math.cos;
	var PI = Math.PI, HALF_PI = PI * .5, TWO_PI = PI * 2;
	var v2 = function(x,y){	return new THREE.Vector3( x, y );}
	var v3 = function(x,y,z){	return new THREE.Vector3( x, y, z );}
	var origin = v3(0,0,0);


	//WIDGET
	var widget, controlID = controller.canvasID;

	if(controlID.indexOf( "multislider" ) > -1)
	{
		WIDGET_TYPE = WIDGETS.MULTISLIDER;

		widget = MultiSliderWrapper( options ); 
	}	
	else if(controlID.indexOf( "button" ) > -1)
	{
		WIDGET_TYPE = WIDGETS.BUTTON;

		widget = ButtonWrapper( options ); 
	}
	else if(controlID.indexOf( "textureReference" ) > -1)
	{
		widget = {

			renderTarget: THREE.ImageUtils.loadTexture( controller.texturePath, null, function(t){
				widget.renderTarget = t;
				t.minFilter = THREE.LinearFilter;

				if(particleMat)	particleMat.uniforms.pMap.value = t;
				if(p2)	p2.material.uniforms.pMap.value = t;
				if(p3)	p3.material.uniforms.pMap.value = t;
			} ), 

			draw: function(){
				// console.log( "widget no set recoginzes" );
			},
			handleInput: function(){
				// console.log( "little dragon:: widget not recognized" );
			}
		}
	}
	else 
	{
		widget = {
			renderTarget: THREE.WebGLRenderTarget( WIDTH * .25, HEIGHT * .25, {
				minFilter: THREE.LinearFilter
			} ),
			draw: function(){
				// console.log( "widget no set recoginzes" );
			},
			handleInput: function(){
				console.log( "little dragon:: widget not recognized" );
			}
		}
	}

	//
	//	SCENE
	//
	scene = new THREE.Scene();

	//
	//	CAMERA
	//
	
	camera = new THREE.OrthographicCamera( -HALF_WIDTH, HALF_WIDTH, HALF_HEIGHT, -HALF_HEIGHT, -1000, 1000 ); // 
	// camera = new THREE.PerspectiveCamera( 60, ASPECT_RATIO, 1, 10000 );
	// camera.position.z = 100;
	// camera.lookAt( origin );


	var debug_widgetTextureMesh = new THREE.Mesh( new THREE.BoxGeometry( WIDTH * .25, HEIGHT * .25, 10), new THREE.MeshBasicMaterial( {
		map: widget.renderTarget
	} ) );

	debug_widgetTextureMesh.visible = false;

	scene.add( debug_widgetTextureMesh );



	//EDGE COLOR BLOCKS
	if(useSideBars){
		var edgeTop = new THREE.Mesh( new THREE.PlaneBufferGeometry( WIDTH, 10), new THREE.MeshBasicMaterial( {
			color: edgeTopColor,
			depthTest: false,
			transparent: false
	
		} ) );
		var edgeBottom = new THREE.Mesh( edgeTop.geometry, new THREE.MeshBasicMaterial( {
			color: edgeBottomColor,
			depthTest: false,
			transparent: false
		} ) );
	
	
		edgeTop.position.set( 0, HALF_HEIGHT - 5, -50 );
		edgeBottom.position.set( 0, -HALF_HEIGHT+5, -50 );
	
		scene.add( edgeTop );
		scene.add( edgeBottom );
	}

	//
	//	PARTICLES
	//	
	function createPointsGeometry( numSpritesX, geometry )
	{
		console.log( 'numSpritesX: ' + numSpritesX );
		var spacing = WIDTH / numSpritesX, 
			numX = Math.ceil( WIDTH / (spacing * .866) ),
			numY	= Math.ceil( HEIGHT / spacing ),
			numPoints = (numX + 2) * (numY + 2),
			halfSpacing = spacing;	

		geometry = geometry || new THREE.BufferGeometry();
		
		var positions = new Float32Array( numPoints*3 );
		var uvs = new Float32Array( numPoints*2 );

		for(var x=-1, i3=0, i2=0; x<=numX; x++)
		{
			for(var y=-1; y<=numY; y++)
			{
				var uv = v2( x / (numX-1), y / (numY - 1));
				// var c = new THREE.Color().setHSL( uv.x, uv.y, .5 );
				
				positions[i3] = x * spacing * .866 - HALF_WIDTH;
				positions[i3+1] = (y + (x%2) * .5 * 0) * spacing - HALF_HEIGHT;
				positions[i3+2] = 0;

				uvs[i2] = uv.x;
				uvs[i2+1] = uv.y;

				i2 += 2;
				i3 += 3;
			}
		}


		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
		geometry.computeBoundingBox();

		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.uv.needsUpdate = true;

		return geometry;
	}



	// var spriteTexture = THREE.ImageUtils.loadTexture( "/textures/hexagon.png" ); "/textures/sphereNormal.png"
	var spriteTexture = THREE.ImageUtils.loadTexture( spritePath );

	var particleMat = new BlendParticleMaterial({
		map: spriteTexture,
		pMap: widget.renderTarget,
		opacity: spriteOpacity,
		size: spriteSize,
		blending: spriteBlending,
		color: new THREE.Color( 0x00FFFF ),
		noiseScale: spriteNoiseAmount,
		spriteRotation: spriteRotation
	} )

	var points = new THREE.PointCloud( createPointsGeometry( numSpritesX ), particleMat );

	points.frustumCulled = false;

	scene.add( points );

	var p2 = points.clone();
	p2.material = particleMat.clone();
	scene.add( p2 );

	p2.material.uniforms.color.value.set( 0xFFFF00 );
	p2.material.uniforms.map.value = spriteTexture;


	var p3 = points.clone();
	p3.material = particleMat.clone();
	scene.add( p3 );

	p3.material.uniforms.color.value.set( 0xFF00FF );
	p3.material.uniforms.map.value = spriteTexture;

	p2.material.uniforms.time = p3.material.uniforms.time = points.material.uniforms.time;

	// COLOR SPREAD
	p2.scale.x = p2.scale.y = 1 + spread * .5;
	p3.scale.x = p3.scale.y = 1 + spread;

	p2.position.x += spreadOffset.x * .5;
	p2.position.y += spreadOffset.y * .5;

	p3.position.x += spreadOffset.x ;
	p3.position.y += spreadOffset.y ;


	// WIDGET SPECIFIC CALLBACKS
	switch (WIDGET_TYPE) {
		case WIDGETS.MULTISLIDER :

			widget.scope.onHandleInput = function( e ){
				points.material.uniforms.time.value += .1;
			}

			break;

		case WIDGETS.BUTTON :

			break;
	}

	function setup()
	{

	}

	function update()
	{
		if(stats)	stats.update();

		var elapsedTime = clock.getElapsedTime();

		points.material.uniforms.time.value += .003;
	}

	function draw()
	{
		widget.draw( renderer );
		renderer.render( scene, camera, null, true );

		// renderer.render( widget.scene, widget.camera, null, true );
	}

	function animate()
	{
		TWEEN.update();
		
		update();

		draw();

		requestAnimationFrame(animate);
	}

	function rendererSetup()
	{
		renderer = new THREE.WebGLRenderer( { 
			antialias: true,
			devicePixelRatio: 1,
			alpha: true 
		} );
		
		renderer.setClearColor( 0x000000, 0 );

		// renderer.setPixelRatio( window.devicePixelRatio );

		renderer.sortObjects = true;
		
		renderer.setSize( WIDTH, HEIGHT );

		renderer.autoClear = false;

		container.append( renderer.domElement );
	}


	if(showStats)
	{
		stats = new Stats();
		$(stats.domElement).css({
			position: "absolute",
			left: '20px',
			right: '20px'
		}).appendTo( container );
	}

	function begin(){
		rendererSetup();
		setup();

		animate();
	}

	begin();

	return {

		begin: begin,

		widgetEvent: widget.handleInput,

		setEdgeColorTop: function( hex ){
			if(useSideBars)	edgeTopColor.set( hex );
		},

		setEdgeColorBottom: function( hex ){
			if(useSideBars)	edgeBottomColor.set( hex );
		},

		container: container,

		setImage: function( t ){
			t.minFilter = THREE.LinearFilter;

			widget.renderTarget = t;

			if(particleMat)	particleMat.uniforms.pMap.value = t;
			if(p2)	p2.material.uniforms.pMap.value = t;
			if(p3)	p3.material.uniforms.pMap.value = t;
		},

		setParticleSize: function( pSize ){

			if(particleMat)	particleMat.uniforms.size.value = pSize;
			if(p2)	p2.material.uniforms.size.value = pSize;
			if(p3)	p3.material.uniforms.size.value = pSize;
		},
		
		getParticleSize: function(){
			if(particleMat)	return	particleMat.uniforms.size.value;
			return spriteSize
		},

		setParticleOpacity: function( pSize ){

			if(particleMat)	particleMat.uniforms.opacity.value = pSize;
			if(p2)	p2.material.uniforms.opacity.value = pSize;
			if(p3)	p3.material.uniforms.opacity.value = pSize;
		},
		
		getParticleOpacity: function(){
			if(particleMat)	return	particleMat.uniforms.opacity.value;
			return spriteOpacity
		},

		getSpread: function(){
			return p3.scale.x - 1;
		},

		setSpread: function( spread ){

			p2.scale.x = p2.scale.y = 1 + spread * .5;
			p3.scale.x = p3.scale.y = 1 + spread;
		},

		getOffsetX: function(){
			return p3.position.x;
		},

		setOffsetX: function( spreadX ){

			p2.position.x = spreadX * .5;
			p3.position.x = spreadX ;

		},

		getOffsetY: function(){
			return p3.position.x;
		},

		setOffsetY: function( spreadY ){

			p2.position.y = spreadY * .5;
			p3.position.y = spreadY ;

		},

		getRotation: function(){
			return p2.material.uniforms.spriteRotation.value;
		},

		setRotation: function( value ){

			
			if(particleMat)	particleMat.uniforms.spriteRotation.value = value;
			if(p2)	p2.material.uniforms.spriteRotation.value = value;
			if(p3)	p3.material.uniforms.spriteRotation.value = value;

		},


		getNoiseScale: function(){
			if(particleMat)	return	particleMat.uniforms.noiseScale.value;
			return spriteNoiseAmount
		},

		setNoiseScale: function( value ){

			if(particleMat)	particleMat.uniforms.noiseScale.value = value;
			if(p2)	p2.material.uniforms.noiseScale.value = value;
			if(p3)	p3.material.uniforms.noiseScale.value = value;

		},

		getNumX: function(){
			return numSpritesX;
		},

		setNumberOfParticles: function( count ) {

			numSpritesX = count;

			createPointsGeometry( numSpritesX,points.geometry );
		},

		getColorA: function(){
			return particleMat.uniforms.color.value;
		},

		getColorB: function(){
			return p2.material.uniforms.color.value;
		},

		getColorC: function(){
			return p3.material.uniforms.color.value;
		},


		setColorA: function( hex ){
			return particleMat.uniforms.color.value.setHex( hex );
		},

		setColorB: function( hex ){
			return p2.material.uniforms.color.value.setHex( hex );;
		},

		setColorC: function( hex ){
			return p3.material.uniforms.color.value.setHex( hex );;
		},



	}
}