/* Cube.js
 * Renders the cube for the 3d space
 * Dependencies: three, whs modules, utils functions
 * Author: Joshua Carter
 * Created: November 11, 2018
 */
"use strict";
//import modules
import { MeshPhongMaterial } from 'three';
import { Box } from 'whs';
//include utils
import { generateGradientTexture } from './util.js';
//create class to represent a basic object
class Cube {
    
    // - center (array - number) [x, y, z] of center point of cube
    // - size (number) Value to serve as width, height, and depth of cube
    constructor ({center=[0, 0, 0], size=100, thickness=0}) {
        //create start and end points of cube
        var [x1, y1, z1] = center.map( p => p - size/2 ),
            [x2, y2, z2] = center.map( p => p + size/2 ),
            //store center
            [cx, cy, cz] = center,
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
            let [[x1, y1, z1], [x2, y2, z2]] = vectors[i],
                //calculate raw dimensions (w=Math.abs(x2-x1))
                [w, h, d] = vectors[i][1].map((p, idx) => Math.abs(p-vectors[i][0][idx])),
                //add thickness to dimensions
                [rw, rh, rd] = [w, h, d].map(d => d+thickness),
                //calculate position (center) of box
                px = (x1+x2)/2,
                py = (y1+y2)/2,
                pz = (z1+z2)/2,
                //create colors (convert x,y,z coordinates to hex RGB)
                colors = [
                    "#" + x1.toString(16).padStart(2, "0") +
                        y1.toString(16).padStart(2, "0") +
                        z1.toString(16).padStart(2, "0"),
                    "#" + x2.toString(16).padStart(2, "0") +
                        y2.toString(16).padStart(2, "0") +
                        z2.toString(16).padStart(2, "0")
                ],
                material;
            
            /* 
             * Create an array of materials,
             * one material for each side of the box we will create.
             * The gradients will need to run in different directions based on direction of box.
             * The ends of the box will need to be a solid color.
             * 
             * An array material will be converted to a gradient,
             * the array is the linearCoordinates of the gradient.
             * A string material will be converted to a solid color.
             * 
             * Order of materials based on which side they are applied to:
             *  +x, -x, +y, -y, +z, -z ]
             * 
             */
            
            //x-axis boxes
            if (w) {
                material = [
                    x1>x2 ? colors[0] : colors[1],
                    x1<x2 ? colors[0] : colors[1],
                    [x1, y1, x2, y2],
                    [x1, y1, x2, y2],
                    [x1, y1, x2, y2],
                    [x2, y2, x1, y1]
                ];
            }
            else if (h) {
                material = [
                    [x2, y2, x1, y1],
                    [x2, y2, x1, y1],
                    y1>y2 ? colors[0] : colors[1],
                    y1<y2 ? colors[0] : colors[1],
                    [x2, y2, x1, y1],
                    [x2, y2, x1, y1]
                ];
            }
            else if (d) {
                material = [
                    [z2, y2, z1, y1],
                    [z1, y1, z2, y2],
                    [x1, z1, x2, z2],
                    [x2, z2, x1, z1],
                    z1>z2 ? colors[0] : colors[1],
                    z1<z2 ? colors[0] : colors[1]
                ];
            }
            
            //create Box, add it to components
            this.components.push(
                new Box({
                    geometry: {
                        width: rw,
                        height: rh,
                        depth: rd
                    },
                    material: material.map(function (r) {
                        //if this is a string
                        if (typeof r == "string") {
                            /*
                            //then it is a color, convert it to a hexadecimal number
                            return new MeshBasicMaterial({
                                color: Number(r.replace("#", "0x")),
                                map: new TextureLoader().load('img/Wood_Texture_Grayscale_360x360.jpg')
                            });
                            */
                            //return no texture for solid colors
                            return null;
                        }
                        //else, it is linearCoordinates for a gradient
                        return new MeshPhongMaterial({
                            map: generateGradientTexture({
                                colors: colors,
                                imageOpacity: 0.8,
                                imageTexture: 'img/Wood_Texture_Grayscale_360x360.jpg',
                                linearCoordinates: r,
                                canvasDimensions: [
                                    (Math.abs(r[0]-r[2])+thickness),
                                    (Math.abs(r[1]-r[3])+thickness)
                                ]
                            })
                        });
                    }),
                    position: [px, py, pz]
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
