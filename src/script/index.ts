import * as THREE from 'three';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMapEnabled = true;
renderer.shadowMap.autoUpdate = true;
const domEl: HTMLCanvasElement = document.body.appendChild(renderer.domElement);
domEl.className = "renderItem";
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
///
const ballGeometry = new THREE.SphereGeometry(1, 16, 12);
const ballMaterial = new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0.4,

});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);
ball.position.set(3, 1, 3);
ball.castShadow = true;
ball.receiveShadow = true;
////
var texture = new THREE.TextureLoader().load("https://i.imgur.com/GBDT1aX.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4);
const tileMulti: number = 4;
const floorGeometry: THREE.Geometry = new THREE.PlaneGeometry(30, 30, 100 * tileMulti, 100 * tileMulti);
const floorMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF,
    //map: texture,
    blending: THREE.AdditiveBlending
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
//floor.castShadow = true;
floor.receiveShadow = true;

cube.castShadow = true;
cube.position.y = 2;
scene.add(floor);
floor.rotateX(Math.PI / -2.0);

camera.position.z = 50;
camera.position.y = 50;
camera.lookAt(0, 0, 0);


const createSpotlight = (x, y, z, color: any = 0xFFFFFF) => {

    const light = new THREE.SpotLight(color, 1, 200, 10);
    light.position.set(x, y, z);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;  // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5;       // default
    light.shadow.camera.far = 300      // default
    light.penumbra = 0.9;
    light.decay = 4;
    scene.add(light);
    light.lookAt(0, 2, 0);
    const spotLightHelper = new THREE.SpotLightHelper(light);
    scene.add(spotLightHelper);
    return light;
}
const lightList: THREE.SpotLight[] = [];
lightList.push(createSpotlight(20, 20, 20, 0x00FFFF));
lightList.push(createSpotlight(-20, 40, 20, 0xFF0000));
lightList.push(createSpotlight(0, 20, 0, 0x0000FF));

const toggleLight = (idx: number) => {
    lightList[idx].visible = !lightList[idx].visible;
};
document.getElementById("lightToggle0").onclick = toggleLight.bind(this, 0);
document.getElementById("lightToggle1").onclick = toggleLight.bind(this, 1);
document.getElementById("lightToggle2").onclick = toggleLight.bind(this, 2);

const dat = (el: HTMLCanvasElement) => {
    let mouseActive: boolean = false;
    let theta: number = 0;
    let phi: number = 90;
    let radius: number = 20;
    el.onmousedown = (event: MouseEvent) => {
        mouseActive = true;
    };
    el.onmouseup = (event: MouseEvent) => {
        mouseActive = false;
    };
    el.onmouseleave = (event: MouseEvent) => {
        mouseActive = false;
    };
    el.onmousemove = (event: MouseEvent) => {
        if (!mouseActive) {
            return;
        }
        theta = - ((event.movementX) * 0.5) + theta;
        phi = ((event.movementY) * 0.5) + phi;

        phi = Math.min(180, Math.max(1, phi));

        camera.position.x = radius * Math.sin(theta * Math.PI / 360)
            * Math.cos(phi * Math.PI / 360);
        camera.position.y = radius * Math.sin(phi * Math.PI / 360);
        camera.position.z = radius * Math.cos(theta * Math.PI / 360)
            * Math.cos(phi * Math.PI / 360);
        camera.updateMatrix();
        camera.lookAt(0, 0, 0);
    };
    el.onwheel = (event: MouseWheelEvent) => {
        console.log("scroll", event);
        radius = Math.min(200, Math.max(1, radius + (event.deltaY / 50)));

        camera.position.x = radius * Math.sin(theta * Math.PI / 360)
            * Math.cos(phi * Math.PI / 360);
        camera.position.y = radius * Math.sin(phi * Math.PI / 360);
        camera.position.z = radius * Math.cos(theta * Math.PI / 360)
            * Math.cos(phi * Math.PI / 360);
        camera.updateMatrix();
        camera.lookAt(0, 0, 0);
    };

};

dat(domEl);

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    ball.rotation.x += 0.01;
    ball.rotation.y += 0.02;
    renderer.render(scene, camera);
}
animate();