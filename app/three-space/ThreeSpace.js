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
        //DEMO
        //this._demoAllPossibleLocations();
        this._demoSecondaryPossibleLocations();
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
            size: 275,  //includes thickness (on both sides)
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
            position: new THREE.Vector3(300, 300, 300)
        }).addTo(app);

        //light inside cube
        new WHS.PointLight({
            intensity: 1.1,
            distance: 400,
            position: new THREE.Vector3(210, 210, 210)
        }).addTo(app);

        //create loop
        new WHS.Loop(function () {
            cube.animate();
        }).start(app);

        //return the app
        return app;
    }
    
    /*
     * Primary formula: fundamental axis position
     * Secondary formula: affinity center of mass
     */
    _demoSecondaryPossibleLocations () {
        //define layout
        var size = 255,
            axes = [
                [0, 0, 0],          //medievalist: 
                [size, 0, 0],       //statist: 
                [size, 0, size],    //leftist: 
                [0, 0, size]        //conservative: 
            ],
            step = 20,
            threeApp = this._app,
            loopAxis = function (which, fundamental, prevAffinities=[]) {
                //loop axis
                for (let p=0; p<=100; p+=step) {
                    let affinities = prevAffinities.concat(p/100),
                        location;
                    
                    //if this is NOT the final loop
                    if (which+1 < axes.length) {
                        //recurse
                        loopAxis(which+1, fundamental, affinities);
                    }
                    else {
                        //this is the final loop, render a point
                        location = new Location({
                            point: ThreeSpace.calculatePosition(fundamental, affinities),
                            vectors: [],
                            thickness: 5
                        });
                        location.addTo(threeApp);
                    }
                }
            };
        
        //loop axes
        for (let axis=0; axis<axes.length; axis++) {
            loopAxis(0, axis);
        } 
    }
    
    /*
     * Uses Affinity center of mass formula.
     */
    _demoAllPossibleLocations () {
        //define layout
        var size = 245,
            axisDistance = 235,
            axes = [
                [10, 10, 10],          //medievalist: 
                //[size, 10, 10],       //statist: 
                //[size, 10, size],    //leftist: 
                //[10, 10, size]        //conservative: 
            ],
            step = 20,
            threeApp = this._app,
            loopAxis = function (which, prevPoints=[]) {
                //loop axis
                for (let p=0; p<=100; p+=step) {
                    let distance = axisDistance * (p/100),
                        //add point
                        points = prevPoints.concat([
                            axes[which].map(it => it + distance * (it > 100 ? -1 : 1))
                        ]),
                        location;
                    
                    //if this is NOT the final loop
                    if (which+1 < axes.length) {
                        //recurse
                        loopAxis(which+1, points);
                    }
                    else {
                        //this is the final loop, render a point
                        location = new Location({
                            point: [0,1,2].map(idx => 
                                points.reduce(
                                    (sum, point) => { return sum + point[idx]; },
                                    0
                                )/axes.length
                            ),
                            vectors: [],
                            thickness: 5
                        });
                        location.addTo(threeApp);
                    }
                }
            };
        
        //loop axes
        loopAxis(0);
    }
    
    
    // GETTERS
    app () {
        return this._app;
    }
    
    /**
     * Takes in a peron's fundamental idealogy and their political affinites.
     * Uses these to calculate a person's position in the cube.
     * @param {number} fundamentalAxis - Index of axis that's this person's
        fundamental position
     * @param {Object.<number, number>} axisAffinities - The percent values (in
        decimal form) of the affinities for each axis. 100% for the bottom
        vertex is 0.0, 100% for the top vertex is 1.0, %50/%50 is 0.5. An
        affinity of exactly .5 will result in an affinity for the upper vertex
        of that axis.
     * @return {number[]} - The [x, y, z] position for this person.
     */
    static calculatePosition (fundamentalAxis, axisAffinities) {
        //define layout properties
        var size = 255, //exludes thickness
            //define axes
            axes = [
                [0, 0, 0],          //Liberal/Medievalist
                [0, 0, size],        //Progressive/Conservative
                [size, 0, size],    //Right-Wing/Leftist
                [size, 0, 0]       //Libertarian/Statist
            ],
            //transform axes into vertices (maintain axis indexes)
            vertices = axes.map(function (axis) {
                return [
                    new THREE.Vector3(...axis),
                    new THREE.Vector3(...axis.map(it => it + size * (it < size/2 ? 1 : -1)))
                ];
            }),
            //get affinity for fundamental position
            fundamentalAffinity = axisAffinities[fundamentalAxis],
            //get vertices of fundamental axis
            fundamentalVertices = vertices[fundamentalAxis],
            //get fundamental vertex
            fundamentalVertex = fundamentalVertices[Math.round(fundamentalAffinity)],
            affinityPoints = [],
            fundamentalSphere, centerOfMass, comDirection, position;
        
        /*********************************************************************
         * Rules for calculating position                                    *
         *********************************************************************/

        /***
         * 1. Choose octant based on person's fundamental essence
         * 2. Place position in octant based on:
         *  a. Drawing a sphere that contains all points between the
                fundamental vertex and it's opposite vertex at the distance
                equal to the person's disposition (i.e. if 70% Right-Wing, then
                all the points that are 70% of the way between Right-Wing and
                Leftist). The center of the sphere will be at the fundamental
                vertex.
         */
        
        fundamentalSphere = new THREE.Sphere(
            //center
            fundamentalVertex,
            //radius
            fundamentalVertices[0].distanceTo(fundamentalVertices[1]) *
                (Math.min(fundamentalAffinity, 1-fundamentalAffinity))
        );
        
        /***
         *  b. For each affinity:
         */
        
        //loop affinity verices (vertices of the axes that are not the fundamental axis)
        for (let axis=0; axis<vertices.length; axis++) {
            if (axis == fundamentalAxis) {
                continue;
            }
            
            /***
             *   i. Drawing an affinity line between the fundamental vertex and the
             *      person's location on that affinity's axis (i.e. if 80% Liberal,
             *      then the point on the axis that is 80% of the way towards the
             *      liberal vertex).
             */
         
            //get axis vertices
            let axisVertices = vertices[axis];
            //determine the affinity's location on the axis
            let axisDirection = new THREE.Vector3();
            axisDirection.subVectors(axisVertices[1], axisVertices[0]).normalize();
            let affinityAxisPoint = new THREE.Vector3();
            new THREE.Ray(axisVertices[0], axisDirection).at(
                axisVertices[0].distanceTo(axisVertices[1]) * axisAffinities[axis],
                affinityAxisPoint
            );
            //draw affinity line
            let affinityDirection = new THREE.Vector3();
            affinityDirection.subVectors(affinityAxisPoint, fundamentalVertex).normalize();
            let affinityRay = new THREE.Ray(fundamentalVertex, affinityDirection);
            
            /***
             *   ii. Placing an affinity point on the sphere that is the
             *      intersection of the affinity line and the sphere. 
             */
            
            //store intersect point
            let intersectPoint = new THREE.Vector3();
            affinityRay.intersectSphere(fundamentalSphere, intersectPoint);
            affinityPoints.push(intersectPoint);
        }
        
        /***
         *  c. Calculating the center of mass in 3D space of the three affinity points.
         */
        
        centerOfMass = new THREE.Vector3(...["x", "y", "z"].map(
            ord => affinityPoints.reduce((acc, it) => acc + it[ord], 0)/affinityPoints.length
        ));
        
        /***
         *  d. Drawing a ray from the fundamental vertex (center of sphere)
         *      that goes through the 3D center of mass.
         *  e. The final position will be the point that the ray intersects the
         *      sphere.
         */
        
        comDirection = new THREE.Vector3();
        comDirection.subVectors(centerOfMass, fundamentalVertex).normalize();
        position = new THREE.Vector3();
        new THREE.Ray(fundamentalVertex, comDirection).intersectSphere(fundamentalSphere, position);
        
        // return the coordinates of our position
        return [
            position.x,
            position.y,
            position.z
        ];
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


