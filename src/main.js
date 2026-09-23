import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import RAPIER from '@dimforge/rapier3d-compat';
import './style.css';

// 1. Inicialización del Motor de Físicas Rapier
await RAPIER.init();

const gravity = { x: 0, y: -9.81, z: 0 };
const world = new RAPIER.World(gravity);

// Creación del Collider Estático para el Suelo (No tiene RigidBody, por lo tanto no se mueve)
const floorColliderDesc = RAPIER.ColliderDesc.cuboid(6, 0.1, 4);
world.createCollider(floorColliderDesc);

// 2. Configuración de la Escena, Cámara y Renderizador de Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181818);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 4, 10);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 3. Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// 4. Suelo Visual (Coincide en dimensiones con el collider cuboid 6x0.1x4 -> BoxGeometry 12x0.2x8)
const floorGeometry = new THREE.BoxGeometry(12, 0.2, 8);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x444444
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// El collider de Rapier por defecto se crea en (0,0,0). 
// Ponemos el suelo visual centrado exactamente ahí alineando su grosor.
floor.position.set(0, -0.1, 0); 
floor.receiveShadow = true;
scene.add(floor);

// 5. Carga del Modelo 3D y Clonación de Caixes
const loader = new GLTFLoader();

loader.load(
  '/Models/Crate.glb',
  (gltf) => {
    const Crate = gltf.scene;

    const escala = 0.5;
    Crate.scale.set(escala, escala, escala);

    const offsetX = 3; 
    const size = 0.5; 
    const halfHeight = size / 2; // 0.25
    Crate.position.set(offsetX, halfHeight, 0); 

    Crate.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    scene.add(Crate);

    function createCrate(x, y, z) {
      const newCrate = Crate.clone(); 
      newCrate.position.set(x, y, z); 
      scene.add(newCrate);            
      return newCrate;                
    }

    // Fila inferior
    createCrate(offsetX - size, halfHeight, 0); 
    createCrate(offsetX + size, halfHeight, 0); 

    // Fila del medio
    createCrate(offsetX - size / 2, halfHeight + size, 0); 
    createCrate(offsetX + size / 2, halfHeight + size, 0);  

    // Fila superior
    createCrate(offsetX, halfHeight + (size * 2), 0); 
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

// 6. Bucle de Animación y Simulación Física
function animate() {
  requestAnimationFrame(animate);

  // Avanzar la simulación física de Rapier en cada frame
  world.step();

  renderer.render(scene, camera);
}

animate();
