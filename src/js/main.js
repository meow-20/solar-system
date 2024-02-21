import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import stars from '../assets/stars.jpg';
import sunmap from '../assets/sunmap.jpg';
import mercurymap from '../assets/mercurymap.jpg';
import mercurybump from '../assets/mercurybump.jpg';
import venusmap from '../assets/venusmap.jpg';
import venusbump from '../assets/venusbump.jpg';
import saturnmap from '../assets/saturnmap.jpg';
import saturnring from '../assets/saturnrings.jpg';
import earthmap from '../assets/earthmap1k.jpg';
import uranusmap from '../assets/uranusmap.jpg';
import uranusring from '../assets/uranusrings.png';
import marsmap from '../assets/marsmap1k.jpg';
import marsbump from '../assets/marsbump1k.jpg';
import jupitermap from '../assets/jupitermap.jpg';
import neptunemap from '../assets/neptunemap.jpg';
import plutomap from '../assets/plutomap1k.jpg';



// lights camera action
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/ window.innerHeight,
    0.1,
    1000);
camera.position.set(0, 50, 200);
camera.lookAt(0, 0, 0);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00000f);
scene.add(camera);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#app").appendChild(renderer.domElement);

const gridHelper = new THREE.GridHelper(500, 30);
scene.add(gridHelper);


// --------------------------------------------------------------------------------------
// problem: cubeTexture doesnt add to the scene
// const cubeTexture = new THREE.CubeTextureLoader().load([
//     stars,
//     stars,
//     stars,
//     stars,
//     stars,
//     stars
// ]);

// scene.background = cubeTexture;
// ---------------------------------------------------------------------------------------


const textureLoader = new THREE.TextureLoader();

//sun
const sunGeo = new THREE.SphereGeometry(30, 32, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunmap),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);
sun.position.y = 16;

// light emitting from the sun
const pointLight = new THREE.PointLight(0xffffff, 300, 5000, 1.01);   // color, intensity, distance, decay 
sun.add(pointLight);


// create planets
function createPlanet(size, texture, position) {
    const planetGeo = new THREE.SphereGeometry(size, 32, 30);
    const planetMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
    // bumpMap: textureLoader.load(mercurybump),
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    // making a 3Dobject as a parent object for every planet
    const planetObj = new THREE.Object3D();
    planetObj.add(planet);
    scene.add(planetObj);
    planetObj.position.y = 16;
    planet.position.x = position;

    // rotation mate joise
    return {planetObj, planet};
}

// planets with rings
function createPlanetWithRings(size, texture, position, planetring, innerRadius, outerRadius){
    const planetGeo = new THREE.SphereGeometry(size, 32, 30);
    const planetMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
    // bumpMap: textureLoader.load(mercurybump),
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    // making a 3Dobject as a parent object for every planet
    const planetObj = new THREE.Object3D();
    planetObj.add(planet);
    scene.add(planetObj);
    planetObj.position.y = 16;
    planet.position.x = position;

    const planetRingGeo = new THREE.RingGeometry(innerRadius, outerRadius, 32);
    const planetRingMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(planetring),
    side:THREE.DoubleSide,
    });
    const planetRing = new THREE.Mesh(planetRingGeo, planetRingMat);
    // making a 3Dobject as a parent object for every planet
    planetObj.add(planetRing);
    planetRing.rotation.x = Math.PI / 2;
    planetRing.position.x = position;

    // rotation mate joise
    return {planetObj, planet};
}

const mercury = createPlanet(3.2, mercurymap, 35);
const venus = createPlanet(3.2, venusmap, 52);
const earth = createPlanet(4, earthmap, 65);
const mars = createPlanet(3, marsmap,80);
const jupiter = createPlanet(10, jupitermap, 100);
const saturn = createPlanetWithRings(4, saturnmap, 135, saturnring, 10, 17);
const uranus = createPlanetWithRings(5, uranusmap, 170,uranusring, 7, 10);
const neptune = createPlanet(5, neptunemap, 190);
const pluto = createPlanet(3, plutomap, 205);


const orbitControls = new OrbitControls(camera, renderer.domElement);


function action(){
    sun.rotateY(0.004);

    // self-rotation
    mercury.planet.rotation.y += 0.004;
    venus.planet.rotation.y -= 0.002;
    earth.planet.rotation.y += 0.02;
    mars.planet.rotation.y += 0.018;
    jupiter.planet.rotation.y += 0.04;
    saturn.planet.rotation.y += 0.038;
    neptune.planet.rotation.y += 0.032;
    uranus.planet.rotation.y -= 0.03;
    pluto.planet.rotation.y += 0.008;

    // around the sun rotation
    mercury.planetObj.rotation.y += 0.04;
    venus.planetObj.rotation.y += 0.015;
    earth.planetObj.rotation.y += 0.01;
    mars.planetObj.rotation.y += 0.008;
    jupiter.planetObj.rotation.y += 0.002;
    saturn.planetObj.rotation.y += 0.0009;
    neptune.planetObj.rotation.y += 0.0004;
    uranus.planetObj.rotation.y -= 0.0001;
    pluto.planetObj.rotation.y += 0.00007;


    orbitControls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(action);

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})