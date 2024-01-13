import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("#8C66E7");


const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000)
camera.position.z = 8;
camera.position.y = 2.5;

cameraGroup.add(camera)
// const helperC = new THREE.CameraHelper( camera );
// scene.add( helperC );

const light = new THREE.HemisphereLight(
    'white',
    'darkslategrey',
    1.5
);
camera.add(light);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * OBJECTS
 */

// GLTF LOADER
const gltfLoader = new GLTFLoader();

// BUNNY
let bunny = new THREE.Object3D();
gltfLoader.load('/assets/bunny.gltf', (gltf) => {
    bunny = gltf.scene;

    bunny.scale.set(1, 1, 1)

    scene.add(bunny);

    addStarsAroundBunny();
});



// Function to add stars around the bunny
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

            // Random size
            const scale = Math.random() * 0.5 + 0.1; // Adjust the size range as needed
            star.scale.set(scale, scale, scale);

            // Random rotation
            star.rotation.set(Math.random() * Math.PI * 4, 0, 0);

            scene.add(star);
        }
    });
}


/**z
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;
cursor.z = 0;

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})


/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
const objectsDistance = 4;
let rotateDirection = .06;
const rotationRange = Math.PI / 3;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    if (bunny) {
        bunny.position.y = Math.sin(Date.now() * 0.001) * 0.2;

        bunny.rotation.y += 0.01 * rotateDirection;
        if (bunny.rotation.y > rotationRange || bunny.rotation.y < -rotationRange) {
            rotateDirection *= -1;
        }
    }

    // Animate camera

    const parallaxX = cursor.x * 0.3;
    const parallaxY = - cursor.y * 0.3;
    const parallaxZ = - cursor.z * 0.3;

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
    cameraGroup.position.z += (parallaxZ - cameraGroup.position.z) * 5 * deltaTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
tick()