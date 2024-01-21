import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const gui = new dat.GUI();

const debugObject = {
    rotationSpeed: 0.01,
};

gui.add(debugObject, 'rotationSpeed', 0, 0.1).name('Rotation Speed');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()
scene.background = new THREE.Color("#8C66E7");

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000)
camera.position.z = 8;
camera.position.y = 2.5;

cameraGroup.add(camera)

const light = new THREE.HemisphereLight(
    'white',
    'darkslategrey',
    2
);
camera.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const gltfLoader = new GLTFLoader();

let bunny = new THREE.Object3D();
gltfLoader.load('/assets/bunny.gltf', (gltf) => {
    bunny = gltf.scene;
    bunny.scale.set(1, 1, 1)
    bunny.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(bunny);
    addStarsAroundBunny();
});

const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
const textureLoader = new THREE.TextureLoader();
const planetTexture = textureLoader.load('/assets/Icy.png', () => {
    planetTexture.minFilter = THREE.LinearFilter;
    planetTexture.magFilter = THREE.LinearFilter;
    planetTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
});

const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.position.x = bunny.position.x;
planet.position.y = bunny.position.y - 1;
planet.position.z = bunny.position.z;
planet.receiveShadow = true;
scene.add(planet);

function addStarsAroundBunny() {
    const starCount = 100;
    const minDistance = 1;
    const starLoader = new GLTFLoader();
    starLoader.load('/assets/star.gltf', (gltf) => {
        const starGeometry = gltf.scene.children[0].geometry;

        for (let i = 0; i < starCount; i++) {
            const star = new THREE.Mesh(starGeometry, gltf.scene.children[0].material);
            let validPosition = false;

            while (!validPosition) {
                const radius = Math.random() * 20;
                const angle = Math.random() * Math.PI * 2;
                const x = bunny.position.x + radius * Math.cos(angle);
                const y = bunny.position.y + Math.random() * 20 - 4;
                const z = bunny.position.z + radius * Math.sin(angle);
                star.position.set(x, y, -3);
                validPosition = true;

                for (const otherStar of scene.children) {
                    if (otherStar instanceof THREE.Mesh && otherStar !== star) {
                        const distance = star.position.distanceTo(otherStar.position);

                        if (distance < minDistance) {
                            validPosition = false;
                            break;
                        }
                    }
                }
            }

            const scale = Math.random() * 0.5 + 0.1;
            star.scale.set(scale, scale, scale);
            star.rotation.set(Math.random() * Math.PI * 4, 0, 0);
            scene.add(star);
        }
    });
}

const cursor = {};
cursor.x = 0;
cursor.y = 0;
cursor.z = 0;

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
let previousTime = 0;
const objectsDistance = 4;
let rotateDirection = .06;
const rotationRange = Math.PI / 3;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    if (bunny) {
        bunny.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        bunny.rotation.y += debugObject.rotationSpeed;
    }

    const parallaxX = cursor.x * 0.3;
    const parallaxY = -cursor.y * 0.3;
    const parallaxZ = -cursor.z * 0.3;

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
    cameraGroup.position.z += (parallaxZ - cameraGroup.position.z) * 5 * deltaTime;

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
tick();
