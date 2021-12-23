	// Find the latest version by visiting https://cdn.skypack.dev/three.
	import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';

	import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';
	import Stats from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/libs/stats.module.js';
	import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js';

	const statsEnabled = true;

	let container, stats, loader, clock;

	let camera, scene, renderer, elf, mesh;

	let spotLight;

	let mouseX = 0;
	let mouseY = 0;

	let targetX = 0;
	let targetY = 0;

	const windowHalfX = window.innerWidth;
	const windowHalfY = window.innerHeight;

	init();
	animate();

	function init() {

		container = document.getElementById('ph-image-inner-glb');
		
		//document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
		camera.position.z = 4;
		// camera.lookAt( 0, 0, 0);

		clock = new THREE.Clock();
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x060708);

		function resizeCanvasToDisplaySize() {
			const canvas = renderer.domElement;
			// look up the size the canvas is being displayed
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
		
			// adjust displayBuffer size to match
			if (canvas.width !== width || canvas.height !== height) {
				// you must pass false here or three.js sadly fights the browser
				renderer.setSize(width, height, false);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
		
				// update any render target sizes here
			}
		}
		// LIGHTS

		scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

		spotLight = new THREE.SpotLight(0xffffbb);
		spotLight.position.set(0.1, 0.1, 0.1);
		spotLight.position.multiplyScalar(100);
		scene.add(spotLight);


		spotLight.castShadow = true;

		spotLight.shadow.camera.near = 1;
		spotLight.shadow.camera.far = 1;

		spotLight.shadow.camera.fov = 1;

		spotLight.shadow.bias = - 0.005;

		// ADD O ARQUIVO GLB 
		loader = new GLTFLoader();
		loader.load('assets/js/my--avatar.glb', function (glb) {
			createScene(glb.scene.mesh);
			createScene(glb.scene.elf);
			mesh = glb.scene;
			elf = glb.scene;
			mesh.scale.set(0.2, 0.2, 0.2)
			scene.add(mesh);
			scene.add(elf);
		})


		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		// renderer.setPixelRatio(window.devicePixelRatio);
		container.appendChild(renderer.domElement);
		renderer.outputEncoding = THREE.sRGBEncoding;

		//

		// if ( statsEnabled ) {

		stats = new Stats();
		container.appendChild(stats.dom);

		// }

		// EVENTS

		window.addEventListener('mousemove', onWindowMouseMove);
		window.addEventListener('resize', onWindowResize);

	}

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
	controls.enableZoom = true
	controls.enablePan = true
	controls.dampingFactor = true
	controls.minDistance = 4
	controls.maxDistance = 5
	controls.autoRotate = false
	// 		controls.zoomSpeed= 10
	// 		controls.autoRotateSpeed= 0.5
	// 		controls.rotateSpeed= -1.4

	function createScene(geometry, scale) {

		mesh = new THREE.Mesh(geometry);

		mesh.position.y = 10;
		mesh.scale.set(scale);

		mesh.castShadow = false;
		mesh.receiveShadow = false;

		scene.add(mesh);

	}

	//

	function onWindowResize() {

		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

	}

	function onWindowMouseMove(event) {

		mouseX = (event.clientX - windowHalfX);
		mouseY = (event.clientY - windowHalfY);

	}

	//

	function animate() {
		
		// resizeCanvasToDisplaySize();
		requestAnimationFrame(animate);

		render();
		if (statsEnabled)
			stats.update();

	}

	function render() {

		targetX = mouseX * 0.001;
		targetY = mouseY * 0.0001;

		if (mesh) {

			mesh.rotation.y += 0.08 * (targetX - mesh.rotation.y);
			mesh.rotation.x += 0.08 * (targetY - mesh.rotation.x);

		}

		const delta = clock.getDelta();

		if (elf !== undefined) {

			elf.rotation.y += delta * 0.1;

		}

		renderer.render(scene, camera);

	}