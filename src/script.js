import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */

// Debug Importer lil gui et l'instancier ici si besoin

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene Créer la scene ici
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000030) // Couleur de fond

/**
 * Textures Instancier le textureLoader ici pour ajouter les textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Objects
 */

// Création du Soleil
const sunGeometry = new THREE.SphereGeometry(1, 32, 32)
const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load('/textures/sunmap.png') })
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sunMesh)

// Création des planètes
const createPlanet = (radius, texturePath, position) => {
    const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const planetMaterial = new THREE.MeshLambertMaterial({ map: textureLoader.load(texturePath) });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.copy(position);
    scene.add(planetMesh);
    return planetMesh;
};

const mercury = createPlanet(0.1, '/textures/mercurymap.png', new THREE.Vector3(2, 0, 0));
const venus = createPlanet(0.2, '/textures/venusmap.png', new THREE.Vector3(4, 0, 0));
const earth = createPlanet(0.3, '/textures/earthmap.png', new THREE.Vector3(6, 0, 0));
const mars = createPlanet(0.2, '/textures/marsmap.png', new THREE.Vector3(9, 0, 0));
const jupiter = createPlanet(0.8, '/textures/jupitermap.png', new THREE.Vector3(12, 0, 0));
const saturn = createPlanet(0.6, '/textures/saturnmap.png', new THREE.Vector3(16, 0, 0));
const uranus = createPlanet(0.4, '/textures/uranusmap.png', new THREE.Vector3(20, 0, 0));
const neptune = createPlanet(0.4, '/textures/neptunemap.png', new THREE.Vector3(24, 0, 0));


// Ajout de la lumière ambiante
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Ajout de la lumière directionnelle
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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

/**
 * Camera Ajouter une camera ici
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 20, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

// Orbital periods in seconds
const mercuryOrbitPeriod = 1; // Adjust the orbital periods as needed
const venusOrbitPeriod = 2;
const earthOrbitPeriod = 3;
const marsOrbitPeriod = 4;
const jupiterOrbitPeriod = 5;
const saturnOrbitPeriod = 6;
const uranusOrbitPeriod = 7;
const neptuneOrbitPeriod = 8;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update planet positions based on orbital periods
    mercury.position.x = Math.cos(elapsedTime / mercuryOrbitPeriod) * 2;
    mercury.position.z = Math.sin(elapsedTime / mercuryOrbitPeriod) * 2;

    venus.position.x = Math.cos(elapsedTime / venusOrbitPeriod) * 4;
    venus.position.z = Math.sin(elapsedTime / venusOrbitPeriod) * 4;

    earth.position.x = Math.cos(elapsedTime / earthOrbitPeriod) * 6;
    earth.position.z = Math.sin(elapsedTime / earthOrbitPeriod) * 6;

    mars.position.x = Math.cos(elapsedTime / marsOrbitPeriod) * 9;
    mars.position.z = Math.sin(elapsedTime / marsOrbitPeriod) * 9;

    jupiter.position.x = Math.cos(elapsedTime / jupiterOrbitPeriod) * 12;
    jupiter.position.z = Math.sin(elapsedTime / jupiterOrbitPeriod) * 12;

    saturn.position.x = Math.cos(elapsedTime / saturnOrbitPeriod) * 16;
    saturn.position.z = Math.sin(elapsedTime / saturnOrbitPeriod) * 16;

    uranus.position.x = Math.cos(elapsedTime / uranusOrbitPeriod) * 20;
    uranus.position.z = Math.sin(elapsedTime / uranusOrbitPeriod) * 20;

    neptune.position.x = Math.cos(elapsedTime / neptuneOrbitPeriod) * 24;
    neptune.position.z = Math.sin(elapsedTime / neptuneOrbitPeriod) * 24;

    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};


tick()
