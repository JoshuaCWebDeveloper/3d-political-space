/* Location.js
 * Renders the location of an idealogy the 3d space
 * Dependencies: three, whs modules, Vector class
 * Author: Joshua Carter
 * Created: December 30, 2018
 */
"use strict";
//import modules
import { MeshPhongMaterial, TextureLoader } from 'three';
import { Sphere } from 'whs';
//include classes
import { Vector } from './Vector.js';
//create class to represent a basic object
class Location {
    
    // - point (array - number) [x, y, z] of center point of location
    // - vectors (array - array[number]) List of [x, y, z] points to draw vectors to from center
    // - thickness (number) Value to serve as thickness of components
    constructor ({point=[0, 0, 0], vectors=[], thickness=0}) {
        //create start and end points of location
        var [x, y, z] = point,
            material;
        //initialize collection of WHS components
        this.components = [];
        
        //use same material for all components
        material = new MeshPhongMaterial({
            color: 0xcbd5e5,
            map: new TextureLoader().load('img/Wood_Texture_Bw_360x360.jpg')
            //shininess: 90
        });
        
        //create sphere, add to components
        this.components.push(
            new Sphere({
                geometry: {
                    radius: thickness
                },
                material,
                position: {x, y, z}
            })
        );
        
        //loop the vectors
        for (let i=0; i<vectors.length; i++) {
            //create vector, add to components
            this.components.push(
                new Vector({
                    vector: [point, vectors[i]],
                    thickness,
                    material
                })
            );
        }
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
//export Location class
export { Location };
