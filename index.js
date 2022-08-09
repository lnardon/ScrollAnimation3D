// IMPORTS
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js";

//SCENE
const scene = new THREE.Scene();

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true,
});
renderer.setClearColor(0x070707);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//CAMERA
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 13;
camera.rotation.x = 0;
camera.rotation.y = 0;
camera.rotation.z = 0;
window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

//LIGHTS
const light1 = new THREE.AmbientLight(0x003fff, 0.75);
const light2 = new THREE.PointLight(0xffff62, 0.6);
light1.position.x = 6;
light1.position.y = 7;
light1.position.z = 4;
light2.position.x = 0;
light2.position.y = 15;
light2.position.z = 5;
scene.add(light1);
scene.add(light2);

//OBJECT
const loader = new GLTFLoader();
let gl, mixer;
loader.load(
  "models/Animation.glb",
  function (gltf) {
    scene.add(gltf.scene);
    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object

    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.clipAction(gltf.animations[0]).play();
    gl = gltf;
  },

  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },

  function (error) {
    console.log("An error happened", error);
  }
);
//RENDER LOOP
requestAnimationFrame(render);
function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

let time = 0;
let delay = 0;
let acceleration = 0.15;
document.querySelector("#canvas").addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    delay += (time - delay) * acceleration;
    mixer.setTime(delay);
    time += 0.065;
  } else {
    delay -= (time - delay) * acceleration;
    mixer.setTime(delay);
    time -= 0.065;
  }
});

window.addEventListener("load", (e) => {
  alert("Scroll Up or Down to play the 3D animation.");
});
