/* ThreeSpace.js
 * Represents the 3D model for the political space
 * Dependencies: 
    - modules: jcscript, three, whs
    - classes: Cube, Location, ThreeOrbitControls
 * Author: Joshua Carter
 * Created: July 13, 2019
 */
"use strict";

//import modules
import { JCObject } from 'jcscript';
import * as THREE from 'three';
import * as WHS from 'whs';
//include classes
import { Cube } from './Cube.js';
import { Location } from './Location.js';
import { ThreeOrbitControls } from './ThreeOrbitControls.js';

//create settings class
class Settings extends JCObject {
    constructor (settings) {
        //call parent
        super({
            containerElement: null,
            location: [],
            vectors: []
        });
        //update data
        this.update(settings);
    }
    
    
    // GETTERS
    containerElement () {
        return this._containerElement;
    }
}

//create ThreeSpace class
class ThreeSpace {
    
    constructor (settings) {
        //store settings
        this._Settings = new Settings(settings);
        //init app
        this._app = this._createApp();
        //start the app
        this._app.start();
    }
    
    _createApp () {
        //get settings
        var settings = this._Settings.get();
        //create camera
        const camera = new WHS.CameraModule({
            far: 3000,
            position: {
                x: 471,
                y: 399,
                z: 409
            }
        });

        //create ThreeSpace
        const app = new WHS.App([
            new WHS.ElementModule({
                container: this._Settings.containerElement()
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

        //if we were given a location
        if (settings.location.length) {
            //render it
            const location1 = new Location({
                point: settings.location,
                vectors: settings.vectors,
                thickness: 5
            });
            location1.addTo(app);
        }

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

        //return the app
        return app;
    }
    
    
    // GETTERS
    app () {
        return this._app;
    }
    
    
    // SETTERS
    update (settings) {
        console.warning(
            "ThreeSpace.update() not implemented yet. Destroy and construct new ThreeSpace object instead."
        );
    }
    
    
    destroy () {
        //no destroy method on app, stop the loop
        this._app.stop();
    }
    
}

//export ThreeSpace
export { ThreeSpace };


