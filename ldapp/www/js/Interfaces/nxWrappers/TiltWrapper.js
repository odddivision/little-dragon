// TiltWrapper.js

var LDTiltMaterial = function( params ) {

	params = params || {};

	var isLineShader = params.lineShader || false;

	var matParams = {
		transparent: true,
		blending: params.blending || 1,
		depthTest: params.depthTest || false,
		depthWrite: params.depthWrite !== undefined ? params.depthWrite : false,
		side: params.side || 2,// 0 = backFaceCull, 1 = frontFaceCull, 2 = doubleSided
		linewidth: 1,

		// TODO: if radius is staying at 1 lets remove it

		uniforms: {
			color: {type: 'c', value: params.color || new THREE.Color() },
			opacity: {type: 'f', value: params.opacity || 1 },
			u: {type: 'f', value: params.u || Math.random() * .8 + .1 },
			weight: {type: 'f', value: params.u || 0 },
			falloff: {type: 'f', value: params.u || .5 },
			minWeight: {type: 'f', value: params.u || .7 },
			tilt: {type: 'f', value: params.tilt !== undefined ? params.tilt : .5 }
		},

		vertexShader: [

		'varying vec2 vUv;',

		'void main() {',

		'	vUv = uv;',

		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'].join('\n'),

		fragmentShader: [

		'uniform float opacity;',

		'uniform float u;',

		'uniform float tilt;',

		'uniform float weight;',

		'uniform float minWeight;',

		'uniform float falloff;',

		'uniform vec3 color;',

		// 'uniform vec3 color2;',

		'varying vec2 vUv;',

		'float mapLinear( in float x, in float a1, in float a2, in float b1, in float b2 ) {',
		'	return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );',
		'}',

		'float smootherstep( float x ){',
		'    return x*x*x*(x*(x*6. - 15.) + 10.);',
		'}',

		'void main()',
		'{',

		'	float grad = vUv.y < tilt ? vUv.y / tilt : (1. - vUv.y) / (1. - tilt)  ;',

		'	grad = smootherstep( pow( grad, 1.5 ) );',

		'	gl_FragColor = vec4( vec3( grad ), 1. );',

		'}'
		].join('\n')

	}
	
	THREE.ShaderMaterial.call( this, matParams );
}

LDTiltMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

function TiltWrapper( options )
{
	var scope = this;

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

	var controller = options.controller;

	var NUM_SLIDERS = controller.sliders;

	var WIDTH = controller.width;
	var HEIGHT = controller.height;
	var ASPECT_RATIO = WIDTH / HEIGHT;

	var MIN_ANGLE = options.MIN_ANGLE !== undefined ? options.MIN_ANGLE : -20;
	var MAX_ANGLE = options.MAX_ANGLE !== undefined ? options.MAX_ANGLE : 20;

	if( getQueryVariable("minAngle") !== undefined )	MIN_ANGLE = getQueryVariable("minAngle");
	if( getQueryVariable("maxAngle") !== undefined )	MAX_ANGLE = getQueryVariable("maxAngle");

	var minNormalizedAngle = MIN_ANGLE / 90;
	var maxNormalizedAngle = MAX_ANGLE / 90;

	console.log( 'WIDTH: ' + WIDTH );

	console.log( 'HEIGHT: ' + HEIGHT );

	var HALF_WIDTH = WIDTH * .5;
	var HALF_HEIGHT = HEIGHT * .5;

	var decay = .95;

	var camera = options.camera || new THREE.OrthographicCamera( -HALF_WIDTH, HALF_WIDTH, HALF_HEIGHT, -HALF_HEIGHT, -1000, 1000 ); // 

	var renderTarget = new THREE.WebGLRenderTarget( WIDTH * .25, HEIGHT * .25, {
		minFilter: THREE.LinearFilter
	} );

	var scene = new THREE.Scene();

	var autoClear = false;
	
	var m = new THREE.Mesh( new THREE.PlaneBufferGeometry( WIDTH, HEIGHT, 10, 10 ), new LDTiltMaterial() );

	scene.add( m );


	function draw( renderer )
	{
		renderer.render( scene, camera, renderTarget, autoClear );
	}

	scope.onHandleInput = function() {
		// console.log( "scope.onHandleInput" );
	}

	function setTilt( value ) {

		m.material.uniforms.tilt.value = value;

	}

	function handleInput( data )
	{
		scope.onHandleInput( data );

		// data.y is between -1 & 1 with 1 == 90degrees
		// 
		setTilt( mapLinear(data.y, minNormalizedAngle, maxNormalizedAngle, 0, 1) )
	}

	return {
		scene: scene,
		camera: camera,
		renderTarget: renderTarget,
		draw: draw,
		setTilt: setTilt,
		handleInput: handleInput,
		scope: scope
	}
}
