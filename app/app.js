/* app.js
 * Main 3D Political Space app file
 * Dependencies: 
    - modules: three, whs
    - classes: Cube, ThreeOrbitControls
 * Author: Joshua Carter
 * Created: November 11, 2018
 */
"use strict";

//import modules
import * as THREE from 'three';
import * as WHS from 'whs';
//include classes
import { Cube } from './Cube.js';
import { ThreeOrbitControls } from './ThreeOrbitControls.js';

const app = new WHS.App([
    new WHS.ElementModule({
        container: document.getElementById('view-container')
    }),
    new WHS.SceneModule(),
    new WHS.CameraModule({
        far: 3000,
        position: {
            x: 422,
            y: 360,
            z: 369
        }
    }),
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
new Cube({
    center: [127.5, 127.5, 127.5],
    size: 255,
    thickness: 10
}).addTo(app);

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

// Start the app
app.start();
