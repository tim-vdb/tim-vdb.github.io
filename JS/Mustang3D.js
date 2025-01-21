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

const Mustang3D = document.getElementById('mustang');
const divtest = document.getElementById("div_mustang");
const realcanvasMustang = document.querySelector("#div_mustang canvas");


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, divtest.clientWidth / divtest.clientHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ Mustang3D, antialias: true });
renderer.setClearColor(0x1C1C1C, 1); // La couleur de fond est définie ici
renderer.setSize(divtest.clientWidth, divtest.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// add the automatically created <canvas> element to the page
divtest.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// Remplacer EXRLoader par RGBELoader pour charger un fichier HDR
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./public/wildflower_field_4k.hdr', function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    texture.dispose();
    pmremGenerator.dispose(); // Optionnel : Libère de la mémoire après génération
    renderer.toneMapping = THREE.ACESFilmicToneMapping;  // Choix de ToneMapping
    renderer.toneMappingExposure = 0.5;  // Vous pouvez ajuster cette valeur

    // Applique la map HDRI à la scène
    scene.environment = envMap;
    scene.background = new THREE.Color(0x444444);
});

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-2, 2, 4);
controls.minDistance = 4;
controls.maxDistance = 6;
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

loader.load("./public/mustang.glb", function (gltf) {
    const mesh = gltf.scene;

    // Applique une rotation et ajoute le modèle à la scène
    mesh.rotation.y = -Math.PI / 2;
    mesh.position.set(0, -0.1, 0);
    scene.add(mesh);

}, undefined, function (error) {
    console.error(error);
});

// Configurer l'effet de bloom
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5, // intensity
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

//     Mustang3D.width = width;
//     Mustang3D.height = height;

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
Mustang3D.remove();


// const light = new THREE.PointLight(0xeeeeee);
// scene.add(light);
// light.position.set(0, 0, 3);
