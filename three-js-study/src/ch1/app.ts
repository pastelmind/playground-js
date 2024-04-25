import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

// basic scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.fog = new THREE.Fog(0xffffff, 0.0025, 50);

// setup camera and basic renderer
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.x = -3;
camera.position.z = 8;
camera.position.y = 2;

// setup the renderer and attach to canvas
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// add lights
scene.add(new THREE.AmbientLight(0x666666));
const dirLight = new THREE.DirectionalLight(0xaaaaaa);
dirLight.position.set(5, 12, 8);
dirLight.castShadow = true;
dirLight.intensity = 1;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.radius = 4;
dirLight.shadow.bias = -0.0005;

scene.add(dirLight);

// add orbitcontrols
const controller = new OrbitControls(camera, renderer.domElement);
controller.enableDamping = true;
controller.dampingFactor = 0.05;
controller.minDistance = 3;
controller.maxDistance = 10;
controller.minPolarAngle = Math.PI / 4;
controller.maxPolarAngle = (3 * Math.PI) / 4;

// create a cube and torus knot and add them to the scene
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

cubeMesh.position.x = -1;
cubeMesh.castShadow = true;
scene.add(cubeMesh);

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 100);
const torusKnotMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff88,
  roughness: 0.1,
});
const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);

torusKnotMesh.castShadow = true;
torusKnotMesh.position.x = 2;
scene.add(torusKnotMesh);

// create a very large ground plane
const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

groundMesh.position.set(0, -2, 0);
groundMesh.rotation.set(Math.PI / -2, 0, 0);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// add stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// add gui
const gui = new GUI();
const props = {
  cubeSpeed: 0.01,
  torusSpeed: 0.01,
};

gui.add(props, "cubeSpeed", -0.2, 0.2, 0.01);
gui.add(props, "torusSpeed", -0.2, 0.2, 0.01);

renderer.render(scene, camera);

// render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update();

  cubeMesh.rotation.x += props.cubeSpeed;
  cubeMesh.rotation.y += props.cubeSpeed;
  cubeMesh.rotation.z += props.cubeSpeed;

  torusKnotMesh.rotation.x -= props.torusSpeed;
  torusKnotMesh.rotation.y += props.torusSpeed;
  torusKnotMesh.rotation.z -= props.torusSpeed;

  controller.update();
}
animate();
