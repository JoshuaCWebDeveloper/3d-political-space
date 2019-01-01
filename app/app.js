/* app.js
 * Main 3D Political Space app file
 * Dependencies: 
    - modules: query-string, three, whs
    - classes: Cube, Location, ThreeOrbitControls
 * Author: Joshua Carter
 * Created: November 11, 2018
 */
"use strict";

//import modules
import qs from 'query-string';
import * as THREE from 'three';
import * as WHS from 'whs';
//include classes
import { Cube } from './Cube.js';
import { Location } from './Location.js';
import { ThreeOrbitControls } from './ThreeOrbitControls.js';

//parse params
const params = Object.assign({
    title: '',
    location: "",
    vectors: []
}, qs.parse(window.location.search));

//create camera
const camera = new WHS.CameraModule({
    far: 3000,
    position: {
        x: 471,
        y: 399,
        z: 409
    }
});

//create app
const app = new WHS.App([
    new WHS.ElementModule({
        container: document.getElementById('view-container')
    }),
    new WHS.SceneModule(),
    camera,
    new WHS.RenderingModule({
        bgColor: 0x162129,

        renderer: {
            antialias: true,
            shadowmap: {
                type: THREE.PCFSoftShadowMap
            }
        }
    }, {
        shadow: true
    }),
    new ThreeOrbitControls({
        target: new THREE.Vector3(127.5, 127.5, 127.5),
        maxDistance: 2000
    }),
    new WHS.ResizeModule()
]);

//render components
const cube = new Cube({
    camera: camera.camera,
    center: [127.5, 127.5, 127.5],
    size: 255,
    thickness: 10
});
cube.addTo(app);

const location1 = new Location({
    point: [210, 200, 100],
    vectors: [[245, 50, 220], [235, 230, 50]],
    thickness: 5,
    cube
});
location1.addTo(app);

//render lights
//environmental ambient light
new WHS.AmbientLight({
    intensity: 0.9
}).addTo(app);

//light outside cube
new WHS.PointLight({
    intensity: 1.5,
    distance: 600,
    position: new THREE.Vector3(280, 280, 280)
}).addTo(app);

//light inside cube
new WHS.PointLight({
    intensity: 1.1,
    distance: 400,
    position: new THREE.Vector3(200, 200, 200)
}).addTo(app);

//create loop
new WHS.Loop(function () {
    cube.animate();
}).start(app);

// Start the app
app.start();
