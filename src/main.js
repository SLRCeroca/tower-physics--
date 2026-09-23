import * as THREE from 'three';
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
renderer.setSize(
  window.innerWidth,
  window.innerHeight
);
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(
0xffffff,
1.5
);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
0xffffff,
3
);
directionalLight.position.set(
5,
10,
5
);
directionalLight.castShadow = true;
scene.add(directionalLight);