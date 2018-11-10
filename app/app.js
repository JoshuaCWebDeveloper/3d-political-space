import * as THREE from 'three';
import * as WHS from 'whs';

//create controls
const OrbitControls = new WHS.OrbitControlsModule({
    target: new THREE.Vector3(128, 128, 128)
});

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
    OrbitControls,
    new WHS.ResizeModule()
]);

// Cube of Lines
const vectors = [
        [[0, 0, 0], [0, 0, 255]],
        [[0, 0, 0], [0, 255, 0]],
        [[0, 0, 0], [255, 0, 0]],

        [[0, 255, 255], [0, 255, 0]],
        [[0, 255, 255], [0, 0, 255]],
        [[0, 255, 255], [255, 255, 255]],

        [[255, 0, 255], [255, 0, 0]],
        [[255, 0, 255], [255, 255, 255]],
        [[255, 0, 255], [0, 0, 255]],

        [[255, 255, 0], [255, 255, 255]],
        [[255, 255, 0], [255, 0, 0]],
        [[255, 255, 0], [0, 255, 0]]
    ],
    thickness = 10;
for (let i=0; i<vectors.length; i++) {
    let [[x1, y1, z1], [x2, y2, z2]] = vectors[i];
    /*
    new WHS.Line({
        curve: new THREE.LineCurve3(
            new THREE.Vector3(...vectors[i][0]),
            new THREE.Vector3(...vectors[i][1])
        ),
        material: new THREE.MeshBasicMaterial({
            color: 0x0000ff
        })
    }).addTo(app);
    */
    new WHS.Box({
        geometry: {
            width: Math.abs(x2-x1)+thickness,
            height: Math.abs(y2-y1)+thickness,
            depth: Math.abs(z2-z1)+thickness
        },
        material: new THREE.MeshBasicMaterial({
            color: i*100000
        }),
        position: [
            Math.abs(x1-Math.abs(x2-x1)/2),
            Math.abs(y1-Math.abs(y2-y1)/2),
            Math.abs(z1-Math.abs(z2-z1)/2)
        ]
    }).addTo(app);
}

/*
//Box
new WHS.Box({
    geometry: {
        width: 255,
        height: 255,
        depth: 255
    },
    material: new THREE.MeshBasicMaterial({
        color: 0x0000ff
    }),
    position: [0, 0, 0]
}).addTo(app);
*/

/*
// Lights
new WHS.PointLight({
    light: {
        intensity: 0.5,
        distance: 100
    },

    shadow: {
        fov: 90
    },

    position: new THREE.Vector3(0, 10, 10)
}).addTo(app);

new WHS.AmbientLight({
    light: {
        intensity: 0.4
    }
}).addTo(app);
*/

// Start the app
app.start();

//set three.js params
OrbitControls.controls.maxDistance = 2000;
