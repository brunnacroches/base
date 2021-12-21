import * as THREE from './three.js-master/build/three.module.js.js'
import {GLTFLoader} from './three.js-master/examples/jsm/loaders/GLTFLoader.js.js'
import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js.js'
import Stats from './three.js-master/examples/jsm/libs/stats.module.js.js';

const statsEnabled = true;

			let container, stats, loader, clock;

			let camera, scene, renderer, elf;

			let mesh;

			let spotLight;

			let mouseX = 0;
			let mouseY = 0;

			let targetX = 0;
			let targetY = 0;

			const windowHalfX = window.innerWidth / 2;
			const windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = document.createElement('ph-image-inner-glb');
				document.body.appendChild(container);

			  camera = new THREE.PerspectiveCamera( 75,  window.innerWidth / window.innerHeight, 1, 10000)
        camera.position.set(0,1,3)
        
        clock = new THREE.Clock();
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x060708 );


				// loading manager
				const loadingManager = new THREE.LoadingManager( function () {

					scene.add( elf );

				} );

				// LIGHTS

				scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

				spotLight = new THREE.SpotLight( 0xffffbb, 2 );
				spotLight.position.set( 0.5, 0, 1 );
				spotLight.position.multiplyScalar( 700 );
				scene.add( spotLight );

				spotLight.castShadow = true;

				spotLight.shadow.mapSize.width = 2048;
				spotLight.shadow.mapSize.height = 2048;

				spotLight.shadow.camera.near = 200;
				spotLight.shadow.camera.far = 1500;

				spotLight.shadow.camera.fov = 40;

				spotLight.shadow.bias = - 0.005;

        const mapHeight = new THREE.TextureLoader().load( "assets/texture01.png" );
        // const mapHeight2 = new THREE.TextureLoader().load( "assets/texture02.png" );

				const material = new THREE.MeshPhongMaterial( {
					color: 0x552811,
					specular: 0x222222,
					shininess: 25,
					bumpMap: mapHeight,
					bumpScale: 12
				} );
				                  // ADD O ARQUIVO GLB 
          loader = new GLTFLoader()
          loader.load('my--avatar.glb', function(glb){
              createScene(glb.scene.children[ 0 ].geometry, 100, material );
              
              const children = glb.scene;
              children.scale.set(0.2, 0.2, 0.2)
              scene.add(children);
              elf = glb.scene;
          })


				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				renderer.shadowMap.enabled = true;
				renderer.outputEncoding = THREE.sRGBEncoding;

				//

				if ( statsEnabled ) {

					stats = new Stats();
					container.appendChild( stats.dom );

				}

				// EVENTS

				document.addEventListener( 'mousemove', onDocumentMouseMove );
				window.addEventListener( 'resize', onWindowResize );

			}

			function createScene( geometry, scale, material) {

				mesh = new THREE.Mesh( geometry, material );

				mesh.position.y = - 50;
				mesh.scale.set( scale, scale, scale );

				mesh.castShadow = true;
				mesh.receiveShadow = true;

				scene.add( mesh );

			}
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
			//

			function onWindowResize() {

				renderer.setSize( window.innerWidth, window.innerHeight );
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

			}
 
			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX );
				mouseY = ( event.clientY - windowHalfY );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				if ( statsEnabled ) 
        stats.update();

			}

			function render() {

				targetX = mouseX * .001;
				targetY = mouseY * .001;

				if ( mesh ) {

					mesh.rotation.y += 0.05 * ( targetX - mesh.rotation.y );
					mesh.rotation.x += 0.05 * ( targetY - mesh.rotation.x );

				}

        const delta = clock.getDelta();

				if ( elf !== undefined ) {

					elf.rotation.y += delta * 0.5;

				}

				renderer.render( scene, camera );

			}