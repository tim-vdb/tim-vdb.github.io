import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.0/build/three.module.js';
console.log(THREE, "THREE");
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.156.0/examples/jsm/loaders/GLTFLoader.js';
console.log(GLTFLoader, "GLTFLoader");
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.156.0/examples/jsm/controls/OrbitControls.js';
console.log(OrbitControls, "OrbitControls");
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.156.0/examples/jsm/postprocessing/EffectComposer.js';
console.log(EffectComposer, "EffectComposer");
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.156.0/examples/jsm/postprocessing/RenderPass.js';
console.log(RenderPass, "RenderPass");
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.156.0/examples/jsm/postprocessing/UnrealBloomPass.js';
console.log(UnrealBloomPass, "UnrealBloomPass");
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.156.0/examples/jsm/postprocessing/ShaderPass.js';
console.log(ShaderPass, "ShaderPass");
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.156.0/examples/jsm/loaders/RGBELoader.js'; // Remplacer EXRLoader par RGBELoader
console.log(RGBELoader, "RGBELoader");
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.156.0/examples/jsm/loaders/DRACOLoader.js'; // Remplacer EXRLoader par RGBELoader
console.log(DRACOLoader, "DRACOLoader");

const champis = document.getElementById('champis');
const divtest = document.getElementById("div_champis");
const realcanvasMustang = document.querySelector("#div_mustang canvas");


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, divtest.clientWidth / divtest.clientHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ champis, antialias: true });
renderer.setClearColor(0x1C1C1C, 1); // La couleur de fond est définie ici
renderer.setSize(divtest.clientWidth, divtest.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.gammaOutput = true;
// add the automatically created <canvas> element to the page
divtest.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

scene.background = new THREE.Color(0x444444);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // Intensité à 1.5
directionalLight.position.set(1, 5, 1); // Positionner la lumière
scene.add(directionalLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 1);
controls.minDistance = 0;
controls.maxDistance = 1.5;
controls.enablePan = false;
controls.update();

// Grid Helper
const gridHelper = new THREE.GridHelper(100, 100, 0xff0000);
scene.add(gridHelper);

// GLTF Loader
const loader = new GLTFLoader();

const dloader = new DRACOLoader();
dloader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
dloader.setDecoderConfig({ type: 'js' });
loader.setDRACOLoader(dloader);

loader.load("./public/couteauGLB.glb", function (gltf) {
    const mesh = gltf.scene;

    // Applique une rotation et ajoute le modèle à la scène
    mesh.rotation.y = -Math.PI / 2;
    mesh.position.set(-0.5, 0, -0.5);
    scene.add(mesh);

}, undefined, function (error) {
    console.error(error);
});

// Configurer l'effet de bloom
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1, // intensity
    1, // radius
    1 // threshold
);

// Composer de post-processing
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// function resizeMustang() {
//     const devicePixelRatio = window.devicePixelRatio || 1; // Ajuste pour les écrans haute résolution
//     const scale = devicePixelRatio > 1 ? 0.5 : 1; // Réduire la résolution sur les appareils haute résolution

//     const width = divtest.clientWidth * scale;  // Utiliser la largeur du parent div (divtest)
//     const height = divtest.clientHeight * scale; // Utiliser la hauteur du parent div (divtest)

//     champis.width = width;
//     champis.height = height;

//     // Redimensionner le rendu pour la nouvelle taille
//     renderer.setSize(width, height, false);
//     composer.setSize(width, height);  // Redimensionne aussi le composer
// }

// Redimensionner le canvas
function resizeMustang() {
    const width = divtest.clientWidth;
    const height = divtest.clientHeight;

    // realcanvasMustang.width = divtest.clientWidth;
    // realcanvasMustang.height = divtest.clientHeight;

    // Redimensionner le canvas en fonction du ratio de pixels de l'écran
    const pixelRatio = window.devicePixelRatio || 1;
    renderer.setSize(width * pixelRatio, height * pixelRatio, false); // Redimensionne le renderer
    composer.setSize(width * pixelRatio, height * pixelRatio); // Redimensionne aussi le composer

    // Met à jour le style du canvas (en CSS) pour correspondre à la taille de la div
    renderer.domElement.style.width = `${width}px`;
    renderer.domElement.style.height = `${height}px`;

    // Ajuste le rapport d'aspect de la caméra
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', resizeMustang);
resizeMustang();  // Appeler la fonction immédiatement

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);
    // Rendre d'abord l'environnement
    renderer.clear(); // Nettoyer le rendu précédent
    renderer.render(scene, camera); // Rendre la scène sans effets de bloom

    // Rendre la scène avec effet de bloom
    composer.render(); // Utiliser composer pour le rendu
}

animate();
champis.remove();


// const light = new THREE.PointLight(0xeeeeee);
// scene.add(light);
// light.position.set(0, 0, 3);
