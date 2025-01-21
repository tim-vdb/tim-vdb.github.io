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

// Shader de Kirsch
const KirschShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'resolution': { value: new THREE.Vector2() }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;

        mat3 kirschKernelX = mat3(
            5.0,  5.0,  5.0,
            -3.0,  0.0, -3.0,
            -3.0, -3.0, -3.0
        );

        mat3 kirschKernelY = mat3(
            5.0, -3.0, -3.0,
            5.0,  0.0, -3.0,
            5.0, -3.0, -3.0
        );

        float applyKirsch(mat3 kernel, vec2 uv, vec2 texelSize) {
            float edge = 0.0;
            for (int i = -1; i <= 1; i++) {
                for (int j = -1; j <= 1; j++) {
                    vec2 offset = texelSize * vec2(float(i), float(j));
                    vec4 color = texture2D(tDiffuse, uv + offset);
                    edge += kernel[i + 1][j + 1] * color.r;
                }
            }
            return edge;
        }

        void main() {
            vec2 texelSize = 0.2 / resolution;
            float edgeX = applyKirsch(kirschKernelX, vUv, texelSize);
            float edgeY = applyKirsch(kirschKernelY, vUv, texelSize);
            float edge = sqrt(edgeX * edgeX + edgeY * edgeY);

            vec4 originalColor = texture2D(tDiffuse, vUv);
            vec3 edgeColor = vec3(1.0, 0.5, 0.0);
            float intensity = clamp(edge, 0.0, 0.4);

            vec3 finalColor = mix(originalColor.rgb, edgeColor, intensity);
            finalColor *= (0.2 + intensity);
            finalColor += edgeColor * intensity * 0.5;
            
            gl_FragColor = vec4(finalColor, originalColor.a);
        }
    `
};

// Configuration de la scène, de la caméra et du rendu
const canvas = document.getElementById("canvas"); // Canvas du loader
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x1C1C1C, 1); // La couleur de fond est définie ici
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 9);
// controls.update();

// Configurer l'effet de post-processing et les passes
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.6, // intensity
    1,   // radius
    0    // threshold
);

const kirschPass = new ShaderPass(KirschShader);
kirschPass.uniforms['resolution'].value.set(window.innerWidth, window.innerHeight);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(kirschPass);


// Loader pour le modèle GLTF
const loader = new GLTFLoader();
const animationDelay = 300;
let mixer;

loader.load("./public/Code3D.glb", function (gltf) {
    const mesh = gltf.scene;

    // Applique une rotation et ajoute le modèle à la scène
    mesh.rotation.y = -Math.PI / 2;
    mesh.position.set(-0.2, 0, 0);
    scene.add(mesh);

    if (!gltf.animations.length) {
        console.warn('Le modèle GLTF ne contient aucune animation.');
    }

    // Active les animations
    if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(mesh);
        gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            setTimeout(() => {
                action.timeScale = 4; // Vitesse animation
                action.play(); // Démarre l'animation après le délai
            }, animationDelay);
        });
    }
}, undefined, function (error) {
    console.error(error);
});

// Ajouter de la lumière
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Fonction d'animation avec limite de fréquence d'images (30 FPS)
let lastFrameTime = 0;
const frameInterval = 1000 / 30;  // 30 FPS


// Fonction pour redimensionner le canvas du loader
function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;

    // Ajuster la taille du canvas avec le ratio de pixels
    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight ;

    // Ajuster le style CSS pour que la taille visible corresponde à la taille de la fenêtre
    renderer.setSize(canvas.width, canvas.height, false); // Redimensionne le renderer
    composer.setSize(canvas.width, canvas.height); // Redimensionne aussi le composer

    // Met à jour le style du canvas (en CSS) pour correspondre à la taille de la div
    renderer.domElement.style.width = `${window.innerWidth}px`;
    renderer.domElement.style.height = `${window.innerHeight}px`;

    // Mettre à jour la matrice de projection de la caméra après redimensionnement
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Ajuster le champ de vision (FOV) ou la position en fonction du ratio d'aspect
    if (canvas.width < 1024) {
            // Mode portrait : si la hauteur est plus grande ou égale à la largeur
            camera.fov = 75; // Champ de vision par défaut ou plus grand pour dézoomer
            camera.position.set(-0.25, 0, 15); // Ajuster selon le modèle
    } else {
        camera.position.set(0, 0, 9);
    }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function animate(time) {
    requestAnimationFrame(animate);
    
    // Limite la fréquence d'images
    if (time - lastFrameTime < frameInterval) return;
    lastFrameTime = time;

    if (mixer) mixer.update(0.01);
    composer.render();
}

animate();

// const light = new THREE.PointLight(0xeeeeee);
// scene.add(light);
// light.position.set(0, 0, 3);

// // Grid Helper
// const gridHelper = new THREE.GridHelper(100, 100, 0xff0000);
// scene.add(gridHelper);
