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

camera.position.x = 10;
camera.position.y = -10;
camera.position.z = 25;
camera.rotateX(Math.PI / 30);
camera.rotateY(Math.PI / 4);
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
const light1 = new THREE.AmbientLight(0xffffff, 0.5);
const light2 = new THREE.PointLight(0xffffff, 1);
scene.add(light1);
scene.add(light2);

//OBJECT
const loader = new GLTFLoader();
let gl, mixer;
loader.load(
  "models/Animation.glb",
  function (gltf) {
    scene.position.x = -10;
    scene.position.y = -10;
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
let acceleration = 2;
let isStopped = false;
document.querySelector("#canvas").addEventListener("wheel", (e) => {
  isStopped = false;
  if (e.deltaY > 0) {
    let t = setTimeout(() => {
      delay += (time - delay) * acceleration;
      mixer.setTime(delay);
      time += 0.05;
      if (isStopped) {
        time += 0.05;
        delay += (time - delay) * acceleration;
        mixer.setTime(delay);
      }
    }, 150);
    isStopped = true;
  } else {
    let t = setTimeout(() => {
      delay += (time - delay) * acceleration;
      mixer.setTime(delay);
      time -= 0.15;
      if (isStopped) {
        time += 0.05;
        delay += (time - delay) * acceleration;
        mixer.setTime(delay);
      }
    }, 150);
    isStopped = true;
  }
});
