	// Find the latest version by visiting https://cdn.skypack.dev/three.
	import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.135.0-pjGUcRG9Xt70OdXl97VF/mode=imports,min/optimized/three.js';

	import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js';


	const statsEnabled = true;

	let container, stats, loader;

	let camera, scene, renderer;

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

		container = document.getElementById('container');
		document.getElementById("container").setAttribute("style","height:1px","float: right", "width: 25%", "display: inline")
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
		// (aumentar ele fica menor)
		camera.position.z = 2;
		// aumentar > ele desce
		camera.position.y = 0.3;
		// aumentar > para a esquerda
		camera.position.x = 0;
		
		// document.body.appendChild(container);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild(renderer.domElement);

		
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x060708);
		scene.geometry = new THREE.BoxGeometry(100, 100, 100);
		// clock = new THREE.Clock();


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
			// createScene(glb.scene.elf);
			mesh = glb.scene;
			// elf = glb.scene;
			mesh.scale.set(0.2, 0.2, 0.2)
			// ir para a direita (aumentar)
			mesh.position.x = 1;
			// ir para baixo (aumentar)
			mesh.position.y = -0.90;
			scene.add(mesh);
			// scene.add(elf);
		})

		//

		// EVENTS

		window.addEventListener('mousemove', onWindowMouseMove);
		function onWindowMousemove() {
			camera.aspect = window.innerWidth / window.innerHeight
			camera.updateProjectionMatrix()
			renderer.setSize(window.innerWidth, window.innerHeight)
			render()
	}
		window.addEventListener('resize', onWindowResize);
		function onWindowResize() {
			renderer.setSize(window.innerWidth, window.innerHeight);
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

	}
	}


	function createScene(geometry, scale) {

		mesh = new THREE.Mesh(geometry);

		mesh.position.y = 15;
		mesh.scale.set(scale);

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		scene.add(mesh);

	}

	function onWindowMouseMove(event) {

		mouseX = (event.clientX - windowHalfX);
		mouseY = (event.clientY - windowHalfY);

	}

	//

	function animate() {
		
		requestAnimationFrame(animate);

		render();
	}

	function render() {

		targetX = mouseX * 0.001;
		targetY = mouseY * 0.0001;

		if (mesh) {

			mesh.rotation.y += 0.08 * (targetX - mesh.rotation.y);
			mesh.rotation.x += 0.08 * (targetY - mesh.rotation.x);

		}
		renderer.render(scene, camera);

	}