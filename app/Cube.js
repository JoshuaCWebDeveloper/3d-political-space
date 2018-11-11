/* Cube.js
 * Renders the cube for the 3d space
 * Dependencies: three, whs modules, utils functions
 * Author: Joshua Carter
 * Created: November 11, 2018
 */
"use strict";
//import modules
import { MeshBasicMaterial } from 'three';
import { Box } from 'whs';
//create class to represent a basic object
class Cube {
    
    // - center (array - number) [x, y, z] of center point of cube
    // - size (number) Value to serve as width, height, and depth of cube
    constructor ({center=[0, 0, 0], size=100, thickness=0}) {
        //create start and end points of cube
        var [x1, y1, z1] = center.map( p => p - size/2 ),
            [x2, y2, z2] = center.map( p => p + size/2 ),
            vectors;
        //initialize collection of WHS components
        this.components = [];
        
        //build cube comprised of 12 edges
        //three edges for each of 4 opposite corners
        vectors = [
            [[x1, y1, z1], [x1, y1, z2]],
            [[x1, y1, z1], [x1, y2, z1]],
            [[x1, y1, z1], [x2, y1, z1]],

            [[x1, y2, z2], [x1, y2, z1]],
            [[x1, y2, z2], [x1, y1, z2]],
            [[x1, y2, z2], [x2, y2, z2]],

            [[x2, y1, z2], [x2, y1, z1]],
            [[x2, y1, z2], [x2, y2, z2]],
            [[x2, y1, z2], [x1, y1, z2]],

            [[x2, y2, z1], [x2, y2, z2]],
            [[x2, y2, z1], [x2, y1, z1]],
            [[x2, y2, z1], [x1, y2, z1]]
        ];
        //loop the vectors
        for (let i=0; i<vectors.length; i++) {
            //create start and end points of vector
            let [[x1, y1, z1], [x2, y2, z2]] = vectors[i];
            //create Box, add it to components
            this.components.push(
                new Box({
                    geometry: {
                        width: Math.abs(x2-x1)+thickness,
                        height: Math.abs(y2-y1)+thickness,
                        depth: Math.abs(z2-z1)+thickness
                    },
                    material: new MeshBasicMaterial({
                        color: i*100000
                    }),
                    position: [
                        (x1+x2)/2,
                        (y1+y2)/2,
                        (z1+z2)/2
                    ]
                })
            );
            /* alternate method uses Line (has no thickness) instead of Box
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
        }
        
        /* alternate method that uses single Box to represent cube
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
    }
    
    addTo (instance) {
        //wraps .addTo() method of all of our WHS components
        //loop components
        for (let i=0; i<this.components.length; i++) {
            //call addTo()
            this.components[i].addTo(instance);
        }
    }

}
//export Cube class
export { Cube };
