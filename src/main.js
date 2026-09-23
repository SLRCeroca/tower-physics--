import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import './style.css';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181818);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(8, 6, 10);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);


const floorGeometry = new THREE.BoxGeometry(12, 0.2, 8);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x444444
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.receiveShadow = true;
scene.add(floor);


const loader = new GLTFLoader();

loader.load(
  '/models/crate.glb',
  (gltf) => {
    const crate = gltf.scene;
    crate.position.set(0, 0.5, 0);
    

    crate.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    scene.add(crate);
  },
  undefined,
  (error) => {
    console.error('Error al cargar el modelo:', error);
  }
);


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


function animate() {
  requestAnimationFrame(animate);


  renderer.render(scene, camera);
}


animate();
